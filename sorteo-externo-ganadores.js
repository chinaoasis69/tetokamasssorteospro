/* Panel del resultado oficial. El padrón y los permisos se comprueban en el servidor. */
(function () {
  const textos = {
    titulo: ['Resultado oficial del sorteo', 'Official draw result'],
    referencia: ['Edición del sorteo oficial', 'Official drawing'],
    ejemplo: ['Ej. Pick 3 Texas, sorteo nocturno del 27 de noviembre', 'E.g. Texas Pick 3, November 27 night drawing'],
    cierre: ['Cierre de ventas', 'Sales close'],
    version: ['Versión de las reglas', 'Rules version'],
    fecha: ['Fecha y hora del sorteo', 'Drawing date and time'],
    misma: ['El sorteo es a la hora de cierre de ventas', 'The drawing takes place when sales close'],
    programar: ['Fijar edición del sorteo', 'Set official drawing'],
    verificar: ['Confirma que esta edición y su horario coinciden con las reglas publicadas. La edición queda fija al guardar.', 'Check that the drawing and its time match the published rules. Saving locks in this drawing.'],
    numero: ['Número oficial completo', 'Full official number'],
    fuente: ['Enlace a la fuente oficial', 'Link to the official result'],
    instruccion: ['Consulta el resultado de la edición indicada y escribe todos los dígitos, incluidos los ceros iniciales.', 'Check the result for the drawing shown and enter every digit, including leading zeros.'],
    registrar: ['Registrar resultado oficial', 'Record official result'],
    verificarResultado: ['Verifica el número y la fuente antes de guardar. El resultado queda fijo. La publicación del ganador es un paso posterior.', 'Check the number and source before saving. The result is final once saved. Publishing the winner is a separate step.'],
    terminar: ['Terminación evaluada', 'Digits compared'],
    coincidencia: ['Boleto participante', 'Eligible ticket'],
    actualizar: ['Actualizar estado', 'Refresh status'],
    cargando: ['Consultando el sorteo…', 'Checking the drawing…'],
    agenda: ['Registra la edición prevista en las reglas antes de que cierre la venta.', 'Enter the drawing specified in the rules before sales close.'],
    espera_programacion: ['Un organizador con permiso de edición puede fijar el sorteo antes del cierre.', 'An organizer with editing permission can set the drawing before sales close.'],
    sin_intento: ['Esta rifa no tiene una edición registrada antes del cierre.', 'No official drawing was registered for this raffle before sales closed.'],
    falta_reglamento: ['Publica las reglas de la rifa antes de fijar la edición.', 'Publish the raffle rules before setting the drawing.'],
    cifras_invalidas: ['La cantidad de cifras configurada es incompatible con este método de sorteo.', 'The number of ending digits is incompatible with this draw method.'],
    ventas_abiertas: ['Edición registrada. A la hora de cierre se determinarán los boletos participantes.', 'Drawing recorded. Eligible tickets will be determined when sales close.'],
    espera_corte: ['MASS está comprobando el padrón al cierre.', 'MASS is checking which tickets were eligible at closing.'],
    espera_sorteo: ['El padrón está sellado. La captura se habilita a la hora del sorteo oficial.', 'The ticket list is sealed. You can enter the result at the scheduled drawing time.'],
    revision: ['El padrón requiere revisión antes de registrar el resultado.', 'The eligible ticket list needs review before a result can be recorded.'],
    minimo_no_alcanzado: ['La rifa cerró sin alcanzar el mínimo de participación.', 'The raffle closed below the minimum participation threshold.'],
    sin_boletos: ['La rifa cerró sin boletos participantes.', 'The raffle closed with no eligible tickets.'],
    rifa_no_disponible: ['El estado actual de la rifa no permite registrar un resultado.', 'The current raffle status does not allow a result to be recorded.'],
    ganador_publicado: ['Ya existe un ganador registrado para la rifa.', 'A winner has already been recorded for this raffle.'],
    con_coincidencia: ['El resultado coincide con un boleto del padrón al cierre.', 'The result matches a ticket that was eligible at closing.'],
    sin_coincidencia: ['Ningún boleto del padrón al cierre tiene esa terminación. Las ventas siguen cerradas.', 'No ticket eligible at closing has those ending digits. Sales remain closed.'],
    verifique: ['Revisa los datos y el estado de la rifa antes de volver a guardar.', 'Check the details and the raffle status before saving again.'],
    indisponible: ['No se pudo consultar el resultado oficial.', 'The official result could not be retrieved.'],
    sinPermiso: ['Tu cuenta no tiene permiso para esta operación.', 'Your account does not have permission for this action.'],
    conflicto: ['Ya se guardaron datos distintos para esta edición. Actualiza el estado para verlos.', 'Different details have already been saved for this drawing. Refresh to view them.'],
    formato: ['Revisa el número completo y el enlace HTTPS a la fuente oficial.', 'Check the full official number and the HTTPS link to the source.'],
    caducado: ['Cambió el estado de la rifa. Actualiza el estado antes de continuar.', 'The raffle status has changed. Refresh before continuing.']
  };

  const lang = () => document.documentElement.lang.toLowerCase().startsWith('en') ? 1 : 0;
  const t = key => textos[key][lang()];
  const esExterno = method => ['pick 3 texas', 'lotería nacional', 'loteria nacional'].includes(method);
  let sesion;

  function vigente(s) {
    return sesion === s && s.panel.isConnected && document.getElementById('ganadorRifa')?.value === s.rifa;
  }

  function elemento(padre, tipo, texto) {
    const el = document.createElement(tipo);
    if (texto != null) el.textContent = texto;
    padre.appendChild(el);
    return el;
  }

  function campo(form, tipo, clave) {
    const label = elemento(form, 'label', t(clave));
    const input = elemento(label, 'input');
    input.type = tipo;
    input.required = true;
    return input;
  }

  function errorLegible(error, defecto) {
    if (error?.code === '42501') return t('sinPermiso');
    const codigo = error?.message || '';
    if (/YA_REGISTRADO|YA_FIJADA/.test(codigo)) return t('conflicto');
    if (/FORMATO_INVALIDO|FUENTE_INVALIDOS/.test(codigo)) return t('formato');
    if (/NO_DISPONIBLE|FECHA_VENCIDA|CONFIGURACION_INVALIDA|NO_PUEDE_INICIARSE/.test(codigo)) return t('caducado');
    return t(defecto);
  }

  function fecha(iso, zona) {
    return new Intl.DateTimeFormat(lang() ? 'en-US' : 'es-MX', {
      timeZone: zona, dateStyle: 'medium', timeStyle: 'short'
    }).format(new Date(iso)) + ' (' + zona + ')';
  }

  function dato(padre, clave, valor) {
    const p = elemento(padre, 'p');
    elemento(p, 'strong', t(clave) + ' ');
    p.appendChild(document.createTextNode(String(valor)));
  }

  function refrescar(s) {
    const btn = elemento(s.panel, 'button', t('actualizar'));
    btn.type = 'button';
    btn.addEventListener('click', () => cargar(s));
  }

  function formulario(s, boton, rpc, parametros) {
    const form = elemento(s.panel, 'form');
    const fin = () => {
      const guardar = elemento(form, 'button', t(boton));
      guardar.type = 'submit';
      const aviso = elemento(form, 'p');
      aviso.setAttribute('role','status');
      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!vigente(s) || s.ocupada || !form.reportValidity()) return;
        const args = parametros();
        if (!args) return;
        s.ocupada = true;
        guardar.disabled = true;
        try {
          const {data, error} = await supabaseClient.rpc(rpc, {p_rifa_id:s.rifa, ...args});
          if (error || !data) throw error;
          if (vigente(s)) dibujar(s, data);
        } catch (err) {
          if (vigente(s)) {
            aviso.textContent = errorLegible(err,'verifique');
            if (!s.panel.querySelector('[data-reintentar]')) {
              refrescar(s);
              s.panel.lastElementChild.dataset.reintentar = '1';
            }
          }
        } finally {
          s.ocupada = false;
          guardar.disabled = false;
        }
      });
    };
    return { form, fin };
  }

  function programacion(s, d) {
    elemento(s.panel, 'p', t('agenda'));
    let ref, misma, fechaLocal;
    const {form, fin} = formulario(s,'programar','programar_primer_sorteo_externo_seguro', () => {
      const elegida = new Date(fechaLocal.value);
      if (!misma.checked && (!Number.isFinite(elegida.getTime()) || elegida < new Date(d.cierre_en))) {
        fechaLocal.setCustomValidity(lang() ? 'Choose a time at or after sales close.' : 'Elige una hora igual o posterior al cierre de ventas.');
        fechaLocal.reportValidity();
        return null;
      }
      const cuando = misma.checked ? d.cierre_en : elegida.toISOString();
      return {p_version_reglas:d.version_reglas, p_referencia:ref.value.trim(), p_sorteo_en:cuando};
    });
    ref = campo(form,'text','referencia');
    ref.placeholder = t('ejemplo');
    ref.maxLength = 300;
    misma = campo(form,'checkbox','misma');
    misma.required = false;
    misma.checked = true;
    fechaLocal = campo(form,'datetime-local','fecha');
    const fechaLabel = fechaLocal.parentElement;
    fechaLabel.insertBefore(document.createTextNode(' (' + Intl.DateTimeFormat().resolvedOptions().timeZone + ')'),fechaLocal);
    fechaLabel.hidden = true;
    fechaLocal.disabled = true;
    fechaLocal.addEventListener('input', () => fechaLocal.setCustomValidity(''));
    misma.addEventListener('change', () => {
      fechaLabel.hidden = misma.checked;
      fechaLocal.disabled = misma.checked;
      fechaLocal.setCustomValidity('');
    });
    elemento(form,'p',t('verificar'));
    fin();
  }

  function registro(s, d) {
    elemento(s.panel,'p',t('instruccion'));
    let num, fuente;
    const {form, fin} = formulario(s,'registrar','registrar_resultado_sorteo_externo_seguro', () => ({
      p_numero_intento:d.numero_intento, p_resultado_oficial:num.value.trim(), p_fuente_resultado:fuente.value.trim()
    }));
    num = campo(form,'text','numero');
    num.inputMode = 'numeric';
    num.pattern = d.metodo.trim().toLowerCase() === 'pick 3 texas' ? '[0-9]{3}' : '[0-9]{' + d.cifras + ',}';
    fuente = campo(form,'url','fuente');
    fuente.placeholder = 'https://…';
    fuente.pattern = 'https://.+';
    fuente.maxLength = 2048;
    elemento(form,'p',t('verificarResultado'));
    fin();
  }

  function dibujar(s, d) {
    s.datos = d;
    s.panel.replaceChildren();
    s.panel.hidden = d.estado === 'otro_metodo';
    if (s.panel.hidden) return;
    elemento(s.panel,'h3',t('titulo'));
    if (d.referencia) dato(s.panel,'referencia',d.referencia);
    if (d.version_reglas != null) dato(s.panel,'version',d.version_reglas);
    if (d.cierre_en) dato(s.panel,'cierre',fecha(d.cierre_en,d.zona_horaria));
    if (d.sorteo_en) dato(s.panel,'fecha',fecha(d.sorteo_en,d.zona_horaria));
    if (d.estado === 'puede_programar') return programacion(s,d);
    if (d.estado === 'puede_registrar') return registro(s,d);
    elemento(s.panel,'p',t(textos[d.estado] ? d.estado : 'indisponible'));
    if (d.resultado_oficial != null) {
      dato(s.panel,'numero',d.resultado_oficial);
      dato(s.panel,'terminar',d.terminacion);
      if (d.boleto != null) dato(s.panel,'coincidencia',d.boleto);
      dato(s.panel,'fuente',d.fuente);
    } else refrescar(s);
  }

  async function cargar(s) {
    if (!vigente(s) || s.ocupada) return;
    s.datos = null;
    s.panel.replaceChildren();
    elemento(s.panel,'p',t('cargando'));
    s.ocupada = true;
    try {
      const {data,error} = await supabaseClient.rpc('consultar_intento_sorteo_externo_seguro',{p_rifa_id:s.rifa});
      if (error || !data) throw error;
      if (vigente(s)) dibujar(s,data);
    } catch (err) {
      if (vigente(s)) {
        s.panel.replaceChildren();
        elemento(s.panel,'p',errorLegible(err,'indisponible'));
        refrescar(s);
      }
    } finally { s.ocupada = false; }
  }

  window.mostrarResultadoExternoGanadores = function (select) {
    const panel = document.getElementById('panelResultadoExterno');
    if (!panel) return;
    sesion = null;
    panel.replaceChildren();
    const metodo = select.options[select.selectedIndex]?.dataset.metodo || '';
    panel.hidden = !select.value || !esExterno(metodo.trim().toLowerCase());
    if (panel.hidden) return;
    sesion = {panel,rifa:select.value,ocupada:false};
    cargar(sesion);
  };
  document.addEventListener('mass:idioma', () => {
    if (sesion && vigente(sesion) && sesion.datos && !sesion.ocupada) {
      const valores = [...sesion.panel.querySelectorAll('input')].map(i => [i.value,i.checked]);
      dibujar(sesion,sesion.datos);
      sesion.panel.querySelectorAll('input').forEach((i,n) => {
        if (!valores[n]) return;
        i.value = valores[n][0];
        if (i.type === 'checkbox') {
          i.checked = valores[n][1];
          i.dispatchEvent(new Event('change'));
        }
      });
    }
  });
})();
