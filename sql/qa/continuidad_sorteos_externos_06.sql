-- SORTEOS-EXTERNOS-06 | Hora efectiva de los apartados de Pick 3 Texas y Lotería Nacional.
-- Aplica al camino de apartados ya publicado, incluso en rifas externas previas con esos métodos.
-- El plazo respeta el cierre anticipado del organizador. Ejecutar todo el archivo.
BEGIN;

DO $instalar$
DECLARE
    firma regprocedure := 'public.apartar_boletos_seguro_core(uuid,text[])'::regprocedure;
    original text;
    cuerpo text;
    definicion text;
    propietario oid;
    permisos aclitem[];
    configuracion text[];
    definidor boolean;
BEGIN
    SELECT p.prosrc, pg_catalog.pg_get_functiondef(p.oid), p.proowner, p.proacl, p.proconfig, p.prosecdef
      INTO STRICT original, definicion, propietario, permisos, configuracion, definidor
      FROM pg_catalog.pg_proc AS p WHERE p.oid = firma;
    cuerpo := replace(original, E'\r\n', E'\n');
    IF md5(cuerpo) = '29f4da6ba86deb8197628cd0df83b53a' THEN
        RETURN;
    END IF;
    IF md5(cuerpo) <> 'c829e095fa0973f6270244d05a39135a' THEN
        RAISE EXCEPTION 'La función de apartados cambió desde el bloque 05. Se conserva la versión instalada.';
    END IF;

    cuerpo := replace(cuerpo, $antes$    v_fecha_cierre timestamptz;$antes$,
        $despues$    v_fecha_cierre timestamptz;
    v_es_externo boolean;$despues$);

    cuerpo := replace(cuerpo, $antes$        r.cierre_apartados_horas_antes
$antes$,
        $despues$        r.cierre_apartados_horas_antes,
        lower(btrim(coalesce(r.metodo_sorteo, ''))) in
            ('pick 3 texas', 'lotería nacional', 'loteria nacional')
$despues$);

    cuerpo := replace(cuerpo, $antes$        v_cierre_horas

    from public.rifas$antes$,
        $despues$        v_cierre_horas,
        v_es_externo

    from public.rifas$despues$);

    cuerpo := replace(cuerpo, $antes$        if now() >= v_fecha_cierre then$antes$,
        $despues$        if v_es_externo and pg_catalog.clock_timestamp() >= v_fecha_cierre then
            raise exception 'El periodo para apartar números ya cerró.';
        end if;

        if not v_es_externo and now() >= v_fecha_cierre then$despues$);

    cuerpo := replace(cuerpo, $antes$    update public.boletos as b$antes$,
        $despues$    -- La espera por los bloqueos puede haber cruzado el límite de apartados.
    if v_es_externo then
        if v_fecha_cierre is null then
            raise exception 'Falta la fecha u hora oficial para apartar números.';
        end if;
        if pg_catalog.clock_timestamp() >= v_fecha_cierre then
            raise exception 'El periodo para apartar números ya cerró.';
        end if;
    end if;

    update public.boletos as b$despues$);

    cuerpo := replace(cuerpo, $antes$    get diagnostics
        v_cantidad_actualizada =
            row_count;$antes$,
        $despues$    get diagnostics
        v_cantidad_actualizada =
            row_count;

    -- Si la escritura del paquete cruzó el límite, se revierte el apartado completo.
    if v_es_externo and pg_catalog.clock_timestamp() >= v_fecha_cierre then
        raise exception 'El periodo para apartar números ya cerró.';
    end if;$despues$);

    IF md5(cuerpo) <> '29f4da6ba86deb8197628cd0df83b53a' OR position(original in definicion) = 0 THEN
        RAISE EXCEPTION 'No se pudo preparar la actualización exacta de apartados.';
    END IF;
    IF position(E'\r\n' in original) > 0 THEN
        cuerpo := replace(cuerpo, E'\n', E'\r\n');
    END IF;
    EXECUTE replace(definicion, original, cuerpo);

    IF NOT EXISTS (
        SELECT 1 FROM pg_catalog.pg_proc AS p
         WHERE p.oid = firma AND p.proowner = propietario AND p.prosecdef = definidor
           AND p.proacl IS NOT DISTINCT FROM permisos AND p.proconfig IS NOT DISTINCT FROM configuracion
           AND p.prosrc = cuerpo
    ) THEN
        RAISE EXCEPTION 'No se confirmó la definición o los permisos de la función de apartados.';
    END IF;
END
$instalar$;
COMMIT;

SELECT 'SORTEOS-EXTERNOS-06' AS bloque,
       md5(replace(p.prosrc, E'\r\n', E'\n')) = '29f4da6ba86deb8197628cd0df83b53a' AS control_de_plazo_instalado,
       p.prosecdef AS security_definer,
       position('public.exigir_estado_legal_participacion_seguro' in entrada.prosrc) > 0
         AND position('public.apartar_boletos_seguro_core' in entrada.prosrc) > 0 AS entrada_con_control_legal
  FROM pg_catalog.pg_proc AS p CROSS JOIN pg_catalog.pg_proc AS entrada
 WHERE p.oid = 'public.apartar_boletos_seguro_core(uuid,text[])'::regprocedure
   AND entrada.oid = 'public.apartar_boletos_seguro(uuid,text[])'::regprocedure;
