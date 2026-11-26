-- SORTEOS-EXTERNOS-02 | Padrón privado de números participantes al cierre.
-- Ejecutar el archivo completo. La instalación no captura boletos ni cambia rifas.
-- Los siguientes intentos pueden usar el mismo corte mientras no se admitan más ventas.
BEGIN;

CREATE SCHEMA IF NOT EXISTS mass_sorteos_externos;
REVOKE ALL ON SCHEMA mass_sorteos_externos FROM PUBLIC, anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS mass_sorteos_externos.cortes (
    rifa_id uuid NOT NULL,
    numero_corte integer NOT NULL CHECK (numero_corte > 0),
    cierre_en timestamptz NOT NULL,
    version_reglas integer NOT NULL,
    metodo_sorteo text NOT NULL,
    cifras_sorteo smallint NOT NULL,
    total_elegibles bigint NOT NULL CHECK (total_elegibles > 0),
    transaccion xid8 NOT NULL DEFAULT pg_current_xact_id(),
    PRIMARY KEY (rifa_id, numero_corte),
    UNIQUE (rifa_id, cierre_en),
    FOREIGN KEY (rifa_id, version_reglas)
        REFERENCES public.rifa_reglas_oficiales (rifa_id, version) ON DELETE RESTRICT,
    CHECK ((metodo_sorteo = 'pick 3 texas' AND cifras_sorteo BETWEEN 2 AND 3)
        OR (metodo_sorteo = 'lotería nacional' AND cifras_sorteo BETWEEN 2 AND 5))
);

CREATE TABLE IF NOT EXISTS mass_sorteos_externos.boletos_al_corte (
    rifa_id uuid NOT NULL,
    numero_corte integer NOT NULL,
    boleto_id uuid NOT NULL,
    numero text NOT NULL CHECK (numero ~ '^[0-9]+$'),
    titular_user_id uuid NOT NULL,
    origen_boleto text NOT NULL CHECK (origen_boleto IN ('regular', 'lucky_spin')),
    PRIMARY KEY (rifa_id, numero_corte, numero),
    UNIQUE (rifa_id, numero_corte, boleto_id),
    FOREIGN KEY (rifa_id, numero_corte)
        REFERENCES mass_sorteos_externos.cortes (rifa_id, numero_corte) ON DELETE RESTRICT
);

-- El padrón conserva el número tal como se emitió, incluidos los ceros iniciales.
-- boleto_id y titular_user_id son copias históricas independientes de las filas vivas.
ALTER TABLE mass_sorteos_externos.cortes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.cortes FORCE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.boletos_al_corte ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.boletos_al_corte FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE mass_sorteos_externos.cortes, mass_sorteos_externos.boletos_al_corte
    FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION mass_sorteos_externos.validar_cabecera()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $func$
DECLARE
    metodo text;
    cifras smallint;
BEGIN
    SELECT CASE lower(btrim(r.metodo_sorteo)) WHEN 'loteria nacional' THEN 'lotería nacional'
               ELSE lower(btrim(r.metodo_sorteo)) END,
           r.cifras_sorteo
      INTO metodo, cifras
      FROM public.rifas AS r
      JOIN public.rifa_reglas_oficiales AS regla
        ON regla.rifa_id = r.id AND regla.version = NEW.version_reglas
     WHERE r.id = NEW.rifa_id AND regla.estado = 'publicada'
       AND regla.publicada_en <= NEW.cierre_en
     FOR SHARE OF r, regla;

    IF NOT FOUND OR NEW.cierre_en > clock_timestamp()
       OR NEW.metodo_sorteo IS DISTINCT FROM metodo OR NEW.cifras_sorteo IS DISTINCT FROM cifras THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_CONFIGURACION_INVALIDA';
    END IF;
    NEW.transaccion := pg_current_xact_id();
    RETURN NEW;
END
$func$;

