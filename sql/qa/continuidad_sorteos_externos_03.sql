-- SORTEOS-EXTERNOS-03 | Comparar un resultado externo con los boletos de su corte.
BEGIN;

-- En un corte, 7, 07 y 0007 representan el mismo número. El índice conserva
-- la grafía del boleto y exige un solo titular posible para cada coincidencia.
CREATE UNIQUE INDEX IF NOT EXISTS boletos_al_corte_numero_equivalente_uq
    ON mass_sorteos_externos.boletos_al_corte (rifa_id, numero_corte, ltrim(numero, '0'));

CREATE OR REPLACE FUNCTION mass_sorteos_externos.evaluar_resultado(
    p_rifa_id uuid,
    p_numero_corte integer,
    p_resultado_oficial text
)
RETURNS TABLE (
    terminacion text,
    estado text,
    boleto_id uuid,
    numero_boleto text,
    titular_user_id uuid,
    origen_boleto text
)
LANGUAGE plpgsql STABLE SECURITY INVOKER
SET search_path = pg_catalog
-- Si RLS impide leer el padrón, devolver un error evita una falsa ausencia de ganador.
SET row_security = off
AS $func$
DECLARE
    corte mass_sorteos_externos.cortes%ROWTYPE;
BEGIN
    SELECT c.* INTO corte FROM mass_sorteos_externos.cortes AS c
     WHERE c.rifa_id = p_rifa_id AND c.numero_corte = p_numero_corte;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_INEXISTENTE';
    END IF;
    IF corte.transaccion = pg_current_xact_id_if_assigned() THEN
        RAISE EXCEPTION 'CORTE_EXTERNO_PENDIENTE_DE_CONFIRMAR';
    END IF;

    -- El llamador aporta la secuencia de dígitos del resultado, con sus ceros.
    -- La vinculación con el sorteo oficial y la publicación corresponden a otro paso.
    IF p_resultado_oficial IS NULL OR p_resultado_oficial !~ '^[0-9]+$'
       OR length(p_resultado_oficial) < corte.cifras_sorteo
       OR (corte.metodo_sorteo = 'pick 3 texas' AND length(p_resultado_oficial) <> 3) THEN
        RAISE EXCEPTION 'RESULTADO_EXTERNO_FORMATO_INVALIDO';
    END IF;

    terminacion := right(p_resultado_oficial, corte.cifras_sorteo);
    SELECT b.boleto_id, b.numero, b.titular_user_id, b.origen_boleto
      INTO boleto_id, numero_boleto, titular_user_id, origen_boleto
      FROM mass_sorteos_externos.boletos_al_corte AS b
     WHERE b.rifa_id = p_rifa_id AND b.numero_corte = p_numero_corte
       AND ltrim(b.numero, '0') = ltrim(terminacion, '0');
    estado := CASE WHEN FOUND THEN 'con_coincidencia' ELSE 'sin_coincidencia' END;
    RETURN NEXT;
END
$func$;

REVOKE ALL ON FUNCTION mass_sorteos_externos.evaluar_resultado(uuid,integer,text)
    FROM PUBLIC, anon, authenticated, service_role;
COMMIT;

SELECT 'SORTEOS-EXTERNOS-03' AS bloque,
       proc.provolatile = 's' AND NOT proc.prosecdef AS evaluador_privado_solo_lectura,
       idx.indisvalid AND idx.indisunique AS numero_equivalente_unico,
       (SELECT bool_and(NOT has_function_privilege(rol, proc.oid, 'EXECUTE')
                        AND NOT has_schema_privilege(rol, proc.pronamespace, 'USAGE'))
          FROM unnest(ARRAY['anon','authenticated','service_role']) AS roles(rol)
       ) AS acceso_directo_cerrado
  FROM pg_catalog.pg_proc AS proc CROSS JOIN pg_catalog.pg_index AS idx
 WHERE proc.oid = 'mass_sorteos_externos.evaluar_resultado(uuid,integer,text)'::regprocedure
   AND idx.indexrelid = 'mass_sorteos_externos.boletos_al_corte_numero_equivalente_uq'::regclass;
