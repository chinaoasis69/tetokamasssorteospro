-- SORTEOS-EXTERNOS-08 | Padrón automático para intentos de Pick 3 y Lotería Nacional.
-- Ejecutar completo. El cierre general sigue congelando las rifas con su tarea habitual.
BEGIN;

-- Una fila por rifa externa que comienza a mover boletos vendidos o registra un intento.
-- La fila permite que las ventas, la inscripción y el cierre se esperen entre sí.
CREATE TABLE IF NOT EXISTS mass_sorteos_externos.control_padron (
    rifa_id uuid PRIMARY KEY REFERENCES public.rifas(id) ON DELETE CASCADE,
    cierre_en timestamptz,
    estado text NOT NULL DEFAULT 'sin_intento'
        CHECK (estado IN ('sin_intento','pendiente','sellado','minimo_no_alcanzado','sin_boletos','revision')),
    total_al_cierre bigint,
    revisar_desde timestamptz,
    incidencia text,
    CHECK ((cierre_en IS NULL) = (estado = 'sin_intento'))
);
CREATE INDEX IF NOT EXISTS control_padron_pendiente_fecha_idx
    ON mass_sorteos_externos.control_padron (cierre_en, rifa_id)
    WHERE estado IN ('pendiente','revision');

-- Si se revierte un boleto después de la hora oficial y antes de la captura,
-- guardar la titularidad anterior en la misma transacción que la reversión.
CREATE TABLE IF NOT EXISTS mass_sorteos_externos.bajas_al_cierre (
    rifa_id uuid NOT NULL REFERENCES mass_sorteos_externos.control_padron(rifa_id),
    boleto_id uuid NOT NULL,
    numero text,
    titular_user_id uuid,
    origen_boleto text,
    PRIMARY KEY (rifa_id,boleto_id)
);
ALTER TABLE mass_sorteos_externos.control_padron ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.control_padron FORCE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.bajas_al_cierre ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.bajas_al_cierre FORCE ROW LEVEL SECURITY;
REVOKE ALL ON mass_sorteos_externos.control_padron, mass_sorteos_externos.bajas_al_cierre
    FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION mass_sorteos_externos.iniciar_captura()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog SET row_security = off AS $fn$
DECLARE
    plazo timestamptz;
BEGIN
    -- Serializar la inscripción con TRUNCATE sin bloquear ventas de otras rifas.
    LOCK TABLE public.boletos IN ACCESS SHARE MODE;
    SELECT i.cierre_ventas_en INTO STRICT plazo FROM mass_sorteos_externos.intentos i
     WHERE i.rifa_id = NEW.rifa_id AND i.numero_intento = NEW.numero_intento;
    INSERT INTO mass_sorteos_externos.control_padron AS c (rifa_id,cierre_en,estado)
         VALUES (NEW.rifa_id,plazo,'pendiente')
    ON CONFLICT (rifa_id) DO UPDATE SET cierre_en = excluded.cierre_en, estado = excluded.estado
        WHERE c.estado = 'sin_intento';
    IF NOT FOUND OR plazo <= clock_timestamp() THEN
        RAISE EXCEPTION 'CAPTURA_EXTERNA_NO_PUEDE_INICIARSE';
    END IF;
    RETURN NULL;
END
$fn$;
CREATE OR REPLACE TRIGGER iniciar_captura AFTER INSERT ON mass_sorteos_externos.condiciones_primer_corte
    FOR EACH ROW EXECUTE FUNCTION mass_sorteos_externos.iniciar_captura();

CREATE OR REPLACE FUNCTION mass_sorteos_externos.proteger_titularidad_al_cierre()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog SET row_security = off AS $fn$
DECLARE
    anterior uuid;
    nueva uuid;
    rifa uuid;
    metodo text;
    control mass_sorteos_externos.control_padron%ROWTYPE;
