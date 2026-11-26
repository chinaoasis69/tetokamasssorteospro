-- SORTEOS-EXTERNOS-04 | Calendario y resultados privados de los intentos externos.
-- La instalación no registra intentos. El flujo de cierre deberá validar el mínimo
-- y capturar el padrón antes de habilitar el acceso del organizador.
BEGIN;

CREATE TABLE IF NOT EXISTS mass_sorteos_externos.intentos (
    rifa_id uuid NOT NULL,
    numero_intento integer NOT NULL CHECK (numero_intento > 0),
    numero_corte integer NOT NULL CHECK (numero_corte > 0),
    cierre_ventas_en timestamptz NOT NULL CHECK (isfinite(cierre_ventas_en)),
    sorteo_en timestamptz NOT NULL CHECK (isfinite(sorteo_en) AND sorteo_en >= cierre_ventas_en),
    referencia_sorteo text NOT NULL CHECK (btrim(referencia_sorteo) <> ''),
    version_reglas integer NOT NULL,
    metodo_sorteo text NOT NULL,
    cifras_sorteo smallint NOT NULL,
    programado_por uuid NOT NULL,
    programado_en timestamptz NOT NULL CHECK (programado_en < sorteo_en),
    transaccion xid8 NOT NULL,
    PRIMARY KEY (rifa_id, numero_intento),
    UNIQUE (rifa_id, sorteo_en),
    FOREIGN KEY (rifa_id, version_reglas) REFERENCES public.rifa_reglas_oficiales (rifa_id, version)
);

CREATE TABLE IF NOT EXISTS mass_sorteos_externos.resultados (
    rifa_id uuid NOT NULL,
    numero_intento integer NOT NULL,
    numero_corte integer NOT NULL,
    resultado_oficial text NOT NULL,
    fuente_resultado text NOT NULL CHECK (fuente_resultado ~ '^https://[^/[:space:]]+(/[^[:space:]]*)?$'),
    terminacion text NOT NULL,
    estado text NOT NULL CHECK (estado IN ('con_coincidencia', 'sin_coincidencia')),
    boleto_id uuid,
    registrado_por uuid NOT NULL,
    registrado_en timestamptz NOT NULL,
    PRIMARY KEY (rifa_id, numero_intento),
    FOREIGN KEY (rifa_id, numero_intento) REFERENCES mass_sorteos_externos.intentos,
    FOREIGN KEY (rifa_id, numero_corte) REFERENCES mass_sorteos_externos.cortes,
    FOREIGN KEY (rifa_id, numero_corte, boleto_id)
        REFERENCES mass_sorteos_externos.boletos_al_corte (rifa_id, numero_corte, boleto_id),
    CHECK ((estado = 'con_coincidencia') = (boleto_id IS NOT NULL))
);

ALTER TABLE mass_sorteos_externos.intentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.intentos FORCE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE mass_sorteos_externos.resultados FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE mass_sorteos_externos.intentos, mass_sorteos_externos.resultados
    FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION mass_sorteos_externos.preparar_intento()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog SET row_security = off AS $func$
DECLARE
    anterior mass_sorteos_externos.intentos%ROWTYPE;
