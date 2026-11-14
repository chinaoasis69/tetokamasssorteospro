const periodo = '2026Q4';
const raiz = '/datos-fiscales/texas/' + periodo + '/';
const estatal = 62500; // Millonésimas (6.25 %). Texas Comptroller: comptroller.texas.gov/taxes/sales/
const porcentaje = tasa => new Intl.NumberFormat('es-MX', {
    style: 'percent', maximumFractionDigits: 4
}).format(tasa / 1000000);

function normalizar(texto) {
    return texto.toUpperCase().trim().replace(/\s+/g, ' ');
}

function trimestreVigente() {
    const partes = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Chicago', year: 'numeric', month: 'numeric'
    }).formatToParts(new Date());
    const valor = campo => partes.find(p => p.type === campo).value;
    return valor('year') + 'Q' + Math.ceil(Number(valor('month')) / 3);
}

function callesParecidas(entrada, calle) {
    // Sugerir singular/plural solo si el resto del nombre coincide.
    return entrada + 'S' === calle || calle + 'S' === entrada;
}

function contieneNumero(intervalos, numero) {
    for (let i = 0; i < intervalos.length; i += 2) {
        const desde = intervalos[i];
        if (numero < desde) return false;
        if (numero <= intervalos[i + 1] && numero % 2 === desde % 2) return true;
    }
    return false;
}

function evaluarCalle(grupos, numero, ciudad) {
    const coinciden = grupos.filter(([localidad, , intervalos]) =>
        (localidad === ciudad || !localidad) && contieneNumero(intervalos, numero));
    if (!coinciden.some(([localidad]) => localidad === ciudad)) return null;
    const claves = new Set(coinciden.map(([, clave]) => clave));
    if (claves.has('?')) return {aviso: 'El registro tiene una excepción para este domicilio. Verifícalo en el localizador oficial.'};
    if (claves.size !== 1) return {aviso: 'Los rangos coincidentes tienen jurisdicciones distintas. Verifica el domicilio en el localizador oficial.'};
    return {codigos: [...claves][0].split(',').filter(Boolean)};
}

async function respuesta(archivo, signal) {
    const res = await fetch(raiz + archivo, {signal, credentials: 'omit', referrerPolicy: 'no-referrer'});
    if (!res.ok) throw new Error('No se pudo leer ' + archivo);
    return res;
}

async function leerZona(prefijo, signal) {
    const res = await respuesta(prefijo + '.bin', signal);
    if (!res.body) throw new Error('No se recibió el índice');
    const stream = res.body.pipeThrough(new DecompressionStream('gzip'));
    const zona = await new Response(stream).json();
    if (zona.periodo !== periodo || zona.prefijo !== prefijo || !zona.direcciones) throw new Error('Índice fuera de periodo');
    return zona.direcciones;
}