-- La cabecera y todos sus boletos entran en una sola transacción. Después de
-- confirmarla, otra venta o una repetición del proceso no puede ampliar el padrón.
CREATE OR REPLACE FUNCTION mass_sorteos_externos.validar_lote_boletos()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $func$
BEGIN
    IF EXISTS (
        SELECT 1
          FROM (SELECT DISTINCT rifa_id, numero_corte FROM lote) AS nuevos
          LEFT JOIN mass_sorteos_externos.cortes AS c USING (rifa_id, numero_corte)
         WHERE c.transaccion IS DISTINCT FROM pg_current_xact_id()
    ) THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_YA_CERRADO';
    END IF;
    -- También protege el total si el llamador adelanta las restricciones diferidas.
    IF EXISTS (
        SELECT 1 FROM (SELECT DISTINCT rifa_id, numero_corte FROM lote) AS nuevos
        JOIN mass_sorteos_externos.cortes AS c USING (rifa_id, numero_corte)
        WHERE c.total_elegibles < (SELECT count(*) FROM mass_sorteos_externos.boletos_al_corte AS b
                                   WHERE b.rifa_id = c.rifa_id AND b.numero_corte = c.numero_corte)
    ) THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_EXCEDE_TOTAL';
    END IF;
    RETURN NULL;
END
$func$;

CREATE OR REPLACE FUNCTION mass_sorteos_externos.comprobar_total()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $func$
BEGIN
    IF NEW.total_elegibles <> (SELECT count(*) FROM mass_sorteos_externos.boletos_al_corte AS b
                               WHERE b.rifa_id = NEW.rifa_id AND b.numero_corte = NEW.numero_corte) THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_PADRON_INCOMPLETO';
    END IF;
    RETURN NULL;
END
$func$;

CREATE OR REPLACE FUNCTION mass_sorteos_externos.proteger_padron()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $func$
BEGIN
    RAISE EXCEPTION 'CORTE_EXTERNO_INMUTABLE';
END
$func$;

CREATE OR REPLACE TRIGGER validar_cabecera BEFORE INSERT ON mass_sorteos_externos.cortes
    FOR EACH ROW EXECUTE FUNCTION mass_sorteos_externos.validar_cabecera();
CREATE OR REPLACE TRIGGER validar_lote AFTER INSERT ON mass_sorteos_externos.boletos_al_corte
    REFERENCING NEW TABLE AS lote
    FOR EACH STATEMENT EXECUTE FUNCTION mass_sorteos_externos.validar_lote_boletos();
DROP TRIGGER IF EXISTS comprobar_total ON mass_sorteos_externos.cortes;
CREATE CONSTRAINT TRIGGER comprobar_total AFTER INSERT ON mass_sorteos_externos.cortes
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION mass_sorteos_externos.comprobar_total();
CREATE OR REPLACE TRIGGER proteger_cortes BEFORE UPDATE OR DELETE OR TRUNCATE ON mass_sorteos_externos.cortes
    FOR EACH STATEMENT EXECUTE FUNCTION mass_sorteos_externos.proteger_padron();
CREATE OR REPLACE TRIGGER proteger_boletos BEFORE UPDATE OR DELETE OR TRUNCATE ON mass_sorteos_externos.boletos_al_corte
    FOR EACH STATEMENT EXECUTE FUNCTION mass_sorteos_externos.proteger_padron();

REVOKE ALL ON FUNCTION mass_sorteos_externos.validar_cabecera(),
    mass_sorteos_externos.validar_lote_boletos(), mass_sorteos_externos.comprobar_total(),
    mass_sorteos_externos.proteger_padron() FROM PUBLIC, anon, authenticated, service_role;
COMMIT;

-- El último SELECT identifica además qué hace el motor actual con boletos.fecha
-- y cómo vincula un ganador manual. Son definiciones, sin datos de participantes.
SELECT 'SORTEOS-EXTERNOS-02' AS bloque,
       (SELECT count(*) FROM pg_catalog.pg_class
         WHERE relnamespace = 'mass_sorteos_externos'::regnamespace
           AND relname IN ('cortes', 'boletos_al_corte') AND relrowsecurity AND relforcerowsecurity
       ) AS tablas_con_rls_forzada,
       (SELECT count(*) FROM pg_catalog.pg_trigger
         WHERE tgrelid IN ('mass_sorteos_externos.cortes'::regclass,
                           'mass_sorteos_externos.boletos_al_corte'::regclass)
           AND NOT tgisinternal AND tgenabled = 'O'
       ) AS controles_activos,
       (SELECT bool_and(NOT has_schema_privilege(rol, 'mass_sorteos_externos', 'USAGE'))
          FROM unnest(ARRAY['anon','authenticated','service_role']) AS roles(rol)
       ) AS acceso_directo_cerrado,
       pg_catalog.pg_get_functiondef('public.asegurar_fecha_boleto_vendido()'::regprocedure) AS control_fecha_boleto,
       pg_catalog.pg_get_functiondef('public.completar_trazabilidad_ganador_manual()'::regprocedure) AS control_ganador_manual;