BEGIN
    NEW.programado_por := auth.uid();
    NEW.transaccion := pg_current_xact_id();
    IF NEW.numero_intento = 1 THEN
        -- El primer intento usa el cierre configurado de la rifa, con su zona horaria.
        SELECT (r.fecha_sorteo + r.hora_sorteo) AT TIME ZONE coalesce(nullif(r.zona_horaria,''),'America/Chicago'),
               CASE lower(btrim(r.metodo_sorteo)) WHEN 'loteria nacional' THEN 'lotería nacional'
                    ELSE lower(btrim(r.metodo_sorteo)) END, r.cifras_sorteo
          INTO NEW.cierre_ventas_en, NEW.metodo_sorteo, NEW.cifras_sorteo
          FROM public.rifas AS r
          JOIN public.rifa_reglas_oficiales AS regla ON regla.rifa_id = r.id
         WHERE r.id = NEW.rifa_id AND regla.version = NEW.version_reglas
           AND regla.estado = 'publicada' AND regla.publicada_en <= clock_timestamp()
           AND NOT EXISTS (SELECT 1 FROM public.rifa_reglas_oficiales AS posterior
                            WHERE posterior.rifa_id = regla.rifa_id AND posterior.estado = 'publicada'
                              AND posterior.version > regla.version AND posterior.publicada_en <= clock_timestamp())
           AND r.estado IN ('programada','activa')
         FOR SHARE OF r, regla;
        IF NOT FOUND OR NEW.cierre_ventas_en IS NULL OR NEW.cifras_sorteo IS NULL
           OR NOT coalesce((NEW.metodo_sorteo = 'pick 3 texas' AND NEW.cifras_sorteo BETWEEN 2 AND 3)
                        OR (NEW.metodo_sorteo = 'lotería nacional' AND NEW.cifras_sorteo BETWEEN 2 AND 5), false) THEN
            RAISE EXCEPTION 'INTENTO_EXTERNO_CONFIGURACION_INVALIDA';
        END IF;
        NEW.numero_corte := 1;
    ELSE
        SELECT i.* INTO anterior
          FROM mass_sorteos_externos.intentos AS i
          JOIN mass_sorteos_externos.resultados AS r USING (rifa_id, numero_intento)
         WHERE i.rifa_id = NEW.rifa_id AND i.numero_intento = NEW.numero_intento - 1
           AND r.estado = 'sin_coincidencia';
        IF NOT FOUND THEN
            RAISE EXCEPTION 'INTENTO_EXTERNO_REQUIERE_ANTERIOR_SIN_COINCIDENCIA';
        END IF;
        -- La continuación con ventas cerradas hereda íntegro el padrón anterior.
        NEW.numero_corte := anterior.numero_corte;
        NEW.cierre_ventas_en := anterior.cierre_ventas_en;
        NEW.version_reglas := anterior.version_reglas;
        NEW.metodo_sorteo := anterior.metodo_sorteo;
        NEW.cifras_sorteo := anterior.cifras_sorteo;
    END IF;

    IF EXISTS (SELECT 1 FROM public.ganadores AS g WHERE g.rifa_id = NEW.rifa_id) OR EXISTS (
        SELECT 1 FROM public.rifas AS r WHERE r.id = NEW.rifa_id AND r.estado = 'minimo_no_alcanzado'
    ) THEN
        RAISE EXCEPTION 'INTENTO_EXTERNO_RIFA_NO_ADMITE_CONTINUACION';
    END IF;
    NEW.programado_en := clock_timestamp();
    IF NEW.sorteo_en <= NEW.programado_en OR
       (NEW.numero_intento = 1 AND NEW.cierre_ventas_en <= NEW.programado_en) THEN
        RAISE EXCEPTION 'INTENTO_EXTERNO_FECHA_VENCIDA';
    END IF;
    RETURN NEW;
END
$func$;

CREATE OR REPLACE FUNCTION mass_sorteos_externos.preparar_resultado()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog SET row_security = off AS $func$
DECLARE
    intento mass_sorteos_externos.intentos%ROWTYPE;
BEGIN
    SELECT i.* INTO intento FROM mass_sorteos_externos.intentos AS i
     WHERE i.rifa_id = NEW.rifa_id AND i.numero_intento = NEW.numero_intento;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'RESULTADO_EXTERNO_SIN_INTENTO';
    END IF;
    NEW.registrado_en := clock_timestamp();
    NEW.registrado_por := auth.uid();
    IF intento.sorteo_en > NEW.registrado_en OR intento.transaccion = pg_current_xact_id() THEN
        RAISE EXCEPTION 'RESULTADO_EXTERNO_INTENTO_NO_DISPONIBLE';
    END IF;
    IF EXISTS (SELECT 1 FROM public.ganadores AS g WHERE g.rifa_id = NEW.rifa_id) OR EXISTS (
        SELECT 1 FROM public.rifas AS r WHERE r.id = NEW.rifa_id AND r.estado = 'minimo_no_alcanzado'
    ) THEN
        RAISE EXCEPTION 'INTENTO_EXTERNO_RIFA_NO_ADMITE_CONTINUACION';
    END IF;
    NEW.numero_corte := intento.numero_corte;
    IF NOT EXISTS (
        SELECT 1 FROM mass_sorteos_externos.cortes AS c
         WHERE c.rifa_id = intento.rifa_id AND c.numero_corte = intento.numero_corte
           AND c.cierre_en = intento.cierre_ventas_en AND c.version_reglas = intento.version_reglas
           AND c.metodo_sorteo = intento.metodo_sorteo AND c.cifras_sorteo = intento.cifras_sorteo
    ) THEN
        RAISE EXCEPTION 'RESULTADO_EXTERNO_CORTE_NO_CORRESPONDE';
    END IF;
    SELECT e.terminacion, e.estado, e.boleto_id INTO STRICT NEW.terminacion, NEW.estado, NEW.boleto_id
      FROM mass_sorteos_externos.evaluar_resultado(NEW.rifa_id, NEW.numero_corte, NEW.resultado_oficial) AS e;
    RETURN NEW;
END
$func$;

CREATE OR REPLACE TRIGGER preparar_intento BEFORE INSERT ON mass_sorteos_externos.intentos
    FOR EACH ROW EXECUTE FUNCTION mass_sorteos_externos.preparar_intento();