export function montarLocalizadorFiscalTexas(host, codigoPostal) {
    host.innerHTML = `
        <details class="card">
            <summary style="cursor:pointer">Consultar tasa por domicilio en Texas</summary>
            <form style="display:grid;gap:10px;text-align:left">
                <label>Número y calle (sin departamento ni unidad)
                    <input name="calle" required maxlength="140" autocomplete="off" style="width:95%"></label>
                <label>Ciudad <input name="ciudad" required maxlength="80" style="width:95%"></label>
                <label>Código postal de Texas
                    <input name="zip" required maxlength="10" pattern="[0-9]{5}(-[0-9]{4})?" style="width:95%"></label>
                <p>Rangos de domicilios y tasas del Texas Comptroller · octubre a diciembre de 2026. La consulta usa los primeros cinco dígitos del ZIP.</p>
                <button type="submit">Consultar tasa</button>
            </form>
            <p data-mensaje role="status" aria-live="polite"></p>
            <div data-desglose></div>
            <a href="https://gis.cpa.texas.gov/search/" target="_blank" rel="noopener noreferrer">Abrir el localizador oficial de Texas ↗</a>
        </details>`;
    const ficha = host.querySelector('details');
    const form = ficha.querySelector('form');
    const campos = form.elements;
    const boton = form.querySelector('button');
    const mensaje = ficha.querySelector('[data-mensaje]');
    const desglose = ficha.querySelector('[data-desglose]');
    let peticion, catalogo, ultimaZona;

    function limpiar() {
        peticion?.abort();
        peticion = undefined;
        boton.disabled = false;
        mensaje.textContent = '';
        desglose.replaceChildren();
    }

    function vigente() {
        if (trimestreVigente() === periodo) return true;
        desglose.replaceChildren();
        mensaje.textContent = 'Los datos corresponden a octubre–diciembre de 2026. Consulta la tasa vigente en el localizador oficial.';
        return false;
    }

    function mostrar(resultado, direccion) {
        desglose.replaceChildren();
        if (!vigente()) return;
        if (resultado.aviso) {
            mensaje.textContent = resultado.aviso;
            return;
        }
        const lista = document.createElement('ul');
        let local = 0;
        const lineas = ['Texas (estatal) · ' + porcentaje(estatal)];
        for (const codigo of resultado.codigos) {
            const item = catalogo.tasas[codigo];
            if (!Array.isArray(item) || !Number.isSafeInteger(item[1]) || item[1] < 0) {
                mensaje.textContent = 'Falta una tasa de jurisdicción. Usa el localizador oficial.';
                return;
            }
            local += item[1];
            lineas.push(item[0] + ' (' + codigo + ') · ' + porcentaje(item[1]));
        }
        if (local > 20000) {
            mensaje.textContent = 'El desglose excede el máximo local. Usa el localizador oficial.';
            return;
        }
        if (!resultado.codigos.length) lineas.push('Impuesto local · ' + porcentaje(0));
        for (const linea of lineas) {
            const li = document.createElement('li');
            li.textContent = linea;
            lista.append(li);
        }
        desglose.append(lista);
        mensaje.textContent = 'Tasa del domicilio: ' + porcentaje(estatal + local) + ' · ' + direccion + ' · ' + periodo;
    }

    form.addEventListener('input', limpiar);
    form.addEventListener('submit', async evento => {
        evento.preventDefault();
        if (boton.disabled || !form.reportValidity()) return;
        limpiar();
        if (!vigente()) return;
        const direccion = /^(\d{1,9})\s+(.+)$/.exec(normalizar(campos.calle.value));
        const ciudad = normalizar(campos.ciudad.value);
        const zip = campos.zip.value.trim().slice(0, 5);
        if (!direccion || !ciudad) {
            mensaje.textContent = 'Escribe el número, la calle y la ciudad. Para números con letras o fracciones, usa el localizador oficial.';
            return;
        }
        const numero = Number(direccion[1]);
        const calle = direccion[2];
        const prefijo = zip.slice(0, 3);
        const control = new AbortController();
        peticion = control;
        boton.disabled = true;
        mensaje.textContent = 'Consultando los rangos de Texas…';
        const tiempo = setTimeout(() => control.abort(), 30000);
        const sinCoincidencia = 'No hay un rango confirmado para este número, calle, ciudad y ZIP. Comprueba los datos o usa el localizador oficial.';
        try {
            if (!catalogo) {
                const datos = await (await respuesta('jurisdicciones.json', control.signal)).json();
                if (peticion !== control) return;
                if (datos.periodo !== periodo || !Array.isArray(datos.prefijos) || !datos.tasas) throw new Error('Catálogo inválido');
                catalogo = datos;
            }
            if (!catalogo.prefijos.includes(prefijo)) {
                mensaje.textContent = sinCoincidencia;
                return;
            }
            if (ultimaZona?.prefijo !== prefijo) {
                const datos = await leerZona(prefijo, control.signal);
                if (peticion !== control) return;
                ultimaZona = {prefijo, datos};
            }
            const calles = ultimaZona.datos[zip] || {};
            const direccionOficial = nombre => numero + ' ' + nombre + ', ' + ciudad + ', TX ' + zip;
            if (Object.hasOwn(calles, calle)) {
                const exacto = evaluarCalle(calles[calle], numero, ciudad);
                if (exacto) mostrar(exacto, direccionOficial(calle));
                else mensaje.textContent = sinCoincidencia;
                return;
            }
            const opciones = Object.keys(calles).filter(nombre => callesParecidas(calle, nombre))
                .map(nombre => ({nombre, resultado: evaluarCalle(calles[nombre], numero, ciudad)}))
                .filter(opcion => opcion.resultado);
            if (!opciones.length) {
                mensaje.textContent = sinCoincidencia;
                return;
            }
            mensaje.textContent = 'La calle está escrita de otra forma en el registro. Confirma el domicilio para consultar la tasa.';
            for (const {nombre, resultado} of opciones) {
                const confirmar = document.createElement('button');
                confirmar.type = 'button';
                confirmar.textContent = 'Confirmar ' + direccionOficial(nombre);
                confirmar.addEventListener('click', () => {
                    campos.calle.value = numero + ' ' + nombre;
                    mostrar(resultado, direccionOficial(nombre));
                }, {once:true});
                desglose.append(confirmar);
            }
        } catch {
            if (peticion === control) mensaje.textContent = 'No se pudo leer el índice de Texas. Reintenta o abre el localizador oficial.';
        } finally {
            clearTimeout(tiempo);
            if (peticion === control) {
                peticion = undefined;
                boton.disabled = false;
            }
        }
    });

    function abrir(postal) {
        limpiar();
        campos.calle.value = campos.ciudad.value = '';
        campos.zip.value = postal;
        ficha.open = true;
        ficha.scrollIntoView({block:'nearest'});
        campos.calle.focus();
    }
    if (codigoPostal !== undefined) abrir(codigoPostal);
    return abrir;
}
