-- SORTEOS-EXTERNOS-09 | Programar la edición y registrar su resultado en Ganadores.
-- Ejecutar completo. La instalación no programa rifas ni ingresa resultados.
BEGIN;

-- La cuenta y el organizador se resuelven en el servidor para todas las entradas.
CREATE OR REPLACE FUNCTION mass_sorteos_externos.exigir_acceso_ganadores(p_rifa_id uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = pg_catalog AS $$
DECLARE
    organizador uuid;
BEGIN
    IF auth.uid() IS NOT NULL THEN
        SELECT o.id INTO organizador
          FROM public.rifas r JOIN public.organizadores o ON o.id = r.organizador_id
         WHERE r.id = p_rifa_id AND o.activo IS TRUE
           AND (public.puede_gestionar_propietario_organizador_seguro(o.id) IS TRUE
                OR public.tiene_permiso_colaborador_seguro(o.id,'administrar_ganadores') IS TRUE)
           FOR SHARE OF r,o;
    END IF;
    IF organizador IS NULL THEN
        RAISE EXCEPTION 'SORTEO_EXTERNO_SIN_ACCESO' USING ERRCODE = '42501';
    END IF;
    RETURN organizador;
END;
$$;

CREATE OR REPLACE FUNCTION public.consultar_intento_sorteo_externo_seguro(p_rifa_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog SET row_security = off AS $$
DECLARE
    organizador uuid;
    respuesta jsonb;
BEGIN
    organizador := mass_sorteos_externos.exigir_acceso_ganadores(p_rifa_id);
    SELECT jsonb_build_object(
        'metodo',r.metodo_sorteo,'cifras',r.cifras_sorteo,'zona_horaria',z.zona,
        'cierre_en',coalesce(i.cierre_ventas_en,plazo.cierre),'sorteo_en',i.sorteo_en,
        'numero_intento',i.numero_intento,'referencia',i.referencia_sorteo,
        'version_reglas',coalesce(i.version_reglas,reglas.version),
        'resultado_oficial',res.resultado_oficial,'fuente',res.fuente_resultado,
        'terminacion',res.terminacion,'boleto',b.numero,
        'estado',CASE
           WHEN res.estado IS NOT NULL THEN res.estado
           WHEN lower(btrim(coalesce(r.metodo_sorteo,''))) NOT IN ('pick 3 texas','lotería nacional','loteria nacional')
               THEN 'otro_metodo'
           WHEN i.numero_intento IS NULL THEN
               CASE WHEN r.estado NOT IN ('activa','programada') OR plazo.cierre IS NULL
                            OR plazo.cierre <= clock_timestamp() OR r.estado IS NULL OR g.publicado THEN 'sin_intento'
                    WHEN (r.cifras_sorteo BETWEEN 2 AND CASE WHEN lower(btrim(r.metodo_sorteo)) = 'pick 3 texas'
                                                           THEN 3 ELSE 5 END) IS NOT TRUE THEN 'cifras_invalidas'
                    WHEN reglas.version IS NULL THEN 'falta_reglamento'
                    WHEN (public.puede_gestionar_propietario_organizador_seguro(organizador)
                          OR public.tiene_permiso_colaborador_seguro(organizador,'editar_dinamicas')) IS NOT TRUE
                        THEN 'espera_programacion'
                    ELSE 'puede_programar' END
           WHEN g.publicado THEN 'ganador_publicado'
           WHEN c.estado = 'revision' THEN 'revision'
           WHEN r.estado = 'minimo_no_alcanzado' OR c.estado = 'minimo_no_alcanzado' THEN 'minimo_no_alcanzado'
           WHEN c.estado = 'sin_boletos' THEN 'sin_boletos'
           WHEN clock_timestamp() < i.cierre_ventas_en THEN 'ventas_abiertas'
           WHEN c.estado IS DISTINCT FROM 'sellado' THEN 'espera_corte'
           WHEN r.estado IS DISTINCT FROM 'congelada' THEN 'rifa_no_disponible'
           WHEN clock_timestamp() < i.sorteo_en THEN 'espera_sorteo'
           ELSE 'puede_registrar' END)
      INTO STRICT respuesta
      FROM public.rifas r
      CROSS JOIN LATERAL (SELECT coalesce(nullif(r.zona_horaria,''),'America/Chicago') AS zona) z
      CROSS JOIN LATERAL (SELECT (r.fecha_sorteo + r.hora_sorteo) AT TIME ZONE z.zona AS cierre) plazo
      CROSS JOIN LATERAL (SELECT EXISTS(SELECT 1 FROM public.ganadores g WHERE g.rifa_id = r.id) AS publicado) g
      LEFT JOIN LATERAL (SELECT f.version FROM public.rifa_reglas_oficiales f
                         WHERE f.rifa_id = r.id AND f.estado = 'publicada' AND f.publicada_en <= clock_timestamp()
                         ORDER BY f.version DESC LIMIT 1) reglas ON true
      LEFT JOIN LATERAL (SELECT a.* FROM mass_sorteos_externos.intentos a WHERE a.rifa_id = r.id
                         ORDER BY a.numero_intento DESC LIMIT 1) i ON true
      LEFT JOIN mass_sorteos_externos.control_padron c ON c.rifa_id = r.id
      LEFT JOIN mass_sorteos_externos.resultados res ON res.rifa_id = i.rifa_id AND res.numero_intento = i.numero_intento
      LEFT JOIN mass_sorteos_externos.boletos_al_corte b ON b.rifa_id = res.rifa_id AND b.numero_corte = res.numero_corte
                                                        AND b.boleto_id = res.boleto_id
     WHERE r.id = p_rifa_id;
    RETURN respuesta;
END;
$$;

-- El primer intento fija la edición, la hora y la versión que vio el organizador.
-- El bloque 04 comprueba que la versión sea la vigente y que el cierre continúe en el futuro.
CREATE OR REPLACE FUNCTION public.programar_primer_sorteo_externo_seguro(
    p_rifa_id uuid, p_version_reglas integer, p_referencia text, p_sorteo_en timestamptz
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog SET row_security = off AS $$
DECLARE
    organizador uuid;
    referencia text := btrim(p_referencia);
    previo mass_sorteos_externos.intentos%ROWTYPE;
BEGIN
    organizador := mass_sorteos_externos.exigir_acceso_ganadores(p_rifa_id);
    IF (public.puede_gestionar_propietario_organizador_seguro(organizador)
        OR public.tiene_permiso_colaborador_seguro(organizador,'editar_dinamicas')) IS NOT TRUE THEN
        RAISE EXCEPTION 'SORTEO_EXTERNO_SIN_ACCESO' USING ERRCODE = '42501';
    END IF;
    IF referencia IS NULL OR length(referencia) NOT BETWEEN 1 AND 300
       OR p_sorteo_en IS NULL OR NOT isfinite(p_sorteo_en) OR p_version_reglas IS NULL THEN
        RAISE EXCEPTION 'SORTEO_EXTERNO_DATOS_INCOMPLETOS';
    END IF;

    -- Serializar reintentos del formulario aun cuando todavía no exista la fila.
    PERFORM pg_advisory_xact_lock(hashtextextended('sorteo-externo:' || p_rifa_id::text,0));
    SELECT a.* INTO previo FROM mass_sorteos_externos.intentos a WHERE a.rifa_id = p_rifa_id AND a.numero_intento = 1;
    IF FOUND THEN
        IF previo.sorteo_en IS DISTINCT FROM p_sorteo_en OR previo.version_reglas IS DISTINCT FROM p_version_reglas
           OR previo.referencia_sorteo IS DISTINCT FROM referencia THEN
            RAISE EXCEPTION 'SORTEO_EXTERNO_EDICION_YA_FIJADA';
        END IF;
    ELSE
        INSERT INTO mass_sorteos_externos.intentos (rifa_id,numero_intento,sorteo_en,referencia_sorteo,version_reglas)
        VALUES (p_rifa_id,1,p_sorteo_en,referencia,p_version_reglas);
    END IF;
    RETURN public.consultar_intento_sorteo_externo_seguro(p_rifa_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.registrar_resultado_sorteo_externo_seguro(
    p_rifa_id uuid, p_numero_intento integer, p_resultado_oficial text, p_fuente_resultado text
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog SET row_security = off AS $$
DECLARE
    contexto jsonb;
    numero text := btrim(p_resultado_oficial);
    fuente text := btrim(p_fuente_resultado);
BEGIN
    PERFORM mass_sorteos_externos.exigir_acceso_ganadores(p_rifa_id);
    PERFORM pg_advisory_xact_lock(hashtextextended('sorteo-externo:' || p_rifa_id::text,0));
    contexto := public.consultar_intento_sorteo_externo_seguro(p_rifa_id);
    IF p_numero_intento IS NULL OR (contexto->>'numero_intento')::integer IS DISTINCT FROM p_numero_intento
       OR contexto->>'estado' NOT IN ('puede_registrar','con_coincidencia','sin_coincidencia') THEN
        RAISE EXCEPTION 'SORTEO_EXTERNO_INTENTO_NO_DISPONIBLE';
    END IF;
    IF numero IS NULL OR numero !~ '^[0-9]+$' OR fuente IS NULL OR length(fuente) > 2048
       OR fuente !~ '^https://[^/[:space:]]+(/[^[:space:]]*)?$' THEN
        RAISE EXCEPTION 'SORTEO_EXTERNO_NUMERO_O_FUENTE_INVALIDOS';
    END IF;
    PERFORM mass_sorteos_externos.registrar_resultado(p_rifa_id,p_numero_intento,numero,fuente);
    RETURN public.consultar_intento_sorteo_externo_seguro(p_rifa_id);
END;
$$;

REVOKE ALL ON FUNCTION mass_sorteos_externos.exigir_acceso_ganadores(uuid) FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON FUNCTION public.consultar_intento_sorteo_externo_seguro(uuid),
    public.programar_primer_sorteo_externo_seguro(uuid,integer,text,timestamptz),
    public.registrar_resultado_sorteo_externo_seguro(uuid,integer,text,text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.consultar_intento_sorteo_externo_seguro(uuid),
    public.programar_primer_sorteo_externo_seguro(uuid,integer,text,timestamptz),
    public.registrar_resultado_sorteo_externo_seguro(uuid,integer,text,text) TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;

WITH entradas(f) AS (VALUES
    ('public.consultar_intento_sorteo_externo_seguro(uuid)'::regprocedure),
    ('public.programar_primer_sorteo_externo_seguro(uuid,integer,text,timestamptz)'::regprocedure),
    ('public.registrar_resultado_sorteo_externo_seguro(uuid,integer,text,text)'::regprocedure)
)
SELECT 'SORTEOS-EXTERNOS-09' AS bloque,
       count(*) FILTER (WHERE p.prosecdef AND has_function_privilege('authenticated',f,'EXECUTE')) AS entradas_autenticadas,
       bool_and(NOT has_function_privilege('anon',f,'EXECUTE')) AS acceso_anon_cerrado,
       (SELECT bool_and(NOT has_schema_privilege(rol,'mass_sorteos_externos','USAGE')
                AND NOT has_function_privilege(rol,'mass_sorteos_externos.registrar_resultado(uuid,integer,text,text)','EXECUTE'))
          FROM unnest(ARRAY['anon','authenticated','service_role']) roles(rol)) AS padron_privado
  FROM entradas JOIN pg_proc p ON p.oid = f;
