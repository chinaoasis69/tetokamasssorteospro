-- SORTEOS-EXTERNOS-05 | Verificar el cierre en los tres caminos de venta del panel.
-- Ejecutar completo en SQL Editor. Lee la configuración y el código instalado.
-- No ejecuta funciones de negocio ni consulta filas de boletos, compras o Wallet.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;

-- pg_cron puede estar deshabilitado, tener el historial desactivado o no ser
-- visible para la sesión. En esos casos las funciones de venta sí se revisan.
DO $cron$
DECLARE
    tareas jsonb;
    registros jsonb;
    mensaje text;
BEGIN
    IF to_regclass('cron.job') IS NULL THEN
        mensaje := 'catálogo de pg_cron no disponible';
    ELSE
        SELECT coalesce(jsonb_agg(jsonb_build_object(
                   'id', j.jobid, 'programacion', j.schedule, 'activa', j.active
               ) ORDER BY j.jobid), '[]'::jsonb)
          INTO tareas FROM cron.job AS j
         WHERE j.database = current_database()
           AND j.command ~* $rx$\mcongelar_rifas_vencidas\M\s*\($rx$;
        mensaje := CASE WHEN tareas = '[]'::jsonb THEN 'sin llamada directa visible'
                        ELSE 'llamada directa visible en la configuración' END;
        IF to_regclass('cron.job_run_details') IS NOT NULL THEN
            BEGIN
                SELECT coalesce(jsonb_agg(jsonb_build_object(
                           'id', j.id, 'inicio', u.start_time, 'fin', u.end_time, 'estado', u.status
                       ) ORDER BY j.id), '[]'::jsonb)
                  INTO registros
                  FROM jsonb_to_recordset(tareas) AS j(id bigint)
                  CROSS JOIN LATERAL (
                      SELECT h.start_time, h.end_time, h.status FROM cron.job_run_details AS h
                       WHERE h.jobid = j.id ORDER BY h.runid DESC LIMIT 1
                  ) AS u;
            EXCEPTION WHEN insufficient_privilege OR undefined_table OR undefined_column THEN
                registros := NULL;
            END;
        END IF;
    END IF;
    PERFORM pg_catalog.set_config('mass_qa.cierre_05', jsonb_build_object(
        'consulta', mensaje, 'tareas', tareas, 'ultima_ejecucion_visible', registros)::text, true);
EXCEPTION WHEN insufficient_privilege OR invalid_schema_name OR undefined_table OR undefined_column THEN
    PERFORM pg_catalog.set_config('mass_qa.cierre_05',
        '{"consulta":"configuración de cron no consultable en esta sesión"}', true);
END
$cron$;

WITH entradas(orden, operacion, firma) AS (VALUES
    (1, 'apartar', 'public.apartar_boletos_seguro(uuid,text[])'),
    (2, 'comprar', 'public.comprar_con_saldo_mass_segura(uuid,text[])'),
    (3, 'pagar_apartado', 'public.pagar_reserva_con_saldo_mass_segura(uuid,text)')
), rutas AS (
    SELECT e.*, p.oid, p.prosrc FROM entradas AS e
      LEFT JOIN pg_catalog.pg_proc AS p ON p.oid = to_regprocedure(e.firma)
), llamadas AS (
    SELECT DISTINCT m.nombre[1] AS nombre
      FROM rutas AS r
      CROSS JOIN LATERAL regexp_matches(lower(r.prosrc), '\m([a-z_][a-z0-9_]*)\s*\(', 'g') AS m(nombre)
), auxiliares AS (
    SELECT p.oid, p.prosrc
      FROM pg_catalog.pg_proc AS p JOIN llamadas AS l ON l.nombre = p.proname
     WHERE p.pronamespace = 'public'::regnamespace AND p.prokind = 'f'
       AND NOT EXISTS (SELECT 1 FROM rutas AS r WHERE r.oid = p.oid)
       AND p.prosrc ~* 'fecha_sorteo|hora_sorteo|cierre_apartados|congelad|plazo|vigencia_reserva|porcentaje_minimo'
), cuerpos AS (
    -- El orden de las comprobaciones y de los bloqueos importa para un pago que
    -- cruza el cierre. Se devuelve el cuerpo legible, sin ejecutarlo.
    SELECT oid, prosrc FROM rutas WHERE oid IS NOT NULL
    UNION ALL SELECT oid, prosrc FROM auxiliares
), definiciones AS (
    SELECT oid, CASE WHEN prosrc ~* 'https?://|bearer|api[_-]?key|secret|password|vault\.|net\.http'
                THEN '[omitido: contiene una referencia de integración o credencial]'
                ELSE pg_get_functiondef(oid) END AS definicion
      FROM cuerpos
), minimo AS (
    -- Localiza el cálculo existente para decidir si se puede reutilizar al sellar
    -- el padrón externo. Las coincidencias de texto son candidatas para revisión.
    SELECT p.oid::regprocedure::text AS firma, p.prosrc
      FROM pg_catalog.pg_proc AS p
     WHERE p.pronamespace = 'public'::regnamespace AND p.prokind = 'f'
       AND p.prosrc ~* '\mporcentaje_minimo\M'
       AND p.prosrc ~* '\mvendido\M|minimo_no_alcanzado'
), evidencia_minimo AS (
    SELECT m.firma, CASE
        WHEN m.prosrc ~* 'https?://|bearer|api[_-]?key|secret|password|vault\.|net\.http'
            THEN '[omitido: integración o credencial]'
        ELSE (
            SELECT string_agg(format('%s %s', n, lineas[n]), E'\n' ORDER BY n)
              FROM (SELECT string_to_array(m.prosrc,E'\n') AS lineas) AS src
              CROSS JOIN LATERAL generate_subscripts(lineas,1) AS s(n)
             WHERE EXISTS (
                 SELECT 1 FROM unnest(lineas[greatest(1,n-3):n+3]) AS u(linea)
                  WHERE linea ~* '\mporcentaje_minimo\M|minimo_no_alcanzado|\mvendido\M'
             )
        ) END AS fragmentos
      FROM minimo AS m
)
SELECT 'SORTEOS-EXTERNOS-05' AS bloque,
       current_setting('transaction_read_only') = 'on' AS solo_lectura,
       (SELECT count(oid) FROM rutas) AS rutas_encontradas,
       current_setting('mass_qa.cierre_05')::jsonb AS tarea_de_cierre,
       (SELECT jsonb_agg(jsonb_build_object('operacion',r.operacion,'firma',r.firma,
                    'definicion',d.definicion) ORDER BY r.orden)
          FROM rutas AS r LEFT JOIN definiciones AS d USING (oid)) AS controles_de_venta,
       (SELECT coalesce(jsonb_object_agg(a.oid::regprocedure::text,d.definicion),'{}'::jsonb)
          FROM auxiliares AS a JOIN definiciones AS d USING (oid)) AS auxiliares_de_cierre,
       (SELECT coalesce(jsonb_object_agg(firma,fragmentos),'{}'::jsonb) FROM evidencia_minimo)
           AS funciones_candidatas_minimo;
COMMIT;