CREATE OR REPLACE TRIGGER preparar_resultado BEFORE INSERT ON mass_sorteos_externos.resultados
    FOR EACH ROW EXECUTE FUNCTION mass_sorteos_externos.preparar_resultado();
CREATE OR REPLACE TRIGGER proteger_intentos BEFORE UPDATE OR DELETE OR TRUNCATE ON mass_sorteos_externos.intentos
    FOR EACH STATEMENT EXECUTE FUNCTION mass_sorteos_externos.proteger_padron();
CREATE OR REPLACE TRIGGER proteger_resultados BEFORE UPDATE OR DELETE OR TRUNCATE ON mass_sorteos_externos.resultados
    FOR EACH STATEMENT EXECUTE FUNCTION mass_sorteos_externos.proteger_padron();

-- Una repetición con los mismos datos devuelve el asiento original, también
-- cuando dos sesiones lo registran a la vez. Una discrepancia requiere revisión.
CREATE OR REPLACE FUNCTION mass_sorteos_externos.registrar_resultado(
    p_rifa_id uuid, p_numero_intento integer, p_resultado_oficial text, p_fuente_resultado text
)
RETURNS mass_sorteos_externos.resultados
LANGUAGE plpgsql VOLATILE SECURITY INVOKER SET search_path = pg_catalog SET row_security = off AS $func$
DECLARE
    asiento mass_sorteos_externos.resultados%ROWTYPE;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'RESULTADO_EXTERNO_REQUIERE_SESION';
    END IF;
    INSERT INTO mass_sorteos_externos.resultados (rifa_id, numero_intento, resultado_oficial, fuente_resultado)
    SELECT p_rifa_id, p_numero_intento, p_resultado_oficial, p_fuente_resultado
     WHERE NOT EXISTS (SELECT 1 FROM mass_sorteos_externos.resultados AS r
                        WHERE r.rifa_id = p_rifa_id AND r.numero_intento = p_numero_intento)
    ON CONFLICT (rifa_id, numero_intento) DO NOTHING RETURNING * INTO asiento;
    IF NOT FOUND THEN
        SELECT r.* INTO STRICT asiento FROM mass_sorteos_externos.resultados AS r
         WHERE r.rifa_id = p_rifa_id AND r.numero_intento = p_numero_intento;
        IF asiento.resultado_oficial IS DISTINCT FROM p_resultado_oficial
           OR asiento.fuente_resultado IS DISTINCT FROM p_fuente_resultado THEN
            RAISE EXCEPTION 'RESULTADO_EXTERNO_YA_REGISTRADO_CON_OTROS_DATOS';
        END IF;
    END IF;
    RETURN asiento;
END
$func$;

REVOKE ALL ON FUNCTION mass_sorteos_externos.preparar_intento(),
    mass_sorteos_externos.preparar_resultado(), mass_sorteos_externos.registrar_resultado(uuid,integer,text,text)
    FROM PUBLIC, anon, authenticated, service_role;
COMMIT;

SELECT 'SORTEOS-EXTERNOS-04' AS bloque,
       (SELECT count(*) FROM pg_catalog.pg_class WHERE oid IN
           ('mass_sorteos_externos.intentos'::regclass,'mass_sorteos_externos.resultados'::regclass)
           AND relrowsecurity AND relforcerowsecurity) AS tablas_con_rls_forzada,
       (SELECT count(*) FROM pg_catalog.pg_trigger WHERE tgrelid IN
           ('mass_sorteos_externos.intentos'::regclass,'mass_sorteos_externos.resultados'::regclass)
           AND NOT tgisinternal AND tgenabled = 'O') AS controles_activos,
       (SELECT bool_and(NOT has_schema_privilege(rol,'mass_sorteos_externos','USAGE')
                    AND NOT has_function_privilege(rol,
                        'mass_sorteos_externos.registrar_resultado(uuid,integer,text,text)','EXECUTE'))
          FROM unnest(ARRAY['anon','authenticated','service_role']) AS roles(rol)) AS acceso_directo_cerrado,
       -- Identifica el punto donde integrar el padrón con el cierre programado y
       -- el mínimo existente. Omite cuerpos que incluyan integraciones externas.
       (SELECT CASE WHEN p.prosrc ~* 'https?://|bearer|api[_-]?key|secret|vault\.|net\.http'
                    THEN 'Contiene una integración externa. Definición omitida.'
                    ELSE pg_catalog.pg_get_functiondef(p.oid) END
          FROM pg_catalog.pg_proc AS p
         WHERE p.oid = to_regprocedure('public.congelar_rifas_vencidas()')) AS control_cierre_vigente;