BEGIN
    IF TG_OP <> 'INSERT' AND lower(btrim(OLD.estado)) = 'vendido' THEN anterior := OLD.rifa_id; END IF;
    IF TG_OP <> 'DELETE' AND lower(btrim(NEW.estado)) = 'vendido' THEN nueva := NEW.rifa_id; END IF;

    FOR rifa IN SELECT DISTINCT id FROM unnest(ARRAY[anterior,nueva]) AS ids(id)
                 WHERE id IS NOT NULL ORDER BY id
    LOOP
        SELECT c.* INTO control FROM mass_sorteos_externos.control_padron c WHERE c.rifa_id = rifa FOR SHARE;
        IF NOT FOUND THEN
            -- También sincroniza una primera venta que coincida con la inscripción.
            SELECT lower(btrim(r.metodo_sorteo)) INTO metodo FROM public.rifas r WHERE r.id = rifa FOR SHARE;
            IF NOT FOUND OR coalesce(metodo,'') NOT IN ('pick 3 texas','lotería nacional','loteria nacional') THEN
                CONTINUE;
            END IF;
            INSERT INTO mass_sorteos_externos.control_padron (rifa_id) VALUES (rifa)
                ON CONFLICT (rifa_id) DO NOTHING;
            SELECT c.* INTO STRICT control FROM mass_sorteos_externos.control_padron c
             WHERE c.rifa_id = rifa FOR SHARE;
        END IF;

        IF control.cierre_en IS NULL OR clock_timestamp() < control.cierre_en THEN CONTINUE; END IF;
        IF rifa = nueva THEN
            RAISE EXCEPTION 'El plazo oficial de esta rifa cerró. No se puede asignar el boleto.';
        END IF;
        IF control.estado IN ('pendiente','revision') THEN
            INSERT INTO mass_sorteos_externos.bajas_al_cierre
                (rifa_id,boleto_id,numero,titular_user_id,origen_boleto)
            VALUES (rifa,OLD.id,OLD.numero,OLD.user_id,OLD.origen_boleto)
            ON CONFLICT (rifa_id,boleto_id) DO NOTHING;
        END IF;
    END LOOP;
    RETURN NULL;
END
$fn$;

CREATE OR REPLACE TRIGGER corte_externo_alta AFTER INSERT ON public.boletos
    FOR EACH ROW WHEN (lower(btrim(NEW.estado)) = 'vendido')
    EXECUTE FUNCTION mass_sorteos_externos.proteger_titularidad_al_cierre();
CREATE OR REPLACE TRIGGER corte_externo_baja AFTER DELETE ON public.boletos
    FOR EACH ROW WHEN (lower(btrim(OLD.estado)) = 'vendido')
    EXECUTE FUNCTION mass_sorteos_externos.proteger_titularidad_al_cierre();
CREATE OR REPLACE TRIGGER corte_externo_cambio AFTER UPDATE ON public.boletos
    FOR EACH ROW WHEN (
      (lower(btrim(OLD.estado)) = 'vendido' OR lower(btrim(NEW.estado)) = 'vendido')
      AND ROW(OLD.rifa_id,OLD.id,OLD.numero,OLD.user_id,OLD.origen_boleto,lower(btrim(OLD.estado)))
          IS DISTINCT FROM ROW(NEW.rifa_id,NEW.id,NEW.numero,NEW.user_id,NEW.origen_boleto,lower(btrim(NEW.estado)))
    ) EXECUTE FUNCTION mass_sorteos_externos.proteger_titularidad_al_cierre();

CREATE OR REPLACE FUNCTION mass_sorteos_externos.proteger_truncado_en_captura()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog SET row_security = off AS $fn$
BEGIN
    IF EXISTS (SELECT 1 FROM mass_sorteos_externos.control_padron WHERE estado IN ('pendiente','revision')) THEN
        RAISE EXCEPTION 'CAPTURA_EXTERNA_PENDIENTE';
    END IF;
    RETURN NULL;
END
$fn$;
CREATE OR REPLACE TRIGGER corte_externo_truncado BEFORE TRUNCATE ON public.boletos
    FOR EACH STATEMENT EXECUTE FUNCTION mass_sorteos_externos.proteger_truncado_en_captura();

-- Los disparadores anteriores ya bloquean escrituras concurrentes de boletos
-- durante la instalación. Incluir los intentos del bloque 07 con plazo futuro.
-- Si ya venció el plazo, no se puede inferir la titularidad histórica.
INSERT INTO mass_sorteos_externos.control_padron AS c (rifa_id,cierre_en,estado)
SELECT i.rifa_id,i.cierre_ventas_en,'pendiente'
  FROM mass_sorteos_externos.intentos i
  JOIN mass_sorteos_externos.condiciones_primer_corte cfg USING (rifa_id,numero_intento)
 WHERE i.cierre_ventas_en > clock_timestamp()
ON CONFLICT (rifa_id) DO UPDATE SET cierre_en = excluded.cierre_en, estado = excluded.estado
    WHERE c.estado = 'sin_intento';

CREATE OR REPLACE FUNCTION mass_sorteos_externos.boletos_del_primer_cierre(p_rifa uuid)
RETURNS TABLE (boleto_id uuid, numero text, titular_user_id uuid, origen_boleto text)
LANGUAGE sql STABLE SET search_path = pg_catalog SET row_security = off AS $fn$
    SELECT b.id,b.numero,b.user_id,b.origen_boleto FROM public.boletos b
     WHERE b.rifa_id = p_rifa AND lower(btrim(b.estado)) = 'vendido'
       AND NOT EXISTS (SELECT 1 FROM mass_sorteos_externos.bajas_al_cierre a
                        WHERE a.rifa_id = p_rifa AND a.boleto_id = b.id)
    UNION ALL
    SELECT a.boleto_id,a.numero,a.titular_user_id,a.origen_boleto FROM mass_sorteos_externos.bajas_al_cierre a
     WHERE a.rifa_id = p_rifa;
