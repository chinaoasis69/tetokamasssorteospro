-- SORTEOS-EXTERNOS-07 | Mínimo de participación del primer intento externo.
-- Ejecutar el archivo completo. Las condiciones se toman al programar un intento
-- nuevo. Una rifa histórica sin esas condiciones no se reconstruye retroactivamente.
BEGIN;

CREATE TABLE IF NOT EXISTS mass_sorteos_externos.condiciones_primer_corte (
    rifa_id uuid PRIMARY KEY,
    numero_intento integer NOT NULL CHECK (numero_intento = 1),
    total_numeros bigint NOT NULL CHECK (total_numeros > 0),
    porcentaje_minimo smallint NOT NULL CHECK (porcentaje_minimo BETWEEN 0 AND 100),
    minimo_boletos bigint GENERATED ALWAYS AS
        (ceil(total_numeros::numeric * porcentaje_minimo / 100)::bigint) STORED,
    FOREIGN KEY (rifa_id, numero_intento)
        REFERENCES mass_sorteos_externos.intentos (rifa_id, numero_intento) ON DELETE RESTRICT
);

ALTER TABLE mass_sorteos_externos.condiciones_primer_corte ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.condiciones_primer_corte FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE mass_sorteos_externos.condiciones_primer_corte
    FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION mass_sorteos_externos.fijar_minimo_inicial()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER
SET search_path = pg_catalog SET row_security = off AS $func$
BEGIN
    -- preparar_intento ya bloquea la misma rifa y su versión publicada de reglas.
    INSERT INTO mass_sorteos_externos.condiciones_primer_corte
        (rifa_id, numero_intento, total_numeros, porcentaje_minimo)
    SELECT r.id, NEW.numero_intento, r.total_numeros, coalesce(r.porcentaje_minimo,80)
      FROM public.rifas AS r WHERE r.id = NEW.rifa_id
       FOR SHARE OF r;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'INTENTO_EXTERNO_RIFA_INEXISTENTE';
    END IF;
    RETURN NULL;
END
$func$;

CREATE OR REPLACE FUNCTION mass_sorteos_externos.exigir_minimo_primer_corte()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER
SET search_path = pg_catalog SET row_security = off AS $func$
DECLARE
    condiciones mass_sorteos_externos.condiciones_primer_corte%ROWTYPE;
    intento mass_sorteos_externos.intentos%ROWTYPE;
    rifa public.rifas%ROWTYPE;
BEGIN
    SELECT c.* INTO condiciones FROM mass_sorteos_externos.condiciones_primer_corte AS c
     WHERE c.rifa_id = NEW.rifa_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_SIN_MINIMO_PROGRAMADO';
    END IF;
    SELECT i.* INTO STRICT intento FROM mass_sorteos_externos.intentos AS i
     WHERE i.rifa_id = condiciones.rifa_id AND i.numero_intento = condiciones.numero_intento;

    SELECT r.* INTO STRICT rifa FROM public.rifas AS r WHERE r.id = NEW.rifa_id FOR SHARE;
    IF intento.transaccion = pg_current_xact_id()
       OR rifa.estado IS DISTINCT FROM 'congelada'
       OR clock_timestamp() < intento.cierre_ventas_en THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_ESPERA_CIERRE';
    END IF;

    IF NEW.cierre_en IS DISTINCT FROM intento.cierre_ventas_en
       OR NEW.version_reglas IS DISTINCT FROM intento.version_reglas
       OR NEW.metodo_sorteo IS DISTINCT FROM intento.metodo_sorteo
       OR NEW.cifras_sorteo IS DISTINCT FROM intento.cifras_sorteo
       OR ((rifa.fecha_sorteo + rifa.hora_sorteo) AT TIME ZONE
           coalesce(nullif(rifa.zona_horaria,''),'America/Chicago')) IS DISTINCT FROM intento.cierre_ventas_en
       OR rifa.total_numeros IS DISTINCT FROM condiciones.total_numeros
       OR coalesce(rifa.porcentaje_minimo,80) <> condiciones.porcentaje_minimo THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_CONDICIONES_DISTINTAS_DEL_INTENTO';
    END IF;

    -- El bloque 02 comprueba al confirmar la transacción que el número de
    -- boletos del padrón coincide exactamente con NEW.total_elegibles.
    IF NEW.total_elegibles > condiciones.total_numeros THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_EXCEDE_NUMEROS_PROGRAMADOS';
    END IF;
    IF NEW.total_elegibles < condiciones.minimo_boletos THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_MINIMO_NO_ALCANZADO'
            USING DETAIL = format('Boletos en el padrón: %s. Mínimo requerido: %s.',
                                  NEW.total_elegibles, condiciones.minimo_boletos);
    END IF;
    RETURN NEW;
END
$func$;

CREATE OR REPLACE TRIGGER fijar_minimo_inicial AFTER INSERT ON mass_sorteos_externos.intentos
    FOR EACH ROW WHEN (NEW.numero_intento = 1)
    EXECUTE FUNCTION mass_sorteos_externos.fijar_minimo_inicial();
CREATE OR REPLACE TRIGGER proteger_condiciones BEFORE UPDATE OR DELETE OR TRUNCATE
    ON mass_sorteos_externos.condiciones_primer_corte
    FOR EACH STATEMENT EXECUTE FUNCTION mass_sorteos_externos.proteger_padron();
CREATE OR REPLACE TRIGGER exigir_minimo_primer_corte BEFORE INSERT ON mass_sorteos_externos.cortes
    FOR EACH ROW WHEN (NEW.numero_corte = 1)
    EXECUTE FUNCTION mass_sorteos_externos.exigir_minimo_primer_corte();

REVOKE ALL ON FUNCTION mass_sorteos_externos.fijar_minimo_inicial(),
    mass_sorteos_externos.exigir_minimo_primer_corte() FROM PUBLIC, anon, authenticated, service_role;
COMMIT;

SELECT 'SORTEOS-EXTERNOS-07' AS bloque,
       t.relrowsecurity AND t.relforcerowsecurity AS condiciones_con_rls_forzada,
       (SELECT count(*) FROM pg_catalog.pg_trigger g WHERE g.tgenabled = 'O'
            AND (g.tgrelid,g.tgname) IN (
                ('mass_sorteos_externos.intentos'::regclass, 'fijar_minimo_inicial'),
                (t.oid, 'proteger_condiciones'),
                ('mass_sorteos_externos.cortes'::regclass, 'exigir_minimo_primer_corte')
            )) AS controles_activos,
       (SELECT bool_and(NOT has_schema_privilege(rol,t.relnamespace,'USAGE')
                        AND NOT has_table_privilege(rol,t.oid,'INSERT')
                        AND NOT has_function_privilege(rol,
                            'mass_sorteos_externos.exigir_minimo_primer_corte()','EXECUTE')
                        AND NOT has_function_privilege(rol,
                            'mass_sorteos_externos.fijar_minimo_inicial()','EXECUTE'))
          FROM unnest(ARRAY['anon','authenticated','service_role']) AS roles(rol)) AS acceso_directo_cerrado
  FROM pg_catalog.pg_class AS t WHERE t.oid = 'mass_sorteos_externos.condiciones_primer_corte'::regclass;
