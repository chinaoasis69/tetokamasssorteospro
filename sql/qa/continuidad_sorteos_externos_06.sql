-- SORTEOS-EXTERNOS-06 | Plazo de apartados en Pick 3 Texas y Lotería Nacional.
-- Ejecutar el archivo completo. La firma de origen corresponde al bloque 05.
BEGIN;

DO $instalar$
DECLARE
    firma CONSTANT regprocedure := 'public.apartar_boletos_seguro_core(uuid,text[])'::regprocedure;
    origen CONSTANT text := 'c829e095fa0973f6270244d05a39135a';
    destino CONSTANT text := '29f4da6ba86deb8197628cd0df83b53a';
    huella text;
    atributos jsonb;
    atributos_instalados jsonb;
BEGIN
    SELECT md5(replace(p.prosrc, E'\r\n', E'\n')), to_jsonb(p) - 'prosrc'
      INTO STRICT huella, atributos
      FROM pg_catalog.pg_proc AS p WHERE p.oid = firma;

    IF huella = destino THEN
        RETURN;
    END IF;
    IF huella <> origen THEN
        RAISE EXCEPTION 'La función de apartados cambió desde el bloque 05. Se conserva la versión instalada.'
            USING DETAIL = format('Huella encontrada: %s.', huella);
    END IF;

    -- Definición completa obtenida del bloque 05, con los controles del bloque 06.
    -- Normalizar el texto recibido del editor antes de que PostgreSQL almacene el cuerpo.
    EXECUTE replace($ddl$CREATE OR REPLACE FUNCTION public.apartar_boletos_seguro_core(p_rifa_id uuid, p_numeros_base text[])
 RETURNS TABLE(boleto_id uuid, numero text, estado text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$

declare
    v_auth_user_id uuid;
    v_telefono text;

    v_modalidad integer;
    v_total_numeros bigint;
    v_salto bigint;
    v_ancho integer;

    v_fecha_sorteo date;
    v_hora_sorteo time without time zone;
    v_zona_horaria text;
    v_cierre_horas integer;
    v_fecha_cierre timestamptz;
    v_es_externo boolean;

    v_base_texto text;
    v_base bigint;
    v_indice integer;
    v_numero_generado text;

    v_numeros_paquete text[] :=
        array[]::text[];

    v_cantidad_esperada integer;
    v_cantidad_encontrada integer;
    v_cantidad_actualizada integer;

    v_ocupados text;

begin

    -- =================================================
    -- 1. VALIDAR SESIÓN
    -- =================================================

    v_auth_user_id := auth.uid();


    if v_auth_user_id is null then

        raise exception
            'Debes iniciar sesión para reservar boletos.'
            using errcode = '28000';

    end if;


    v_telefono :=
        public.telefono_mass_actual();


    if coalesce(trim(v_telefono), '') = '' then

        raise exception
            'No fue posible identificar tu cuenta MASS.';

    end if;


    if p_rifa_id is null then

        raise exception
            'No se recibió una dinámica válida.';

    end if;


    if coalesce(
        cardinality(p_numeros_base),
        0
    ) = 0 then

        raise exception
            'Selecciona al menos un número disponible.';

    end if;


    -- =================================================
    -- 2. CARGAR CONFIGURACIÓN DE LA RIFA
    -- =================================================

    select
        r.modalidad,
        r.total_numeros,
        r.fecha_sorteo,
        r.hora_sorteo,
        r.zona_horaria,
        r.cierre_apartados_horas_antes,
        lower(btrim(coalesce(r.metodo_sorteo, ''))) in
            ('pick 3 texas', 'lotería nacional', 'loteria nacional')

    into
        v_modalidad,
        v_total_numeros,
        v_fecha_sorteo,
        v_hora_sorteo,
        v_zona_horaria,
        v_cierre_horas,
        v_es_externo

    from public.rifas as r

    where r.id = p_rifa_id

    for share;


    if not found then

        raise exception
            'La dinámica seleccionada no existe.';

    end if;


    v_modalidad :=
        greatest(
            coalesce(v_modalidad, 1),
            1
        );


    if coalesce(v_total_numeros, 0) <= 0 then

        raise exception
            'La dinámica no tiene una cantidad de números válida.';

    end if;


    if
        v_total_numeros % v_modalidad <> 0
    then

        raise exception
            'La modalidad no coincide con la cantidad total de números.';

    end if;


    v_salto :=
        v_total_numeros /
        v_modalidad;


    v_ancho :=
        greatest(
            length(
                (v_total_numeros - 1)::text
            ),
            1
        );


    -- =================================================
    -- 3. VERIFICAR CIERRE DE APARTADOS
    -- =================================================

    if
        v_fecha_sorteo is not null
        and
        v_hora_sorteo is not null
    then

        v_fecha_cierre :=

            (
                v_fecha_sorteo +
                v_hora_sorteo
            )

            at time zone

            coalesce(
                nullif(
                    trim(v_zona_horaria),
                    ''
                ),
                'America/Chicago'
            )

            -

            make_interval(
                hours =>
                    greatest(
                        coalesce(
                            v_cierre_horas,
                            0
                        ),
                        0
                    )
            );


        if v_es_externo and pg_catalog.clock_timestamp() >= v_fecha_cierre then
            raise exception 'El periodo para apartar números ya cerró.';
        end if;

        if not v_es_externo and now() >= v_fecha_cierre then

            raise exception
                'El periodo para apartar números ya cerró. Los números disponibles solo pueden comprarse directamente.';

        end if;

    end if;


    -- =================================================
    -- 4. CONSTRUIR LOS PAQUETES POR MODALIDAD
    --
    -- Modalidad 1: base
    -- Modalidad 2: base + salto
    -- Modalidad 4: base + salto + salto...
    -- =================================================

    foreach v_base_texto
    in array p_numeros_base

    loop

        v_base_texto :=
            trim(
                coalesce(
                    v_base_texto,
                    ''
                )
            );


        if
            v_base_texto = ''
            or
            v_base_texto !~ '^[0-9]+$'
        then

            raise exception
                'Uno de los números seleccionados no es válido.';

        end if;


        v_base :=
            v_base_texto::bigint;


        if
            v_base < 0
            or
            v_base >= v_salto
        then

            raise exception
                'El número base % no pertenece al rango permitido para esta modalidad.',
                v_base_texto;

        end if;


        for v_indice
        in 0..(v_modalidad - 1)

        loop

            v_numero_generado :=

                lpad(
                    (
                        v_base +
                        (
                            v_indice *
                            v_salto
                        )
                    )::text,

                    v_ancho,

                    '0'
                );


            if
                v_numero_generado =
                any(v_numeros_paquete)
            then

                raise exception
                    'No se puede seleccionar dos veces el mismo paquete.';

            end if;


            v_numeros_paquete :=

                array_append(
                    v_numeros_paquete,
                    v_numero_generado
                );

        end loop;

    end loop;


    v_cantidad_esperada :=
        cardinality(
            v_numeros_paquete
        );


    -- =================================================
    -- 5. BLOQUEAR LOS BOLETOS
    --
    -- Si otra persona intenta apartar los mismos números,
    -- una operación esperará a que termine la otra.
    -- =================================================

    select count(*)

    into v_cantidad_encontrada

    from (

        select b.id

        from public.boletos as b

        where b.rifa_id = p_rifa_id

          and b.numero =
              any(v_numeros_paquete)

        order by b.numero

        for update

    ) as boletos_bloqueados;


    if
        v_cantidad_encontrada <>
        v_cantidad_esperada
    then

        raise exception
            'No se encontraron todos los números del paquete. Esperados: %, encontrados: %.',
            v_cantidad_esperada,
            v_cantidad_encontrada;

    end if;


    -- =================================================
    -- 6. COMPROBAR QUE TODOS SIGAN DISPONIBLES
    -- =================================================

    select
        string_agg(
            b.numero,
            ', '
            order by b.numero
        )

    into v_ocupados

    from public.boletos as b

    where b.rifa_id = p_rifa_id

      and b.numero =
          any(v_numeros_paquete)

      and lower(
            trim(
                coalesce(
                    b.estado,
                    ''
                )
            )
          ) <> 'disponible';


    if
        coalesce(
            trim(v_ocupados),
            ''
        ) <> ''
    then

        raise exception
            'Uno o más números ya no están disponibles: %.',
            v_ocupados;

    end if;


    -- =================================================
    -- 7. APARTAR TODO EL PAQUETE
    -- =================================================

    -- La espera por los bloqueos puede haber cruzado el límite de apartados.
    if v_es_externo then
        if v_fecha_cierre is null then
            raise exception 'Falta la fecha u hora oficial para apartar números.';
        end if;
        if pg_catalog.clock_timestamp() >= v_fecha_cierre then
            raise exception 'El periodo para apartar números ya cerró.';
        end if;
    end if;

    update public.boletos as b

    set
        estado = 'apartado',

        telefono =
            v_telefono,

        user_id =
            v_auth_user_id,

        fecha =
            now()

    where b.rifa_id = p_rifa_id

      and b.numero =
          any(v_numeros_paquete)

      and lower(
            trim(
                coalesce(
                    b.estado,
                    ''
                )
            )
          ) = 'disponible';


    get diagnostics
        v_cantidad_actualizada =
            row_count;

    -- Si la escritura del paquete cruzó el límite, se revierte el apartado completo.
    if v_es_externo and pg_catalog.clock_timestamp() >= v_fecha_cierre then
        raise exception 'El periodo para apartar números ya cerró.';
    end if;


    if
        v_cantidad_actualizada <>
        v_cantidad_esperada
    then

        raise exception
            'La reservación no pudo completarse. No se apartó ningún boleto.';

    end if;


    -- =================================================
    -- 8. DEVOLVER CONFIRMACIÓN
    -- =================================================

    return query

    select
        b.id as boleto_id,
        b.numero,
        b.estado

    from public.boletos as b

    where b.rifa_id = p_rifa_id

      and b.numero =
          any(v_numeros_paquete)

    order by b.numero;

end;

$function$;$ddl$, E'\r\n', E'\n');

    SELECT md5(replace(p.prosrc, E'\r\n', E'\n')), to_jsonb(p) - 'prosrc'
      INTO STRICT huella, atributos_instalados
      FROM pg_catalog.pg_proc AS p WHERE p.oid = firma;

    IF huella IS DISTINCT FROM destino THEN
        RAISE EXCEPTION 'El cuerpo instalado no coincide con el bloque 06. Se revierte el cambio.'
            USING DETAIL = format('Huella encontrada: %s.', huella);
    END IF;
    IF atributos_instalados IS DISTINCT FROM atributos THEN
        RAISE EXCEPTION 'Cambiaron los atributos de la función de apartados. Se revierte el cambio.';
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