$fn$;

-- El trabajador toma el bloqueo exclusivo después de las operaciones de boletos
-- en curso. READ COMMITTED permite ver los cambios confirmados tras esa espera.
CREATE OR REPLACE FUNCTION mass_sorteos_externos.sellar_padrones_pendientes()
RETURNS integer LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog SET row_security = off AS $fn$
DECLARE
    lote record;
    total bigint;
    numeros_distintos bigint;
    incompletos bigint;
    copiados bigint;
    decision text;
    procesados integer := 0;
BEGIN
    IF current_setting('transaction_isolation') <> 'read committed' THEN
        RAISE EXCEPTION 'CAPTURA_EXTERNA_REQUIERE_READ_COMMITTED';
    END IF;
    FOR lote IN
        SELECT c.rifa_id, c.cierre_en, cfg.total_numeros, cfg.minimo_boletos, i.version_reglas,
               i.metodo_sorteo, i.cifras_sorteo, r.total_numeros AS capacidad_actual,
               cfg.porcentaje_minimo, coalesce(r.porcentaje_minimo,80) AS minimo_actual,
               CASE lower(btrim(r.metodo_sorteo)) WHEN 'loteria nacional' THEN 'lotería nacional'
                    ELSE lower(btrim(r.metodo_sorteo)) END AS metodo_actual, r.cifras_sorteo AS cifras_actuales,
               r.fecha_sorteo, r.hora_sorteo, r.zona_horaria, r.estado AS estado_rifa
          FROM mass_sorteos_externos.control_padron c
          JOIN public.rifas r ON r.id = c.rifa_id
          JOIN mass_sorteos_externos.condiciones_primer_corte cfg ON cfg.rifa_id = c.rifa_id
          JOIN mass_sorteos_externos.intentos i ON i.rifa_id = c.rifa_id AND i.numero_intento = 1
         WHERE c.estado IN ('pendiente','revision') AND c.cierre_en <= statement_timestamp()
           AND (c.revisar_desde IS NULL OR c.revisar_desde <= statement_timestamp())
           AND r.estado IN ('congelada','minimo_no_alcanzado')
         ORDER BY c.cierre_en,c.rifa_id LIMIT 10 FOR NO KEY UPDATE OF r,c SKIP LOCKED
    LOOP
        BEGIN
            IF lote.total_numeros IS DISTINCT FROM lote.capacidad_actual
               OR lote.porcentaje_minimo IS DISTINCT FROM lote.minimo_actual
               OR lote.cifras_sorteo IS DISTINCT FROM lote.cifras_actuales
               OR lote.metodo_sorteo IS DISTINCT FROM lote.metodo_actual
               OR lote.cierre_en IS DISTINCT FROM ((lote.fecha_sorteo + lote.hora_sorteo) AT TIME ZONE
                    coalesce(nullif(lote.zona_horaria,''),'America/Chicago')) THEN
                RAISE EXCEPTION 'CORTE_EXTERNO_CONDICIONES_DISTINTAS_DEL_INTENTO';
            END IF;

            SELECT count(*),count(DISTINCT ltrim(b.numero,'0')),count(*) FILTER (
                WHERE b.titular_user_id IS NULL OR b.origen_boleto IS NULL
                   OR b.origen_boleto NOT IN ('regular','lucky_spin') OR b.numero IS NULL
                   OR b.numero !~ '^[0-9]+$' OR length(ltrim(b.numero,'0')) > lote.cifras_sorteo)
              INTO total,numeros_distintos,incompletos
              FROM mass_sorteos_externos.boletos_del_primer_cierre(lote.rifa_id) b;
            IF incompletos <> 0 OR numeros_distintos <> total OR total > lote.total_numeros THEN
                RAISE EXCEPTION 'CORTE_EXTERNO_BOLETOS_INCONSISTENTES';
            END IF;

            IF total < lote.minimo_boletos THEN
                decision := 'minimo_no_alcanzado';
            ELSIF lote.estado_rifa = 'minimo_no_alcanzado' THEN
                RAISE EXCEPTION 'CORTE_EXTERNO_MINIMO_CONTRADICTORIO';
            ELSIF total = 0 THEN
                decision := 'sin_boletos';
            ELSE
                INSERT INTO mass_sorteos_externos.cortes
                    (rifa_id,numero_corte,cierre_en,version_reglas,metodo_sorteo,cifras_sorteo,total_elegibles)
                VALUES (lote.rifa_id,1,lote.cierre_en,lote.version_reglas,lote.metodo_sorteo,lote.cifras_sorteo,total);
                INSERT INTO mass_sorteos_externos.boletos_al_corte
                    (rifa_id,numero_corte,boleto_id,numero,titular_user_id,origen_boleto)
                SELECT lote.rifa_id,1,b.* FROM mass_sorteos_externos.boletos_del_primer_cierre(lote.rifa_id) b;
                GET DIAGNOSTICS copiados = ROW_COUNT;
                IF copiados <> total THEN RAISE EXCEPTION 'CORTE_EXTERNO_PADRON_INCOMPLETO'; END IF;
                decision := 'sellado';
            END IF;

            UPDATE mass_sorteos_externos.control_padron
               SET estado = decision, total_al_cierre = total, incidencia = NULL, revisar_desde = NULL
             WHERE rifa_id = lote.rifa_id;
            procesados := procesados + 1;
        EXCEPTION WHEN OTHERS THEN
            -- Se revierte solo el corte de esta rifa. El cron volverá a intentarlo.
            UPDATE mass_sorteos_externos.control_padron SET estado = 'revision',
                incidencia = CASE WHEN SQLERRM ~ '^CORTE_EXTERNO_[A-Z_]+$' THEN SQLERRM ELSE SQLSTATE END,
                revisar_desde = clock_timestamp() + interval '5 minutes'
             WHERE rifa_id = lote.rifa_id;
        END;
    END LOOP;
    RETURN procesados;
