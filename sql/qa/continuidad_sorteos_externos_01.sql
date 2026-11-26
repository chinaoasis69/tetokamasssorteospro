-- Continuidad de sorteos externos · Bloque 01
-- Ejecutar como una sola consulta en el Editor SQL de Supabase.
-- Devuelve metadatos del esquema public para localizar el cierre, la evidencia
-- de titularidad de un boleto y los controles existentes de ventas y resultados.
-- No consulta filas de negocio ni invoca funciones de la aplicación.

WITH tablas_base(nombre) AS (
    VALUES ('rifas'), ('boletos'), ('ganadores'), ('premios_rifa'), ('rifa_reglas_oficiales')
),
tablas_publicas AS (
    SELECT c.oid, c.relname AS nombre
    FROM pg_catalog.pg_class AS c
    JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
),
tablas_relevantes AS (
    SELECT t.oid, t.nombre
    FROM tablas_publicas AS t
    WHERE t.nombre IN (SELECT nombre FROM tablas_base)
       OR t.nombre ~ '(boleto.*(histori|evento|asignaci|venta|derecho|procedencia)|(histori|evento|asignaci|venta|derecho|procedencia).*boleto)'
       OR t.nombre ~ '((sorteo|rifa|resultado).*(extern|intento|corte|ronda|periodo)|(extern|intento|corte|ronda|periodo).*(sorteo|rifa|resultado))'
       OR EXISTS (
           SELECT 1
           FROM pg_catalog.pg_constraint AS fk
           JOIN tablas_publicas AS destino ON destino.oid = fk.confrelid
           WHERE fk.conrelid = t.oid AND fk.contype = 'f' AND destino.nombre = 'boletos'
       )
),
columnas AS (
    SELECT t.nombre AS tabla, a.attname AS nombre,
           pg_catalog.format_type(a.atttypid, a.atttypmod) AS tipo,
           a.attnum AS posicion
    FROM tablas_relevantes AS t
    JOIN pg_catalog.pg_attribute AS a ON a.attrelid = t.oid
    WHERE a.attnum > 0 AND NOT a.attisdropped
),
controles AS (
    SELECT t.nombre AS tabla, g.tgname AS disparador,
           n.nspname || '.' || p.proname AS funcion,
           g.tgenabled AS modo
    FROM tablas_relevantes AS t
    JOIN pg_catalog.pg_trigger AS g ON g.tgrelid = t.oid
    JOIN pg_catalog.pg_proc AS p ON p.oid = g.tgfoid
    JOIN pg_catalog.pg_namespace AS n ON n.oid = p.pronamespace
    WHERE NOT g.tgisinternal
),
restricciones AS (
    SELECT t.nombre AS tabla, c.conname AS nombre,
           pg_catalog.pg_get_constraintdef(c.oid) AS definicion
    FROM tablas_relevantes AS t
    JOIN pg_catalog.pg_constraint AS c ON c.conrelid = t.oid
    WHERE t.nombre IN (SELECT nombre FROM tablas_base)
      AND c.contype IN ('c', 'u', 'p', 'f')
),
funciones AS (
    SELECT p.proname AS nombre,
           pg_catalog.pg_get_function_identity_arguments(p.oid) AS argumentos
    FROM pg_catalog.pg_proc AS p
    JOIN pg_catalog.pg_namespace AS n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prokind = 'f'
      AND (p.proname IN (
            'apartar_boletos_seguro', 'comprar_con_saldo_mass_segura',
            'pagar_reserva_con_saldo_mass_segura', 'revertir_compra_mass_segura',
            'publicar_reglas_oficiales_seguro', 'reprogramar_rifa_aleatoria'
          )
          OR p.proname ~ '((rifa|sorteo|resultado).*(extern|cierre|cerrar|finalizar)|(extern|cierre|cerrar|finalizar).*(rifa|sorteo|resultado))')
)
SELECT 'SORTEOS-EXTERNOS-01' AS bloque,
       ARRAY(SELECT b.nombre FROM tablas_base AS b
             WHERE NOT EXISTS (SELECT 1 FROM tablas_publicas AS t WHERE t.nombre = b.nombre)
             ORDER BY b.nombre) AS tablas_base_ausentes,
       COALESCE((SELECT jsonb_object_agg(grupo.tabla, grupo.campos)
                 FROM (SELECT tabla, jsonb_agg(nombre || ' ' || tipo ORDER BY posicion) AS campos
                       FROM columnas GROUP BY tabla) AS grupo), '{}'::jsonb) AS columnas_por_tabla,
       COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY c.tabla, c.disparador)
                 FROM controles AS c), '[]'::jsonb) AS controles,
       COALESCE((SELECT jsonb_agg(to_jsonb(r) ORDER BY r.tabla, r.nombre)
                 FROM restricciones AS r), '[]'::jsonb) AS restricciones,
       COALESCE((SELECT jsonb_agg(f.nombre || '(' || f.argumentos || ')' ORDER BY f.nombre, f.argumentos)
                 FROM funciones AS f), '[]'::jsonb) AS funciones;
