"""Regenera el índice de consulta desde el ZIP estatal y el CSV de tasas del mismo trimestre.

Ejemplo: python3 scripts/generar_rangos_texas.py 2026Q4 TX_Address_Ranges-2026Q4.zip tax_jurisdiction_rates-2026Q4.csv datos-fiscales/texas
"""
import argparse
import csv
import gzip
import io
import json
import re
import tempfile
import zipfile
from collections import defaultdict
from decimal import Decimal
from pathlib import Path


def json_bytes(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':')).encode('utf-8')


def load_rates(path):
    rates = {}
    with path.open(encoding='utf-8-sig') as stream:
        rows = csv.reader(line.rstrip() for line in stream)
        if next(rows) != ['Name', 'TAID', 'Tax Rate']:
            raise ValueError('Columnas del catálogo de tasas inesperadas')
        for name, code, rate in rows:
            points = Decimal(rate) * 1000000
            if code in rates or not re.fullmatch(r'\d{7}', code) or points != int(points) or not 0 <= points <= 20000:
                raise ValueError(f'Tarifa no compatible: {code}')
            rates[code] = [name.strip(), int(points)]
    return rates


def stage_ranges(archive, directory, rates):
    writers = {}
    try:
        with zipfile.ZipFile(archive) as z, z.open('TX_Address_Ranges.csv') as raw:
            rows = csv.DictReader(io.TextIOWrapper(raw, encoding='cp1252', newline=''))
            authority_fields = [k for k in rows.fieldnames if 'TAID' in k]
            if len(authority_fields) != 9 or 'Unique Authority TAID' not in authority_fields:
                raise ValueError('Columnas de jurisdicciones inesperadas')
            for row in rows:
                zipcode = row['Zip']
                if not re.fullmatch(r'[0-9]{5}', zipcode) or row['St'] != 'TX':
                    continue
                parity = row['Even-Odd']
                # Los números alfanuméricos o fraccionarios se remiten al localizador oficial.
                if not row['From'].isascii() or not row['From'].isdigit() or not row['To'].isascii() or not row['To'].isdigit():
                    continue
                start, end = sorted([int(row['From']), int(row['To'])])
                if parity not in ('O', 'E'):
                    raise ValueError('Paridad inesperada en un rango numérico')
                bit = int(parity == 'O')
                start += (start - bit) % 2
                end -= (end - bit) % 2
                if end < start:
                    continue
                street = ' '.join(' '.join(row[k] for k in ('Pre Dir','Street','Suffix','Post Dir')).upper().split())
                city = ' '.join(row['Postal City'].upper().split())
                codes = sorted(set(row[k] for k in authority_fields) - {''})
                # Una excepción, distrito único o tasa desconocida exige comprobación manual.
                key = ','.join(codes)
                if (row['Rec Type'] != 'R' or row['Error Number'] or row['Unique Authority TAID']
                        or any(c not in rates for c in codes) or sum(rates[c][1] for c in codes) > 20000):
                    key = '?'
                prefix = zipcode[:3]
                if prefix not in writers:
                    stream = (directory / prefix).open('w', encoding='utf-8', newline='')
                    writers[prefix] = stream, csv.writer(stream)
                writers[prefix][1].writerow((zipcode, street, city, key, start, end))
    finally:
        for stream, _ in writers.values():
            stream.close()


def build_shard(path, quarter):
    groups = defaultdict(list)
    with path.open(encoding='utf-8', newline='') as stream:
        for zipcode, street, city, codes, start, end in csv.reader(stream):
            lo = int(start)
            groups[zipcode, street, city, codes, lo % 2].append((lo, int(end)))
    index = {}
    for (zipcode, street, city, codes, _), ranges in sorted(groups.items()):
        # Fusionar solamente intervalos adyacentes o solapados con la misma paridad y jurisdicción.
        merged = []
        for lo, hi in sorted(ranges):
            if merged and lo <= merged[-1] + 2:
                merged[-1] = max(merged[-1], hi)
            else:
                merged.extend((lo, hi))
        streets = index.setdefault(zipcode, {})
        streets.setdefault(street, []).append([city, codes, merged])
    return {'periodo':quarter, 'prefijo':path.name, 'direcciones':index}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('periodo')
    parser.add_argument('rangos', type=Path)
    parser.add_argument('tasas', type=Path)
    parser.add_argument('destino', type=Path)
    args = parser.parse_args()
    if not re.fullmatch(r'\d{4}Q[1-4]', args.periodo) or any(args.periodo not in p.name for p in (args.rangos, args.tasas)):
        parser.error('Verifica que las dos fuentes correspondan al trimestre indicado')
    target = args.destino / args.periodo
    target.mkdir(exist_ok=True, parents=True)
    rates = load_rates(args.tasas)
    with tempfile.TemporaryDirectory() as tmp:
        stage_ranges(args.rangos, Path(tmp), rates)
        prefixes = []
        for path in sorted(Path(tmp).iterdir()):
            data = json_bytes(build_shard(path, args.periodo))
            (target / (path.name + '.bin')).write_bytes(gzip.compress(data, compresslevel=8, mtime=0))
            prefixes.append(path.name)
    catalog = {'periodo':args.periodo, 'prefijos':prefixes, 'tasas':rates}
    (target / 'jurisdicciones.json').write_bytes(json_bytes(catalog) + b'\n')


if __name__ == '__main__':
    main()