END
$fn$;
REVOKE ALL ON FUNCTION mass_sorteos_externos.iniciar_captura(),
    mass_sorteos_externos.proteger_titularidad_al_cierre(), mass_sorteos_externos.proteger_truncado_en_captura(),
    mass_sorteos_externos.boletos_del_primer_cierre(uuid), mass_sorteos_externos.sellar_padrones_pendientes()
    FROM PUBLIC, anon, authenticated, service_role;

DO $trabajo$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_roles
                    WHERE rolname = current_user AND (rolsuper OR rolbypassrls)) THEN
        RAISE EXCEPTION 'El rol de la tarea de cierre necesita leer el padrón con RLS forzada.';
    END IF;
    PERFORM cron.schedule('mass-corte-externo-inicial','* * * * *',
        'SELECT mass_sorteos_externos.sellar_padrones_pendientes()');
END
$trabajo$;
COMMIT;

SELECT 'SORTEOS-EXTERNOS-08' AS bloque,
       (SELECT count(*) FROM pg_catalog.pg_trigger WHERE tgenabled = 'O'
           AND (tgrelid,tgname) IN (
             ('mass_sorteos_externos.condiciones_primer_corte'::regclass,'iniciar_captura'),
             ('public.boletos'::regclass,'corte_externo_alta'),('public.boletos'::regclass,'corte_externo_baja'),
             ('public.boletos'::regclass,'corte_externo_cambio'),('public.boletos'::regclass,'corte_externo_truncado')
           )) AS controles_activos,
       (SELECT count(*) = 1 FROM cron.job WHERE database = current_database() AND active
           AND jobname = 'mass-corte-externo-inicial' AND schedule = '* * * * *'
           AND command = 'SELECT mass_sorteos_externos.sellar_padrones_pendientes()') AS tarea_de_corte_activa,
       (SELECT bool_and(relrowsecurity AND relforcerowsecurity) FROM pg_catalog.pg_class
          WHERE oid IN ('mass_sorteos_externos.control_padron'::regclass,
                        'mass_sorteos_externos.bajas_al_cierre'::regclass)) AS rls_forzada,
       (SELECT bool_and(NOT has_schema_privilege(rol,'mass_sorteos_externos','USAGE')
                    AND NOT has_function_privilege(rol,'mass_sorteos_externos.sellar_padrones_pendientes()','EXECUTE')
                    AND NOT has_table_privilege(rol,tabla,'SELECT')
                    AND NOT has_table_privilege(rol,tabla,'INSERT')
                    AND NOT has_table_privilege(rol,tabla,'UPDATE')
                    AND NOT has_table_privilege(rol,tabla,'DELETE'))
          FROM unnest(ARRAY['anon','authenticated','service_role']) AS roles(rol)
         CROSS JOIN unnest(ARRAY['mass_sorteos_externos.control_padron','mass_sorteos_externos.bajas_al_cierre'])
                 AS tablas(tabla)) AS acceso_directo_cerrado;
