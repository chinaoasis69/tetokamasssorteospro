async function cargarModuloMassId() {
  try {
    const respuesta = await fetch("mass-id-panel.html");

    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar MASS ID: ${respuesta.status}`);
    }

    const html = await respuesta.text();

    const contenedor = document.createElement("div");
    contenedor.id = "massIdModuleContainer";
    contenedor.innerHTML = html;

    document.body.appendChild(contenedor);

    console.log("✅ Módulo MASS ID cargado correctamente.");
  } catch (error) {
    console.error("ERROR CARGANDO MÓDULO MASS ID:", error);
  }
}

async function abrirMiMassId() {
  let panel = document.getElementById("miMassIdPanel");

  if (!panel) {
    await cargarModuloMassId();
    panel = document.getElementById("miMassIdPanel");
  }

  if (!panel) {
    alert("❌ No fue posible abrir Mi MASS ID.");
    return;
  }

  const {
  data: { user },
  error: userError
} = await supabaseClient.auth.getUser();

if (userError || !user) {
  console.error("ERROR OBTENIENDO USUARIO AUTH:", userError);
  alert("❌ No se pudo identificar tu cuenta MASS.");
  return;
}

const { data: perfil, error: perfilError } = await supabaseClient
  .from("usuarios_mass")
  .select("nombre, telefono, email, mass_id, estado, foto_perfil_url")
  .eq("auth_user_id", user.id)
  .single();

if (perfilError || !perfil) {
  console.error("ERROR CARGANDO PERFIL MASS ID:", perfilError);
  alert("❌ No se pudo cargar tu perfil MASS ID.");
  return;
}

/*
  Sincronizar el correo oficial de Supabase Auth
  con el perfil privado de usuarios_mass.
*/
const correoOficialAuth = (
  user.email || ""
)
  .trim()
  .toLowerCase();

const correoGuardadoPerfil = (
  perfil.email || ""
)
  .trim()
  .toLowerCase();

if (
  correoOficialAuth &&
  correoOficialAuth !== correoGuardadoPerfil
) {
  const {
    error: errorSincronizarCorreo
  } =
    await supabaseClient
      .from("usuarios_mass")
      .update({
        email: correoOficialAuth
      })
      .eq("auth_user_id", user.id);

  if (errorSincronizarCorreo) {
    console.error(
      "ERROR SINCRONIZANDO CORREO MASS ID:",
      errorSincronizarCorreo
    );
  } else {
    perfil.email = correoOficialAuth;
    localStorage.setItem(
      "mass_email",
      correoOficialAuth
    );
  }
}  

const nombrePerfil = document.getElementById("massIdNombre");
const numeroPerfil = document.getElementById("massIdNumero");

if (nombrePerfil) {
  nombrePerfil.textContent = perfil.nombre || "Usuario MASS";
}

if (numeroPerfil) {
  numeroPerfil.innerHTML = `
    <div style="
      color:#39ff14;
      font-size:22px;
      font-weight:bold;
      margin-bottom:12px;
    ">
      🆔 ${perfil.mass_id || "MASS ID pendiente"}
    </div>

    <div style="
      color:#39ff14;
      font-size:18px;
      font-weight:bold;
      margin-bottom:6px;
    ">
      📱 ${perfil.telefono || "Teléfono no disponible"}
    </div>

    <div style="
      color:#bbb;
      font-size:15px;
      overflow-wrap:anywhere;
    ">
      📧 ${perfil.email || user.email || "Correo no disponible"}
    </div>
  `;
}

  const menuPrincipal = document.getElementById("massIdMenuPrincipal");
const seccionInformacion = document.getElementById(
  "massIdInformacionPersonal"
);

const btnInformacionPersonal = document.getElementById(
  "btnMassIdInformacionPersonal"
);

const btnVolverMenuMassId = document.getElementById(
  "btnVolverMenuMassId"
);

const infoNombre = document.getElementById("massIdInfoNombre");
const infoNumero = document.getElementById("massIdInfoNumero");
const infoTelefono = document.getElementById("massIdInfoTelefono");
const infoCorreo = document.getElementById("massIdInfoCorreo");

const seccionCambiarCorreo =
  document.getElementById(
    "massIdCambiarCorreo"
  );

const btnCambiarCorreo =
  document.getElementById(
    "btnMassIdCambiarCorreo"
  );

const btnVolverCambiarCorreo =
  document.getElementById(
    "btnVolverCambiarCorreoMassId"
  );

const btnCancelarCambioCorreo =
  document.getElementById(
    "btnCancelarCambioCorreoMassId"
  );

const btnContinuarCambioCorreo =
  document.getElementById(
    "btnContinuarCambioCorreoMassId"
  );

const correoActualCambio =
  document.getElementById(
    "massIdCambiarCorreoActual"
  );

const inputNuevoCorreo =
  document.getElementById(
    "massIdNuevoCorreo"
  );

const inputConfirmarNuevoCorreo =
  document.getElementById(
    "massIdConfirmarNuevoCorreo"
  );

const inputPasswordActualCambioCorreo =
  document.getElementById(
    "massIdPasswordActualCambioCorreo"
  );  

const mensajeCambioCorreo =
  document.getElementById(
    "massIdCambiarCorreoMensaje"
  ); 

const panelMfaCambioCorreo =
  document.getElementById(
    "massIdCambioCorreoMfa"
  );

const inputCodigoMfaCambioCorreo =
  document.getElementById(
    "massIdCodigoMfaCambioCorreo"
  );

const mensajeMfaCambioCorreo =
  document.getElementById(
    "massIdCambioCorreoMfaMensaje"
  );

const btnConfirmarMfaCambioCorreo =
  document.getElementById(
    "btnConfirmarMfaCambioCorreoMassId"
  );

let factorMfaCambioCorreoId = null;
let nuevoCorreoPendienteCambio = "";
let mfaCambioCorreoAprobado = false;

const seccionCambiarTelefono =
  document.getElementById(
    "massIdCambiarTelefono"
  );

const btnCambiarTelefono =
  document.getElementById(
    "btnMassIdCambiarTelefono"
  );

const btnVolverCambiarTelefono =
  document.getElementById(
    "btnVolverCambiarTelefonoMassId"
  );

const telefonoActualCambio =
  document.getElementById(
    "massIdCambiarTelefonoActual"
  ); 

const inputNuevoTelefono =
  document.getElementById(
    "massIdNuevoTelefono"
  );

const inputConfirmarNuevoTelefono =
  document.getElementById(
    "massIdConfirmarNuevoTelefono"
  );

const inputPasswordActualCambioTelefono =
  document.getElementById(
    "massIdPasswordActualCambioTelefono"
  );

const mensajeCambioTelefono =
  document.getElementById(
    "massIdCambiarTelefonoMensaje"
  );

const btnContinuarCambioTelefono =
  document.getElementById(
    "btnContinuarCambioTelefonoMassId"
  );

const btnCancelarCambioTelefono =
  document.getElementById(
    "btnCancelarCambioTelefonoMassId"
  );  

const direccionInvitacion =
  document.getElementById(
    "massIdDireccionInvitacion"
  );

const direccionFormulario =
  document.getElementById(
    "massIdDireccionFormulario"
  );

const btnAgregarDireccion =
  document.getElementById(
    "btnAgregarDireccionMassId"
  );

const btnCancelarDireccion =
  document.getElementById(
    "btnCancelarDireccionMassId"
  );

const mensajeDireccionFormulario =
  document.getElementById(
    "massIdDireccionMensajeFormulario"
  );

const direccionEstado =
  document.getElementById(
    "massIdDireccionEstado"
  );

const panelDireccionesGuardadas =
  document.getElementById(
    "massIdDireccionesGuardadas"
  );

const contadorDirecciones =
  document.getElementById(
    "massIdDireccionesCantidad"
  );

const mensajeDirecciones =
  document.getElementById(
    "massIdDireccionesMensaje"
  );

const listaDirecciones =
  document.getElementById(
    "massIdDireccionesLista"
  );  

const btnGuardarDireccion =
  document.getElementById(
    "btnGuardarDireccionMassId"
  );

const inputDireccionNombre =
  document.getElementById(
    "massIdDireccionNombreUbicacion"
  );

const inputDireccionPais =
  document.getElementById(
    "massIdDireccionPais"
  );

const inputDireccionLinea1 =
  document.getElementById(
    "massIdDireccionLinea1"
  );

const inputDireccionLinea2 =
  document.getElementById(
    "massIdDireccionLinea2"
  );

const inputDireccionCiudad =
  document.getElementById(
    "massIdDireccionCiudad"
  );

const inputDireccionEstadoRegion =
  document.getElementById(
    "massIdDireccionEstadoRegion"
  );

const inputDireccionCodigoPostal =
  document.getElementById(
    "massIdDireccionCodigoPostal"
  );

const inputDireccionInstrucciones =
  document.getElementById(
    "massIdDireccionInstrucciones"
  );

const inputDireccionPrincipal =
  document.getElementById(
    "massIdDireccionPrincipal"
  );

let direccionEditandoId = null;  

const seccionFotoPerfil = document.getElementById(
  "massIdFotoPerfil"
);

const btnFotoPerfil = document.getElementById(
  "btnMassIdFotoPerfil"
);

const btnVolverFotoPerfil = document.getElementById(
  "btnVolverFotoPerfilMassId"
);

const seccionSeguridad = document.getElementById(
  "massIdSeguridad"
);

const btnSeguridad = document.getElementById(
  "btnMassIdSeguridad"
);

const btnVolverSeguridad = document.getElementById(
  "btnVolverSeguridadMassId"
); 

const seguridadCorreoEstado = document.getElementById(
  "massIdSeguridadCorreoEstado"
);

const seguridadMfaEstado = document.getElementById(
  "massIdSeguridadMfaEstado"
);

const panelMfaConfiguracion = document.getElementById(
  "massIdMfaConfiguracion"
);

const btnConfigurarMfa = document.getElementById(
  "btnConfigurarMfaMassId"
);

const btnCancelarMfa = document.getElementById(
  "btnCancelarMfaMassId"
);

const btnConfirmarMfa = document.getElementById(
  "btnConfirmarMfaMassId"
);  

const inputCodigoMfa = document.getElementById(
  "massIdMfaCodigoConfirmacion"
);

const mensajeMfa = document.getElementById(
  "massIdMfaMensaje"
);

const qrMfaImagen = document.getElementById(
  "massIdMfaQrImagen"
);

const qrMfaPendiente = document.getElementById(
  "massIdMfaQrPendiente"
);

const claveMfaManual = document.getElementById(
  "massIdMfaClaveManual"
);

let factorMfaId = null;
let mfaConfiguradaActualmente = false;  

async function eliminarFactoresMfaPendientes() {
  const {
    data: factores,
    error: errorFactores
  } =
    await supabaseClient.auth.mfa
      .listFactors();

  if (errorFactores) {
    throw errorFactores;
  }

  const listaFactores =
    Array.isArray(factores?.all)
      ? factores.all
      : [
          ...(
            Array.isArray(factores?.totp)
              ? factores.totp
              : []
          ),
          ...(
            Array.isArray(factores?.phone)
              ? factores.phone
              : []
          )
        ];

  const factoresPendientes =
    listaFactores.filter((factor) => {
      const tipoFactor =
        factor.factor_type ||
        factor.factorType ||
        factor.type;

      return (
        tipoFactor === "totp" &&
        factor.status === "unverified"
      );
    });

  for (const factor of factoresPendientes) {
    const { error: errorEliminar } =
      await supabaseClient.auth.mfa
        .unenroll({
          factorId: factor.id
        });

    if (errorEliminar) {
      throw errorEliminar;
    }
  }
}  

async function cerrarPanelConfiguracionMfa() {
  /*
    Si existe un factor pendiente generado durante
    esta sesión, lo elimina antes de cerrar.
  */
  if (factorMfaId) {
    const idFactorPendiente = factorMfaId;

    factorMfaId = null;

    const { error: errorDescartarFactor } =
      await supabaseClient.auth.mfa.unenroll({
        factorId: idFactorPendiente
      });

    if (errorDescartarFactor) {
      console.warn(
        "NO SE PUDO DESCARTAR EL FACTOR MFA:",
        errorDescartarFactor
      );
    }
  }

  if (panelMfaConfiguracion) {
    panelMfaConfiguracion.style.display = "none";
  }

  if (qrMfaImagen) {
    qrMfaImagen.removeAttribute("src");
    qrMfaImagen.style.display = "none";
  }

  if (qrMfaPendiente) {
    qrMfaPendiente.textContent = "QR pendiente";
    qrMfaPendiente.style.display = "inline";
  }

  if (claveMfaManual) {
    claveMfaManual.textContent = "Clave pendiente";
  }

  if (inputCodigoMfa) {
    inputCodigoMfa.value = "";
  }

  if (mensajeMfa) {
    mensajeMfa.textContent = "";
    mensajeMfa.style.display = "none";
  }
} 

const btnSeleccionarFoto = document.getElementById(
  "btnSeleccionarFotoMassId"
);

const fotoInput = document.getElementById(
  "massIdFotoInput"
);

const fotoImagen = document.getElementById(
  "massIdFotoImagen"
);

const fotoIcono = document.getElementById(
  "massIdFotoIcono"
);

const fotoPrincipalImagen = document.getElementById(
  "massIdFotoPrincipalImagen"
);

const fotoPrincipalIcono = document.getElementById(
  "massIdFotoPrincipalIcono"
);  

const btnGuardarFoto = document.getElementById(
  "btnGuardarFotoMassId"
);

let archivoFotoSeleccionado = null;

function actualizarBotonGuardarFoto(
  habilitado,
  texto = "💾 Guardar foto"
) {
  if (!btnGuardarFoto) {
    return;
  }

  btnGuardarFoto.disabled = !habilitado;
  btnGuardarFoto.textContent = texto;

  btnGuardarFoto.style.borderColor =
    habilitado ? "#39ff14" : "#555";

  btnGuardarFoto.style.background =
    habilitado ? "#1b1b1b" : "#242424";

  btnGuardarFoto.style.color =
    habilitado ? "#fff" : "#888";

  btnGuardarFoto.style.cursor =
    habilitado ? "pointer" : "not-allowed";

  btnGuardarFoto.style.opacity =
    habilitado ? "1" : ".65";
}

actualizarBotonGuardarFoto(false);

function obtenerRutaAvatarDesdeUrl(urlFoto) {
  if (!urlFoto) {
    return null;
  }

  try {
    const url = new URL(urlFoto);

    const marcador =
      "/storage/v1/object/public/mass-id-avatars/";

    const posicion =
      url.pathname.indexOf(marcador);

    if (posicion === -1) {
      return null;
    }

    const rutaCodificada =
      url.pathname.slice(
        posicion + marcador.length
      );

    return decodeURIComponent(rutaCodificada);
  } catch (error) {
    console.warn(
      "URL ANTERIOR DE FOTO NO VÁLIDA:",
      error
    );

    return null;
  }
}  

/* Mostrar la foto guardada anteriormente */
if (perfil.foto_perfil_url) {
  if (fotoImagen && fotoIcono) {
    fotoImagen.src = perfil.foto_perfil_url;
    fotoImagen.style.display = "block";
    fotoIcono.style.display = "none";
  }

  if (
    fotoPrincipalImagen &&
    fotoPrincipalIcono
  ) {
    fotoPrincipalImagen.src =
      perfil.foto_perfil_url;

    fotoPrincipalImagen.style.display =
      "block";

    fotoPrincipalIcono.style.display =
      "none";
  }
} else {
  if (fotoImagen && fotoIcono) {
    fotoImagen.removeAttribute("src");
    fotoImagen.style.display = "none";
    fotoIcono.style.display = "inline";
  }

  if (
    fotoPrincipalImagen &&
    fotoPrincipalIcono
  ) {
    fotoPrincipalImagen.removeAttribute("src");

    fotoPrincipalImagen.style.display =
      "none";

    fotoPrincipalIcono.style.display =
      "inline";
  }
}  

/* Al abrir Mi MASS ID, siempre comienza en el menú principal */
if (menuPrincipal) {
  menuPrincipal.style.display = "block";
}

if (seccionInformacion) {
  seccionInformacion.style.display = "none";
}

if (seccionFotoPerfil) {
  seccionFotoPerfil.style.display = "none";
}

if (seccionSeguridad) {
  seccionSeguridad.style.display = "none";
}

if (seccionCambiarCorreo) {
  seccionCambiarCorreo.style.display =
    "none";
}  

/* Cargar direcciones privadas del usuario */
async function cargarDireccionesMass() {
  if (
    !panelDireccionesGuardadas ||
    !contadorDirecciones ||
    !mensajeDirecciones ||
    !listaDirecciones
  ) {
    return;
  }

  panelDireccionesGuardadas.style.display =
    "block";

  contadorDirecciones.textContent =
    "Consultando...";

  mensajeDirecciones.textContent =
    "Cargando direcciones...";

  mensajeDirecciones.style.color =
    "#bbb";

  mensajeDirecciones.style.display =
    "block";

  listaDirecciones.replaceChildren();

  try {
    const {
      data: direcciones,
      error: errorDirecciones
    } =
      await supabaseClient
        .from("direcciones_mass")
        .select(
          [
            "id",
            "nombre_ubicacion",
            "pais",
            "direccion_linea_1",
            "direccion_linea_2",
            "ciudad",
            "estado",
            "codigo_postal",
            "instrucciones_entrega",
            "es_principal",
            "activa",
            "creada_en"
          ].join(",")
        )
        .eq("auth_user_id", user.id)
        .eq("activa", true)
        .order(
          "es_principal",
          { ascending: false }
        )
        .order(
          "creada_en",
          { ascending: true }
        );

    if (errorDirecciones) {
      throw errorDirecciones;
    }

    const direccionesActivas =
      Array.isArray(direcciones)
        ? direcciones
        : [];

    const cantidad =
      direccionesActivas.length;

    contadorDirecciones.textContent =
      cantidad === 1
        ? "1 ubicación"
        : cantidad + " ubicaciones";

    /*
      Si todavía no hay direcciones,
      solamente muestra la invitación.
    */
    if (cantidad === 0) {
      panelDireccionesGuardadas.style.display =
        "none";

      mensajeDirecciones.style.display =
        "none";

      if (direccionEstado) {
        direccionEstado.style.display =
          "none";
      }

      if (btnAgregarDireccion) {
        btnAgregarDireccion.textContent =
          "📍 Agregar dirección opcional";
      }

      return;
    }

    mensajeDirecciones.style.display =
      "none";

    if (direccionEstado) {
      direccionEstado.textContent =
        "✅ Dirección preparada para servicios MASS";

      direccionEstado.style.display =
        "block";
    }

    if (btnAgregarDireccion) {
      btnAgregarDireccion.textContent =
        "📍 Agregar otra dirección";
    }

    direccionesActivas.forEach(
      function (direccion) {
        const tarjeta =
          document.createElement("article");

        tarjeta.style.cssText =
          "padding:15px;" +
          "border:1px solid " +
          (
            direccion.es_principal
              ? "rgba(57,255,20,.65)"
              : "#444"
          ) +
          ";" +
          "border-radius:12px;" +
          "background:#101010;" +
          "box-sizing:border-box;";

        const encabezado =
          document.createElement("div");

        encabezado.style.cssText =
          "display:flex;" +
          "align-items:flex-start;" +
          "justify-content:space-between;" +
          "gap:10px;" +
          "margin-bottom:10px;";

        const titulo =
          document.createElement("strong");

        titulo.textContent =
          "📍 " +
          (
            direccion.nombre_ubicacion ||
            "Ubicación"
          );

        titulo.style.cssText =
          "color:#fff;" +
          "font-size:16px;";

        encabezado.appendChild(titulo);

        if (direccion.es_principal) {
          const distintivo =
            document.createElement("span");

          distintivo.textContent =
            "Principal";

          distintivo.style.cssText =
            "padding:5px 8px;" +
            "border:1px solid " +
            "rgba(57,255,20,.45);" +
            "border-radius:15px;" +
            "color:#39ff14;" +
            "font-size:11px;" +
            "font-weight:bold;" +
            "white-space:nowrap;";

          encabezado.appendChild(
            distintivo
          );
        }

        tarjeta.appendChild(encabezado);

        const lineaPrincipal =
          document.createElement("p");

        lineaPrincipal.textContent =
          direccion.direccion_linea_1 ||
          "Dirección no disponible";

        lineaPrincipal.style.cssText =
          "margin:0;" +
          "color:#fff;" +
          "font-size:14px;" +
          "font-weight:bold;" +
          "line-height:1.5;";

        tarjeta.appendChild(
          lineaPrincipal
        );

        if (direccion.direccion_linea_2) {
          const lineaSecundaria =
            document.createElement("p");

          lineaSecundaria.textContent =
            direccion.direccion_linea_2;

          lineaSecundaria.style.cssText =
            "margin:4px 0 0;" +
            "color:#bbb;" +
            "font-size:13px;" +
            "line-height:1.5;";

          tarjeta.appendChild(
            lineaSecundaria
          );
        }

        const ciudadEstado =
          [
            direccion.ciudad,
            direccion.estado
          ]
            .filter(Boolean)
            .join(", ");

        const localidad =
          [
            ciudadEstado,
            direccion.codigo_postal
          ]
            .filter(Boolean)
            .join(" ");

        if (localidad) {
          const textoLocalidad =
            document.createElement("p");

          textoLocalidad.textContent =
            localidad;

          textoLocalidad.style.cssText =
            "margin:6px 0 0;" +
            "color:#39ff14;" +
            "font-size:13px;" +
            "font-weight:bold;" +
            "line-height:1.5;";

          tarjeta.appendChild(
            textoLocalidad
          );
        }

        if (direccion.pais) {
          const textoPais =
            document.createElement("p");

          textoPais.textContent =
            direccion.pais;

          textoPais.style.cssText =
            "margin:4px 0 0;" +
            "color:#aaa;" +
            "font-size:13px;" +
            "line-height:1.5;";

          tarjeta.appendChild(
            textoPais
          );
        }

        if (
          direccion.instrucciones_entrega
        ) {
          const instrucciones =
            document.createElement("p");

          instrucciones.textContent =
            "🚚 " +
            direccion.instrucciones_entrega;

          instrucciones.style.cssText =
            "margin:10px 0 0;" +
            "padding-top:10px;" +
            "border-top:1px solid #333;" +
            "color:#bbb;" +
            "font-size:12px;" +
            "line-height:1.5;";

          tarjeta.appendChild(
            instrucciones
          );
        }

             /* Controles de la dirección */
        const controlesDireccion =
          document.createElement("div");

        controlesDireccion.style.cssText =
          "display:flex;" +
          "gap:10px;" +
          "flex-wrap:wrap;" +
          "margin-top:14px;" +
          "padding-top:12px;" +
          "border-top:1px solid #333;";

        const btnEditarDireccion =
          document.createElement("button");

        btnEditarDireccion.type =
          "button";

        btnEditarDireccion.textContent =
          "✏️ Editar";

        btnEditarDireccion.dataset.direccionId =
          direccion.id;

        btnEditarDireccion.style.cssText =
          "flex:1;" +
          "min-width:110px;" +
          "padding:9px 12px;" +
          "border:1px solid #39ff14;" +
          "border-radius:9px;" +
          "background:#1b1b1b;" +
          "color:#fff;" +
          "font-weight:bold;" +
          "cursor:pointer;";

     btnEditarDireccion.onclick =
  function () {
    direccionEditandoId =
      direccion.id;

    inputDireccionNombre.value =
      direccion.nombre_ubicacion ||
      "Casa";

    inputDireccionPais.value =
      direccion.pais ||
      "Estados Unidos";

    inputDireccionLinea1.value =
      direccion.direccion_linea_1 ||
      "";

    if (inputDireccionLinea2) {
      inputDireccionLinea2.value =
        direccion.direccion_linea_2 ||
        "";
    }

    inputDireccionCiudad.value =
      direccion.ciudad ||
      "";

    inputDireccionEstadoRegion.value =
      direccion.estado ||
      "";

    inputDireccionCodigoPostal.value =
      direccion.codigo_postal ||
      "";

    if (inputDireccionInstrucciones) {
      inputDireccionInstrucciones.value =
        direccion.instrucciones_entrega ||
        "";
    }

    if (inputDireccionPrincipal) {
      inputDireccionPrincipal.checked =
        Boolean(
          direccion.es_principal
        );
    }

    if (mensajeDireccionFormulario) {
      mensajeDireccionFormulario.textContent =
        "✏️ Editando esta dirección.";

      mensajeDireccionFormulario.style.color =
        "#fff";

      mensajeDireccionFormulario.style.display =
        "block";
    }

    direccionInvitacion.style.display =
      "none";

    direccionFormulario.style.display =
      "block";

    btnGuardarDireccion.textContent =
      "💾 Actualizar dirección";

    direccionFormulario.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };   

        const btnEliminarDireccion =
          document.createElement("button");

        btnEliminarDireccion.type =
          "button";

        btnEliminarDireccion.textContent =
          "🗑️ Eliminar";

        btnEliminarDireccion.dataset.direccionId =
          direccion.id;

        btnEliminarDireccion.style.cssText =
          "flex:1;" +
          "min-width:110px;" +
          "padding:9px 12px;" +
          "border:1px solid #ff5b5b;" +
          "border-radius:9px;" +
          "background:#1b1b1b;" +
          "color:#ff8a8a;" +
          "font-weight:bold;" +
          "cursor:pointer;";

              btnEliminarDireccion.onclick =
          async function () {
            const nombreDireccion =
              direccion.nombre_ubicacion ||
              "esta ubicación";

            const confirmarEliminacion =
              window.confirm(
                "¿Deseas eliminar la dirección " +
                '"' +
                nombreDireccion +
                '"?'
              );

            if (!confirmarEliminacion) {
              return;
            }

            const textoOriginal =
              btnEliminarDireccion.textContent;

            btnEliminarDireccion.disabled =
              true;

            btnEditarDireccion.disabled =
              true;

            btnEliminarDireccion.textContent =
              "⏳ Eliminando...";

            btnEliminarDireccion.style.cursor =
              "not-allowed";

            btnEliminarDireccion.style.opacity =
              ".7";

            try {
              const eraPrincipal =
                Boolean(
                  direccion.es_principal
                );

              const direccionReemplazo =
                eraPrincipal
                  ? direccionesActivas.find(
                      function (otraDireccion) {
                        return (
                          otraDireccion.id !==
                          direccion.id
                        );
                      }
                    )
                  : null;

              /*
                Si se elimina la principal y existe
                otra dirección, primero liberamos
                la marca de principal.
              */
              if (
                eraPrincipal &&
                direccionReemplazo?.id
              ) {
                const {
                  error:
                    errorDesmarcarPrincipal
                } =
                  await supabaseClient
                    .from("direcciones_mass")
                    .update({
                      es_principal: false,
                      actualizada_en:
                        new Date()
                          .toISOString()
                    })
                    .eq(
                      "id",
                      direccion.id
                    )
                    .eq(
                      "auth_user_id",
                      user.id
                    );

                if (
                  errorDesmarcarPrincipal
                ) {
                  throw errorDesmarcarPrincipal;
                }

                const {
                  error:
                    errorAsignarPrincipal
                } =
                  await supabaseClient
                    .from("direcciones_mass")
                    .update({
                      es_principal: true,
                      actualizada_en:
                        new Date()
                          .toISOString()
                    })
                    .eq(
                      "id",
                      direccionReemplazo.id
                    )
                    .eq(
                      "auth_user_id",
                      user.id
                    );

                if (errorAsignarPrincipal) {
                  /*
                    Si no pudimos asignar la otra,
                    restauramos la principal original.
                  */
                  await supabaseClient
                    .from("direcciones_mass")
                    .update({
                      es_principal: true,
                      actualizada_en:
                        new Date()
                          .toISOString()
                    })
                    .eq(
                      "id",
                      direccion.id
                    )
                    .eq(
                      "auth_user_id",
                      user.id
                    );

                  throw errorAsignarPrincipal;
                }
              }

              /*
                Eliminación segura:
                conserva la fila, pero la desactiva.
              */
              const {
                error:
                  errorDesactivarDireccion
              } =
                await supabaseClient
                  .from("direcciones_mass")
                  .update({
                    activa: false,
                    es_principal: false,
                    actualizada_en:
                      new Date()
                        .toISOString()
                  })
                  .eq(
                    "id",
                    direccion.id
                  )
                  .eq(
                    "auth_user_id",
                    user.id
                  );

              if (
                errorDesactivarDireccion
              ) {
                throw errorDesactivarDireccion;
              }

              if (
                direccionEditandoId ===
                direccion.id
              ) {
                direccionEditandoId = null;
              }

              await cargarDireccionesMass();

              alert(
                "✅ Dirección eliminada correctamente."
              );
            } catch (error) {
              console.error(
                "ERROR ELIMINANDO DIRECCIÓN MASS:",
                error
              );

              alert(
                "❌ No fue posible eliminar la dirección. Inténtalo nuevamente."
              );

              btnEliminarDireccion.disabled =
                false;

              btnEditarDireccion.disabled =
                false;

              btnEliminarDireccion.textContent =
                textoOriginal;

              btnEliminarDireccion.style.cursor =
                "pointer";

              btnEliminarDireccion.style.opacity =
                "1";
            }
          };  

        controlesDireccion.appendChild(
          btnEditarDireccion
        );

        controlesDireccion.appendChild(
          btnEliminarDireccion
        );

        tarjeta.appendChild(
          controlesDireccion
        );   

        listaDirecciones.appendChild(
          tarjeta
        );
      }
    );
  } catch (error) {
    console.error(
      "ERROR CARGANDO DIRECCIONES MASS:",
      error
    );

    contadorDirecciones.textContent =
      "No disponible";

    mensajeDirecciones.textContent =
      "❌ No fue posible cargar tus direcciones.";

    mensajeDirecciones.style.color =
      "#ff5b5b";

    mensajeDirecciones.style.display =
      "block";
  }
}  

/* Abrir Información personal */
if (
  btnInformacionPersonal &&
  menuPrincipal &&
  seccionInformacion
) {
  btnInformacionPersonal.onclick = async function () {
    if (infoNombre) {
      infoNombre.textContent =
        perfil.nombre || "No disponible";
    }

    if (infoNumero) {
      infoNumero.textContent =
        perfil.mass_id || "No disponible";
    }

    if (infoTelefono) {
      infoTelefono.textContent =
        perfil.telefono || "No disponible";
    }

    if (infoCorreo) {
      infoCorreo.textContent =
        perfil.email ||
        user.email ||
        "No disponible";
    }

    menuPrincipal.style.display = "none";
    seccionInformacion.style.display = "block";

   await cargarDireccionesMass(); 

    seccionInformacion.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}

/* Regresar al menú principal */
if (
  btnVolverMenuMassId &&
  menuPrincipal &&
  seccionInformacion
) {
  btnVolverMenuMassId.onclick = function () {
    seccionInformacion.style.display = "none";
    menuPrincipal.style.display = "block";

    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}

  /* Regresar desde Cambiar correo */
function regresarDesdeCambioCorreo() {
  if (seccionCambiarCorreo) {
    seccionCambiarCorreo.style.display =
      "none";
  }

  if (menuPrincipal) {
    menuPrincipal.style.display =
      "block";
  }

  if (inputNuevoCorreo) {
    inputNuevoCorreo.value = "";
  }

  if (inputConfirmarNuevoCorreo) {
    inputConfirmarNuevoCorreo.value = "";
  }

  if (inputPasswordActualCambioCorreo) {
  inputPasswordActualCambioCorreo.value =
    "";
}

    factorMfaCambioCorreoId = null;
  nuevoCorreoPendienteCambio = "";
  mfaCambioCorreoAprobado = false;

  if (panelMfaCambioCorreo) {
    panelMfaCambioCorreo.style.display =
      "none";
  }

  if (inputCodigoMfaCambioCorreo) {
    inputCodigoMfaCambioCorreo.value = "";
  }

  if (mensajeMfaCambioCorreo) {
    mensajeMfaCambioCorreo.textContent =
      "";

    mensajeMfaCambioCorreo.style.display =
      "none";
  }

  if (btnContinuarCambioCorreo) {
    btnContinuarCambioCorreo.style.display =
      "block";
  }

  if (mensajeCambioCorreo) {
    mensajeCambioCorreo.textContent = "";
    mensajeCambioCorreo.style.display =
      "none";
  }

  panel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* Limpiar formulario de Cambiar teléfono */
function limpiarFormularioCambioTelefono() {
  if (inputNuevoTelefono) {
    inputNuevoTelefono.value = "";
  }

  if (inputConfirmarNuevoTelefono) {
    inputConfirmarNuevoTelefono.value = "";
  }

  if (inputPasswordActualCambioTelefono) {
    inputPasswordActualCambioTelefono.value = "";
  }

  if (mensajeCambioTelefono) {
    mensajeCambioTelefono.textContent = "";
    mensajeCambioTelefono.style.display = "none";
  }

  if (btnContinuarCambioTelefono) {
    btnContinuarCambioTelefono.disabled = false;
    btnContinuarCambioTelefono.textContent =
      "🔐 Continuar y verificar identidad";
    btnContinuarCambioTelefono.style.cursor =
      "pointer";
    btnContinuarCambioTelefono.style.opacity =
      "1";
  }
}

/* Mostrar mensajes de Cambiar teléfono */
function mostrarMensajeCambioTelefono(
  texto,
  color
) {
  if (!mensajeCambioTelefono) {
    return;
  }

  mensajeCambioTelefono.textContent =
    texto;

  mensajeCambioTelefono.style.color =
    color;

  mensajeCambioTelefono.style.borderColor =
    color;

  mensajeCambioTelefono.style.display =
    "block";
}  

/* Regresar desde Cambiar teléfono */
function regresarDesdeCambioTelefono() {
  limpiarFormularioCambioTelefono();
  
  if (seccionCambiarTelefono) {
    seccionCambiarTelefono.style.display =
      "none";
  }

  if (menuPrincipal) {
    menuPrincipal.style.display =
      "block";
  }

  panel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* Abrir Cambiar teléfono */
if (
  btnCambiarTelefono &&
  menuPrincipal &&
  seccionCambiarTelefono
) {
  btnCambiarTelefono.onclick =
    function () {
      const telefonoActual =
        perfil.telefono ||
        user.phone ||
        "No disponible";

      if (telefonoActualCambio) {
        telefonoActualCambio.textContent =
          telefonoActual;
      }

      menuPrincipal.style.display =
        "none";

      if (seccionInformacion) {
        seccionInformacion.style.display =
          "none";
      }

      if (seccionFotoPerfil) {
        seccionFotoPerfil.style.display =
          "none";
      }

      if (seccionSeguridad) {
        seccionSeguridad.style.display =
          "none";
      }

      if (seccionCambiarCorreo) {
        seccionCambiarCorreo.style.display =
          "none";
      }

      seccionCambiarTelefono.style.display =
        "block";

      seccionCambiarTelefono.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    };
}

/* Volver desde Cambiar teléfono */
if (
  btnVolverCambiarTelefono &&
  menuPrincipal &&
  seccionCambiarTelefono
) {
  btnVolverCambiarTelefono.onclick =
    function () {
      regresarDesdeCambioTelefono();
    };
} 

/* Cancelar Cambiar teléfono */
if (
  btnCancelarCambioTelefono &&
  menuPrincipal &&
  seccionCambiarTelefono
) {
  btnCancelarCambioTelefono.onclick =
    function () {
      regresarDesdeCambioTelefono();
    };
}

/* Validar datos de Cambiar teléfono */
if (
  btnContinuarCambioTelefono &&
  inputNuevoTelefono &&
  inputConfirmarNuevoTelefono &&
  inputPasswordActualCambioTelefono
) {
  btnContinuarCambioTelefono.onclick =
    function () {
      const nuevoTelefono =
        inputNuevoTelefono.value
          .replace(/\D/g, "");

      const confirmarNuevoTelefono =
        inputConfirmarNuevoTelefono.value
          .replace(/\D/g, "");

      const passwordActual =
        inputPasswordActualCambioTelefono
          .value;

      const telefonoActual =
        (
          perfil.telefono ||
          user.phone ||
          ""
        )
          .replace(/\D/g, "");

      if (!nuevoTelefono) {
        mostrarMensajeCambioTelefono(
          "❌ Escribe el nuevo número de teléfono.",
          "#ff5b5b"
        );

        inputNuevoTelefono.focus();
        return;
      }

      if (
        nuevoTelefono.length < 10 ||
        nuevoTelefono.length > 15
      ) {
        mostrarMensajeCambioTelefono(
          "❌ Escribe un teléfono válido de 10 a 15 dígitos.",
          "#ff5b5b"
        );

        inputNuevoTelefono.focus();
        return;
      }

      if (
        nuevoTelefono === telefonoActual
      ) {
        mostrarMensajeCambioTelefono(
          "❌ El nuevo teléfono es igual al teléfono actual.",
          "#ff5b5b"
        );

        inputNuevoTelefono.focus();
        return;
      }

      if (!confirmarNuevoTelefono) {
        mostrarMensajeCambioTelefono(
          "❌ Confirma el nuevo número de teléfono.",
          "#ff5b5b"
        );

        inputConfirmarNuevoTelefono.focus();
        return;
      }

      if (
        nuevoTelefono !==
        confirmarNuevoTelefono
      ) {
        mostrarMensajeCambioTelefono(
          "❌ Los números de teléfono no coinciden.",
          "#ff5b5b"
        );

        inputConfirmarNuevoTelefono.focus();
        return;
      }

      if (!passwordActual) {
        mostrarMensajeCambioTelefono(
          "❌ Escribe tu contraseña actual.",
          "#ff5b5b"
        );

        inputPasswordActualCambioTelefono
          .focus();

        return;
      }

      mostrarMensajeCambioTelefono(
        "✅ Información validada. Tu contraseña será confirmada en el siguiente paso.",
        "#39ff14"
      );
    };
}  

/* Abrir Cambiar correo */
if (
  btnCambiarCorreo &&
  menuPrincipal &&
  seccionCambiarCorreo
) {
  btnCambiarCorreo.onclick =
    function () {
      const correoActual =
        perfil.email ||
        user.email ||
        "No disponible";

      if (correoActualCambio) {
        correoActualCambio.textContent =
          correoActual;
      }

      if (inputNuevoCorreo) {
        inputNuevoCorreo.value = "";
      }

      if (inputConfirmarNuevoCorreo) {
        inputConfirmarNuevoCorreo.value =
          "";
      }

      if (inputPasswordActualCambioCorreo) {
  inputPasswordActualCambioCorreo.value =
    "";
}

           factorMfaCambioCorreoId = null;
      nuevoCorreoPendienteCambio = "";
      mfaCambioCorreoAprobado = false;

      if (panelMfaCambioCorreo) {
        panelMfaCambioCorreo.style.display =
          "none";
      }

      if (inputCodigoMfaCambioCorreo) {
        inputCodigoMfaCambioCorreo.value =
          "";
      }

      if (mensajeMfaCambioCorreo) {
        mensajeMfaCambioCorreo.textContent =
          "";

        mensajeMfaCambioCorreo.style.display =
          "none";
      }

      if (btnContinuarCambioCorreo) {
        btnContinuarCambioCorreo.style.display =
          "block";
      } 

      if (mensajeCambioCorreo) {
        mensajeCambioCorreo.textContent =
          "";

        mensajeCambioCorreo.style.display =
          "none";
      }

      menuPrincipal.style.display =
        "none";

      if (seccionInformacion) {
        seccionInformacion.style.display =
          "none";
      }

      if (seccionFotoPerfil) {
        seccionFotoPerfil.style.display =
          "none";
      }

      if (seccionSeguridad) {
        seccionSeguridad.style.display =
          "none";
      }

      seccionCambiarCorreo.style.display =
        "block";

      seccionCambiarCorreo.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      setTimeout(function () {
        inputNuevoCorreo?.focus();
      }, 150);
    };
}

/* Mostrar mensajes de Cambiar correo */
function mostrarMensajeCambioCorreo(
  texto,
  color
) {
  if (!mensajeCambioCorreo) {
    return;
  }

  mensajeCambioCorreo.textContent =
    texto;

  mensajeCambioCorreo.style.color =
    color;

  mensajeCambioCorreo.style.borderColor =
    color;

  mensajeCambioCorreo.style.display =
    "block";
}

/* Validar datos antes de confirmar identidad */
if (
  btnContinuarCambioCorreo &&
  inputNuevoCorreo &&
  inputConfirmarNuevoCorreo &&
  inputPasswordActualCambioCorreo
) {
  btnContinuarCambioCorreo.onclick =
    async function () {
      const nuevoCorreo =
        inputNuevoCorreo.value
          .trim()
          .toLowerCase();

      const confirmarNuevoCorreo =
        inputConfirmarNuevoCorreo.value
          .trim()
          .toLowerCase();

      const passwordActual =
        inputPasswordActualCambioCorreo
          .value;

      const correoActual =
        (
          user.email ||
          perfil.email ||
          ""
        )
          .trim()
          .toLowerCase();

      const patronCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nuevoCorreo) {
        mostrarMensajeCambioCorreo(
          "❌ Escribe el nuevo correo electrónico.",
          "#ff5b5b"
        );

        inputNuevoCorreo.focus();
        return;
      }

      if (!patronCorreo.test(nuevoCorreo)) {
        mostrarMensajeCambioCorreo(
          "❌ Escribe un correo electrónico válido.",
          "#ff5b5b"
        );

        inputNuevoCorreo.focus();
        return;
      }

      if (
        nuevoCorreo ===
        correoActual
      ) {
        mostrarMensajeCambioCorreo(
          "❌ El nuevo correo es igual al correo actual.",
          "#ff5b5b"
        );

        inputNuevoCorreo.focus();
        return;
      }

      if (!confirmarNuevoCorreo) {
        mostrarMensajeCambioCorreo(
          "❌ Confirma el nuevo correo electrónico.",
          "#ff5b5b"
        );

        inputConfirmarNuevoCorreo.focus();
        return;
      }

      if (
        nuevoCorreo !==
        confirmarNuevoCorreo
      ) {
        mostrarMensajeCambioCorreo(
          "❌ Los correos electrónicos no coinciden.",
          "#ff5b5b"
        );

        inputConfirmarNuevoCorreo.focus();
        return;
      }

      if (!passwordActual) {
        mostrarMensajeCambioCorreo(
          "❌ Escribe tu contraseña actual.",
          "#ff5b5b"
        );

        inputPasswordActualCambioCorreo
          .focus();

        return;
      }

         const textoOriginalBoton =
        btnContinuarCambioCorreo.textContent;

      let clienteVerificacionPassword =
        null;

      btnContinuarCambioCorreo.disabled =
        true;

      btnContinuarCambioCorreo.textContent =
        "⏳ Confirmando contraseña...";

      btnContinuarCambioCorreo.style.cursor =
        "not-allowed";

      btnContinuarCambioCorreo.style.opacity =
        ".7";

      mostrarMensajeCambioCorreo(
        "⏳ Confirmando tu contraseña actual...",
        "#ffffff"
      );

      try {
        if (
          !window.supabase ||
          typeof window.supabase.createClient !==
            "function"
        ) {
          throw new Error(
            "No está disponible el cliente temporal de Supabase."
          );
        }

        if (
          !supabaseClient.supabaseUrl ||
          !supabaseClient.supabaseKey
        ) {
          throw new Error(
            "No fue posible preparar la verificación segura."
          );
        }

        /*
          Este cliente temporal no guarda ni
          reemplaza la sesión principal.
        */
        clienteVerificacionPassword =
          window.supabase.createClient(
            supabaseClient.supabaseUrl,
            supabaseClient.supabaseKey,
            {
              auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
                storageKey:
                  "mass-password-check-" +
                  Date.now()
              }
            }
          );

        const {
          data: datosPassword,
          error: errorPassword
        } =
          await clienteVerificacionPassword
            .auth
            .signInWithPassword({
              email: correoActual,
              password: passwordActual
            });

        if (
          errorPassword ||
          !datosPassword?.user
        ) {
          inputPasswordActualCambioCorreo
            .value = "";

          mostrarMensajeCambioCorreo(
            "❌ La contraseña actual es incorrecta.",
            "#ff5b5b"
          );

          inputPasswordActualCambioCorreo
            .focus();

          return;
        }

        /*
          La identidad comprobada debe coincidir
          con el usuario actualmente conectado.
        */
        if (
          datosPassword.user.id !==
          user.id
        ) {
          throw new Error(
            "La identidad confirmada no coincide con la sesión activa."
          );
        }

                inputPasswordActualCambioCorreo
          .value = "";

        const {
          data: factoresCambioCorreo,
          error: errorFactoresCambioCorreo
        } =
          await supabaseClient.auth.mfa
            .listFactors();

        if (errorFactoresCambioCorreo) {
          throw errorFactoresCambioCorreo;
        }

        const listaFactoresCambioCorreo =
          Array.isArray(
            factoresCambioCorreo?.all
          )
            ? factoresCambioCorreo.all
            : [
                ...(
                  Array.isArray(
                    factoresCambioCorreo?.totp
                  )
                    ? factoresCambioCorreo.totp
                    : []
                ),
                ...(
                  Array.isArray(
                    factoresCambioCorreo?.phone
                  )
                    ? factoresCambioCorreo.phone
                    : []
                )
              ];

        const factorVerificadoCambioCorreo =
          listaFactoresCambioCorreo.find(
            function (factor) {
              const tipoFactor =
                factor.factor_type ||
                factor.factorType ||
                factor.type;

              return (
                tipoFactor === "totp" &&
                factor.status === "verified"
              );
            }
          );

        nuevoCorreoPendienteCambio =
          nuevoCorreo;

        if (
          !factorVerificadoCambioCorreo?.id
        ) {
          mostrarMensajeCambioCorreo(
            "✅ Contraseña confirmada. Esta cuenta no tiene verificación en dos pasos activa.",
            "#39ff14"
          );

          return;
        }

        factorMfaCambioCorreoId =
          factorVerificadoCambioCorreo.id;

        if (inputCodigoMfaCambioCorreo) {
          inputCodigoMfaCambioCorreo.value =
            "";
        }

        if (mensajeMfaCambioCorreo) {
          mensajeMfaCambioCorreo.textContent =
            "";

          mensajeMfaCambioCorreo.style.display =
            "none";
        }

        if (panelMfaCambioCorreo) {
          panelMfaCambioCorreo.style.display =
            "block";

          panelMfaCambioCorreo.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }

        btnContinuarCambioCorreo.style.display =
          "none";

        mostrarMensajeCambioCorreo(
          "✅ Contraseña confirmada. Escribe ahora el código de seguridad de tu aplicación.",
          "#39ff14"
        );

        setTimeout(function () {
          inputCodigoMfaCambioCorreo?.focus();
        }, 150);
      } catch (error) {
        console.error(
          "ERROR CONFIRMANDO CONTRASEÑA PARA CAMBIO DE CORREO:",
          error
        );

        inputPasswordActualCambioCorreo
          .value = "";

        mostrarMensajeCambioCorreo(
          "❌ No fue posible confirmar tu contraseña. Inténtalo nuevamente.",
          "#ff5b5b"
        );

        inputPasswordActualCambioCorreo
          .focus();
      } finally {
        /*
          Cierra únicamente la sesión temporal.
          Nunca utiliza el cierre global.
        */
        if (clienteVerificacionPassword) {
          try {
            await clienteVerificacionPassword
              .auth
              .signOut({
                scope: "local"
              });
          } catch (
            errorCerrarVerificacion
          ) {
            console.warn(
              "No fue posible cerrar el cliente temporal:",
              errorCerrarVerificacion
            );
          }

          if (
            typeof clienteVerificacionPassword
              .auth.dispose === "function"
          ) {
            clienteVerificacionPassword
              .auth.dispose();
          }
        }

        btnContinuarCambioCorreo.disabled =
          false;

        btnContinuarCambioCorreo.textContent =
          textoOriginalBoton;

        btnContinuarCambioCorreo.style.cursor =
          "pointer";

        btnContinuarCambioCorreo.style.opacity =
          "1";
      }   
    };
}

/* Mostrar mensajes del código MFA */
function mostrarMensajeMfaCambioCorreo(
  texto,
  color
) {
  if (!mensajeMfaCambioCorreo) {
    return;
  }

  mensajeMfaCambioCorreo.textContent =
    texto;

  mensajeMfaCambioCorreo.style.color =
    color;

  mensajeMfaCambioCorreo.style.borderColor =
    color;

  mensajeMfaCambioCorreo.style.display =
    "block";
}

/* Permitir solamente seis números */
if (inputCodigoMfaCambioCorreo) {
  inputCodigoMfaCambioCorreo.oninput =
    function () {
      this.value = this.value
        .replace(/\D/g, "")
        .slice(0, 6);
    };
}

/* Confirmar código MFA del cambio de correo */
if (
  btnConfirmarMfaCambioCorreo &&
  inputCodigoMfaCambioCorreo
) {
  btnConfirmarMfaCambioCorreo.onclick =
    async function () {
      const codigoMfa =
        inputCodigoMfaCambioCorreo.value
          .replace(/\D/g, "");

      if (
        !factorMfaCambioCorreoId ||
        !nuevoCorreoPendienteCambio
      ) {
        mostrarMensajeMfaCambioCorreo(
          "❌ La confirmación anterior venció. Vuelve a confirmar tu contraseña.",
          "#ff5b5b"
        );

        return;
      }

      if (!/^\d{6}$/.test(codigoMfa)) {
        mostrarMensajeMfaCambioCorreo(
          "❌ Escribe el código completo de seis dígitos.",
          "#ff5b5b"
        );

        inputCodigoMfaCambioCorreo.focus();
        return;
      }

      const textoOriginalBotonMfa =
        btnConfirmarMfaCambioCorreo
          .textContent;

      let codigoMfaConfirmado = false;

      mfaCambioCorreoAprobado = false;

      btnConfirmarMfaCambioCorreo.disabled =
        true;

      btnConfirmarMfaCambioCorreo.textContent =
        "⏳ Confirmando código...";

      btnConfirmarMfaCambioCorreo.style.cursor =
        "not-allowed";

      btnConfirmarMfaCambioCorreo.style.opacity =
        ".7";

      mostrarMensajeMfaCambioCorreo(
        "⏳ Verificando tu código de seguridad...",
        "#ffffff"
      );

      try {
        const {
          error: errorConfirmarMfa
        } =
          await supabaseClient.auth.mfa
            .challengeAndVerify({
              factorId:
                factorMfaCambioCorreoId,
              code: codigoMfa
            });

        if (errorConfirmarMfa) {
          inputCodigoMfaCambioCorreo.value =
            "";

          mostrarMensajeMfaCambioCorreo(
            "❌ El código es incorrecto o venció. Escribe el código nuevo de tu aplicación.",
            "#ff5b5b"
          );

          inputCodigoMfaCambioCorreo.focus();
          return;
        }

                mfaCambioCorreoAprobado = true;
        codigoMfaConfirmado = true;

        inputCodigoMfaCambioCorreo.value =
          "";

        btnConfirmarMfaCambioCorreo.textContent =
          "⏳ Solicitando cambio...";

        mostrarMensajeMfaCambioCorreo(
          "⏳ Código confirmado. Enviando la solicitud de cambio de correo...",
          "#ffffff"
        );

        const correoSolicitado =
          nuevoCorreoPendienteCambio;

        const {
          data: datosSolicitudCorreo,
          error: errorSolicitudCorreo
        } =
          await supabaseClient.auth.updateUser({
            email: correoSolicitado
          });

        if (errorSolicitudCorreo) {
          console.error(
            "ERROR SOLICITANDO CAMBIO DE CORREO MASS ID:",
            errorSolicitudCorreo
          );

          mfaCambioCorreoAprobado = false;
          codigoMfaConfirmado = false;

          mostrarMensajeMfaCambioCorreo(
            "❌ El código fue correcto, pero no fue posible enviar la solicitud de cambio de correo. Inténtalo nuevamente.",
            "#ff5b5b"
          );

          return;
        }

        const correoPendienteConfirmacion =
          datosSolicitudCorreo?.user?.new_email ||
          correoSolicitado;

        mostrarMensajeMfaCambioCorreo(
          "✅ Solicitud enviada. Revisa " +
            correoPendienteConfirmacion +
            " y abre el enlace de verificación. Si también recibes un mensaje en tu correo actual, confirma ambos enlaces.",
          "#39ff14"
        );

        mostrarMensajeCambioCorreo(
          "📧 El cambio está pendiente de confirmación. Tu correo actual seguirá activo hasta completar la verificación.",
          "#39ff14"
        );

        btnConfirmarMfaCambioCorreo.textContent =
          "✅ Revisa tu nuevo correo";

        btnConfirmarMfaCambioCorreo.style.opacity =
          "1";
      } catch (error) {
        console.error(
          "ERROR CONFIRMANDO MFA PARA CAMBIO DE CORREO:",
          error
        );

        inputCodigoMfaCambioCorreo.value =
          "";

        mostrarMensajeMfaCambioCorreo(
          "❌ No fue posible confirmar el código. Inténtalo nuevamente.",
          "#ff5b5b"
        );

        inputCodigoMfaCambioCorreo.focus();
      } finally {
        if (!codigoMfaConfirmado) {
          btnConfirmarMfaCambioCorreo.disabled =
            false;

          btnConfirmarMfaCambioCorreo.textContent =
            textoOriginalBotonMfa;

          btnConfirmarMfaCambioCorreo.style.cursor =
            "pointer";

          btnConfirmarMfaCambioCorreo.style.opacity =
            "1";
        }
      }
    };
}  

/* Volver desde Cambiar correo */
if (
  btnVolverCambiarCorreo &&
  menuPrincipal &&
  seccionCambiarCorreo
) {
  btnVolverCambiarCorreo.onclick =
    function () {
      regresarDesdeCambioCorreo();
    };
}

/* Cancelar Cambiar correo */
if (
  btnCancelarCambioCorreo &&
  menuPrincipal &&
  seccionCambiarCorreo
) {
  btnCancelarCambioCorreo.onclick =
    function () {
      regresarDesdeCambioCorreo();
    };
}  

/* Abrir formulario opcional de dirección */
if (
  btnAgregarDireccion &&
  direccionInvitacion &&
  direccionFormulario
) {
  btnAgregarDireccion.onclick = function () {

      direccionEditandoId = null;

    btnGuardarDireccion.textContent =
      "💾 Guardar dirección";

    inputDireccionNombre.value =
      "Casa";

    inputDireccionPais.value =
      "Estados Unidos";

    inputDireccionLinea1.value =
      "";

    if (inputDireccionLinea2) {
      inputDireccionLinea2.value = "";
    }

    inputDireccionCiudad.value =
      "";

    inputDireccionEstadoRegion.value =
      "";

    inputDireccionCodigoPostal.value =
      "";

    if (inputDireccionInstrucciones) {
      inputDireccionInstrucciones.value = "";
    }

    if (inputDireccionPrincipal) {
      inputDireccionPrincipal.checked =
        true;
    }
    
    direccionInvitacion.style.display = "none";
    direccionFormulario.style.display = "block";

    if (mensajeDireccionFormulario) {
      mensajeDireccionFormulario.textContent = "";
      mensajeDireccionFormulario.style.display = "none";
    }

    direccionFormulario.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}

/* Cancelar formulario opcional de dirección */
if (
  btnCancelarDireccion &&
  direccionInvitacion &&
  direccionFormulario
) {
  btnCancelarDireccion.onclick = function () {

      direccionEditandoId = null;

    btnGuardarDireccion.textContent =
      "💾 Guardar dirección";
    
    direccionFormulario.style.display = "none";
    direccionInvitacion.style.display = "block";

    if (mensajeDireccionFormulario) {
      mensajeDireccionFormulario.textContent = "";
      mensajeDireccionFormulario.style.display = "none";
    }

    direccionInvitacion.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}

/* Guardar dirección privada MASS */
if (
  btnGuardarDireccion &&
  direccionInvitacion &&
  direccionFormulario &&
  inputDireccionNombre &&
  inputDireccionPais &&
  inputDireccionLinea1 &&
  inputDireccionCiudad &&
  inputDireccionEstadoRegion &&
  inputDireccionCodigoPostal
) {
  btnGuardarDireccion.onclick =
    async function () {
      const nombreUbicacion =
        inputDireccionNombre.value.trim() ||
        "Casa";

      const pais =
        inputDireccionPais.value.trim();

      const direccionLinea1 =
        inputDireccionLinea1.value.trim();

      const direccionLinea2 =
        inputDireccionLinea2
          ? inputDireccionLinea2.value.trim()
          : "";

      const ciudad =
        inputDireccionCiudad.value.trim();

      const estadoRegion =
        inputDireccionEstadoRegion.value.trim();

      const codigoPostal =
        inputDireccionCodigoPostal.value.trim();

      const instrucciones =
        inputDireccionInstrucciones
          ? inputDireccionInstrucciones.value.trim()
          : "";

      const esPrincipal =
        Boolean(
          inputDireccionPrincipal?.checked
        );

          const direccionIdActual =
        direccionEditandoId;

      const esEdicion =
        Boolean(direccionIdActual);
  
     function mostrarMensajeDireccion(
        texto,
        color
      ) {
        if (!mensajeDireccionFormulario) {
          return;
        }

        mensajeDireccionFormulario.textContent =
          texto;

        mensajeDireccionFormulario.style.color =
          color;

        mensajeDireccionFormulario.style.display =
          "block";
      }

      if (!pais) {
        mostrarMensajeDireccion(
          "⚠️ Escribe el país.",
          "#ffbf47"
        );

        inputDireccionPais.focus();
        return;
      }

      if (!direccionLinea1) {
        mostrarMensajeDireccion(
          "⚠️ Escribe la dirección.",
          "#ffbf47"
        );

        inputDireccionLinea1.focus();
        return;
      }

      if (!ciudad) {
        mostrarMensajeDireccion(
          "⚠️ Escribe la ciudad.",
          "#ffbf47"
        );

        inputDireccionCiudad.focus();
        return;
      }

      if (!estadoRegion) {
        mostrarMensajeDireccion(
          "⚠️ Escribe el estado o región.",
          "#ffbf47"
        );

        inputDireccionEstadoRegion.focus();
        return;
      }

      if (!codigoPostal) {
        mostrarMensajeDireccion(
          "⚠️ Escribe el código postal.",
          "#ffbf47"
        );

        inputDireccionCodigoPostal.focus();
        return;
      }

      btnGuardarDireccion.disabled = true;

            btnGuardarDireccion.textContent =
        esEdicion
          ? "⏳ Actualizando dirección..."
          : "⏳ Guardando dirección...";

      btnGuardarDireccion.style.cursor =
        "not-allowed";

      btnGuardarDireccion.style.opacity =
        ".7";

            mostrarMensajeDireccion(
        esEdicion
          ? "Actualizando tu dirección privada..."
          : "Guardando tu dirección privada...",
        "#fff"
      );

      try {
        /*
          Si la nueva dirección será principal,
          primero desmarca cualquier dirección
          principal anterior de este usuario.
        */
        if (esPrincipal) {
          const {
            error: errorDesmarcarPrincipal
          } =
            await supabaseClient
              .from("direcciones_mass")
              .update({
                es_principal: false,
                actualizada_en:
                  new Date().toISOString()
              })
              .eq("auth_user_id", user.id)
              .eq("es_principal", true)
              .eq("activa", true);

          if (errorDesmarcarPrincipal) {
            throw errorDesmarcarPrincipal;
          }
        }

                const datosDireccion = {
          nombre_ubicacion:
            nombreUbicacion,
          pais: pais,
          direccion_linea_1:
            direccionLinea1,
          direccion_linea_2:
            direccionLinea2 || null,
          ciudad: ciudad,
          estado: estadoRegion,
          codigo_postal:
            codigoPostal,
          instrucciones_entrega:
            instrucciones || null,
          es_principal:
            esPrincipal,
          activa: true,
          actualizada_en:
            new Date().toISOString()
        };

        let errorGuardarDireccion =
          null;

        if (esEdicion) {
          const {
            error: errorActualizarDireccion
          } =
            await supabaseClient
              .from("direcciones_mass")
              .update(datosDireccion)
              .eq(
                "id",
                direccionIdActual
              )
              .eq(
                "auth_user_id",
                user.id
              );

          errorGuardarDireccion =
            errorActualizarDireccion;
        } else {
          const {
            error: errorInsertarDireccion
          } =
            await supabaseClient
              .from("direcciones_mass")
              .insert({
                auth_user_id:
                  user.id,
                ...datosDireccion
              });

          errorGuardarDireccion =
            errorInsertarDireccion;
        }

        if (errorGuardarDireccion) {
          throw errorGuardarDireccion;
        }

        if (direccionEstado) {
          direccionEstado.textContent =
            "✅ Dirección preparada para servicios MASS";

          direccionEstado.style.display =
            "block";
        }

                mostrarMensajeDireccion(
          esEdicion
            ? "✅ Dirección actualizada correctamente."
            : "✅ Dirección guardada correctamente.",
          "#39ff14"
        );

        direccionEditandoId = null;

        inputDireccionLinea1.value = "";

        if (inputDireccionLinea2) {
          inputDireccionLinea2.value = "";
        }

        inputDireccionCiudad.value = "";
        inputDireccionEstadoRegion.value = "";
        inputDireccionCodigoPostal.value = "";

        if (inputDireccionInstrucciones) {
          inputDireccionInstrucciones.value = "";
        }

        if (inputDireccionPrincipal) {
          inputDireccionPrincipal.checked =
            true;
        }

        btnAgregarDireccion.textContent =
          "📍 Agregar otra dirección";

        direccionFormulario.style.display =
          "none";

        direccionInvitacion.style.display =
          "block";

       await cargarDireccionesMass(); 

        direccionInvitacion.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } catch (error) {
        console.error(
          "ERROR GUARDANDO DIRECCIÓN MASS:",
          error
        );

        mostrarMensajeDireccion(
          "❌ No fue posible guardar la dirección. Inténtalo nuevamente.",
          "#ff5b5b"
        );
      } finally {
        btnGuardarDireccion.disabled = false;

                btnGuardarDireccion.textContent =
          direccionEditandoId
            ? "💾 Actualizar dirección"
            : "💾 Guardar dirección";

        btnGuardarDireccion.style.cursor =
          "pointer";

        btnGuardarDireccion.style.opacity =
          "1";
      }
    };
}  

/* Abrir Foto de perfil */
if (
  btnFotoPerfil &&
  menuPrincipal &&
  seccionFotoPerfil
) {
  btnFotoPerfil.onclick = function () {
    menuPrincipal.style.display = "none";

    if (seccionInformacion) {
      seccionInformacion.style.display = "none";
    }

    seccionFotoPerfil.style.display = "block";

    seccionFotoPerfil.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}

/* Regresar desde Foto de perfil al menú principal */
if (
  btnVolverFotoPerfil &&
  menuPrincipal &&
  seccionFotoPerfil
) {
  btnVolverFotoPerfil.onclick = function () {
    seccionFotoPerfil.style.display = "none";

    if (seccionInformacion) {
      seccionInformacion.style.display = "none";
    }

    menuPrincipal.style.display = "block";

    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}

/* Abrir Seguridad */
if (
  btnSeguridad &&
  menuPrincipal &&
  seccionSeguridad
) {
  btnSeguridad.onclick = async function () {
    await cerrarPanelConfiguracionMfa();
    
  if (seguridadCorreoEstado) {
  const correoConfirmado = Boolean(
    user.email_confirmed_at
  );

  seguridadCorreoEstado.textContent =
    correoConfirmado
      ? "Correo verificado ✅"
      : "Correo pendiente de verificar";

  seguridadCorreoEstado.style.color =
    correoConfirmado
      ? "#39ff14"
      : "#ffbf47";
}

if (seguridadMfaEstado) {
  seguridadMfaEstado.textContent =
    "Verificando...";

  seguridadMfaEstado.style.color =
    "#fff";

  const {
    data: nivelMfa,
    error: errorMfa
  } =
    await supabaseClient.auth.mfa
      .getAuthenticatorAssuranceLevel();

  if (errorMfa) {
    console.error(
      "ERROR CONSULTANDO MFA:",
      errorMfa
    );

    seguridadMfaEstado.textContent =
      "No disponible";

    seguridadMfaEstado.style.color =
      "#ff5b5b";
  } else {
    const nivelActual =
      nivelMfa?.currentLevel;

    const siguienteNivel =
      nivelMfa?.nextLevel;

    const mfaConfigurada =
      nivelActual === "aal2" ||
      siguienteNivel === "aal2";

   mfaConfiguradaActualmente =
  mfaConfigurada;

if (btnConfigurarMfa) {
  btnConfigurarMfa.disabled = false;

  btnConfigurarMfa.textContent =
    mfaConfigurada
      ? "🗑️ Desactivar verificación"
      : "🔐 Configurar verificación";

  btnConfigurarMfa.style.borderColor =
    mfaConfigurada
      ? "#ff5b5b"
      : "#39ff14";

  btnConfigurarMfa.style.color =
    mfaConfigurada
      ? "#ff8a8a"
      : "#fff";

  btnConfigurarMfa.style.cursor =
    "pointer";

  btnConfigurarMfa.style.opacity =
    "1";
} 

    seguridadMfaEstado.textContent =
      nivelActual === "aal2"
        ? "Configurada y activa ✅"
        : mfaConfigurada
          ? "Configurada ✅"
          : "No configurada";

    seguridadMfaEstado.style.color =
      mfaConfigurada
        ? "#39ff14"
        : "#ffbf47";
  }
}    
    menuPrincipal.style.display = "none";

    if (seccionInformacion) {
      seccionInformacion.style.display = "none";
    }

    if (seccionFotoPerfil) {
      seccionFotoPerfil.style.display = "none";
    }

    seccionSeguridad.style.display = "block";

    seccionSeguridad.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}

/* Mostrar panel y generar configuración MFA */
if (
  btnConfigurarMfa &&
  panelMfaConfiguracion
) {
  btnConfigurarMfa.onclick = async function () {

   if (mfaConfiguradaActualmente) {
  const confirmarDesactivacion =
    window.confirm(
      "¿Deseas desactivar la verificación en dos pasos?"
    );

  if (!confirmarDesactivacion) {
    return;
  }

  btnConfigurarMfa.disabled = true;
  btnConfigurarMfa.textContent =
    "⏳ Desactivando...";

  try {
    const {
      data: factores,
      error: errorFactores
    } =
      await supabaseClient.auth.mfa
        .listFactors();

    if (errorFactores) {
      throw errorFactores;
    }

    const listaFactores =
      Array.isArray(factores?.all)
        ? factores.all
        : [
            ...(
              Array.isArray(factores?.totp)
                ? factores.totp
                : []
            ),
            ...(
              Array.isArray(factores?.phone)
                ? factores.phone
                : []
            )
          ];

    const factoresTotpVerificados =
      listaFactores.filter((factor) => {
        const tipoFactor =
          factor.factor_type ||
          factor.factorType ||
          factor.type;

        return (
          tipoFactor === "totp" &&
          factor.status === "verified"
        );
      });

    if (factoresTotpVerificados.length !== 1) {
      throw new Error(
        factoresTotpVerificados.length === 0
          ? "No se encontró un factor verificado."
          : "Existe más de un factor verificado."
      );
    }

   const factorVerificado =
  factoresTotpVerificados[0];

const {
  data: nivelSesion,
  error: errorNivelSesion
} =
  await supabaseClient.auth.mfa
    .getAuthenticatorAssuranceLevel();

if (errorNivelSesion) {
  throw errorNivelSesion;
}

/*
  Para eliminar un factor verificado,
  la sesión debe estar primero en AAL2.
*/
if (nivelSesion?.currentLevel !== "aal2") {
  const codigoDesactivacion =
    window.prompt(
      "Escribe el código actual de seis dígitos de tu aplicación de autenticación."
    );

  if (codigoDesactivacion === null) {
    return;
  }

  const codigoLimpio =
    codigoDesactivacion
      .replace(/\D/g, "")
      .slice(0, 6);

  if (!/^\d{6}$/.test(codigoLimpio)) {
    throw new Error(
      "Debes escribir exactamente seis dígitos."
    );
  }

  const {
    error: errorConfirmarIdentidad
  } =
    await supabaseClient.auth.mfa
      .challengeAndVerify({
        factorId: factorVerificado.id,
        code: codigoLimpio
      });

  if (errorConfirmarIdentidad) {
    throw new Error(
      "El código de autenticación es incorrecto o venció."
    );
  }
}

const { error: errorEliminar } =
  await supabaseClient.auth.mfa
    .unenroll({
      factorId: factorVerificado.id
    });

if (errorEliminar) {
  throw errorEliminar;
} 

    await supabaseClient.auth.refreshSession();

    mfaConfiguradaActualmente = false;

    if (seguridadMfaEstado) {
      seguridadMfaEstado.textContent =
        "No configurada";

      seguridadMfaEstado.style.color =
        "#ffbf47";
    }

    btnConfigurarMfa.textContent =
      "🔐 Configurar verificación";

    btnConfigurarMfa.style.borderColor =
      "#39ff14";

    btnConfigurarMfa.style.color =
      "#fff";

    alert(
      "✅ La verificación en dos pasos fue desactivada."
    );
  } catch (error) {
    console.error(
      "ERROR DESACTIVANDO MFA:",
      error
    );

    alert(
      `❌ No fue posible desactivar la verificación: ${
        error.message || "Error desconocido"
      }`
    );
  } finally {
  btnConfigurarMfa.disabled = false;

  btnConfigurarMfa.textContent =
    mfaConfiguradaActualmente
      ? "🗑️ Desactivar verificación"
      : "🔐 Configurar verificación";

  btnConfigurarMfa.style.borderColor =
    mfaConfiguradaActualmente
      ? "#ff5b5b"
      : "#39ff14";

  btnConfigurarMfa.style.color =
    mfaConfiguradaActualmente
      ? "#ff8a8a"
      : "#fff";

  btnConfigurarMfa.style.cursor =
    "pointer";

  btnConfigurarMfa.style.opacity =
    "1";
}

  return;
}
    
    if (inputCodigoMfa) {
      inputCodigoMfa.value = "";
    }

    if (mensajeMfa) {
      mensajeMfa.textContent = "";
      mensajeMfa.style.display = "none";
    }

    panelMfaConfiguracion.style.display = "block";

    panelMfaConfiguracion.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    /*
      Si el QR ya fue generado durante esta sesión,
      solamente vuelve a mostrar el panel.
    */
    if (
      factorMfaId &&
      qrMfaImagen &&
      qrMfaImagen.getAttribute("src")
    ) {
      return;
    }

    btnConfigurarMfa.disabled = true;
    btnConfigurarMfa.textContent =
      "⏳ Generando código...";

    try {
      if (qrMfaImagen) {
        qrMfaImagen.removeAttribute("src");
        qrMfaImagen.style.display = "none";
      }

      if (qrMfaPendiente) {
        qrMfaPendiente.textContent =
          "Generando QR...";

        qrMfaPendiente.style.display =
          "inline";
      }

      if (claveMfaManual) {
        claveMfaManual.textContent =
          "Generando clave...";
      }

     factorMfaId = null;

await eliminarFactoresMfaPendientes(); 

      const {
        data: datosEnrolamiento,
        error: errorEnrolamiento
      } =
        await supabaseClient.auth.mfa.enroll({
          factorType: "totp"
        });

      if (errorEnrolamiento) {
        throw errorEnrolamiento;
      }

      const nuevoFactorId =
        datosEnrolamiento?.id;

      const codigoQr =
        datosEnrolamiento?.totp?.qr_code;

      const claveSecreta =
        datosEnrolamiento?.totp?.secret;

      if (
        !nuevoFactorId ||
        !codigoQr ||
        !claveSecreta
      ) {
        throw new Error(
          "Supabase no devolvió los datos completos de configuración."
        );
      }

      factorMfaId = nuevoFactorId;

      if (qrMfaImagen) {
        qrMfaImagen.src = codigoQr;
        qrMfaImagen.style.display = "block";
      }

      if (qrMfaPendiente) {
        qrMfaPendiente.style.display = "none";
      }

      if (claveMfaManual) {
        claveMfaManual.textContent =
          claveSecreta;
      }

      if (mensajeMfa) {
        mensajeMfa.textContent =
          "Escanea el QR y escribe el código generado por tu aplicación.";

        mensajeMfa.style.display = "block";
        mensajeMfa.style.color = "#39ff14";
      }
    } catch (error) {
      factorMfaId = null;

      console.error(
        "ERROR GENERANDO CONFIGURACIÓN MFA:",
        error
      );

      if (qrMfaImagen) {
        qrMfaImagen.removeAttribute("src");
        qrMfaImagen.style.display = "none";
      }

      if (qrMfaPendiente) {
        qrMfaPendiente.textContent =
          "QR no disponible";

        qrMfaPendiente.style.display =
          "inline";
      }

      if (claveMfaManual) {
        claveMfaManual.textContent =
          "Clave no disponible";
      }

      if (mensajeMfa) {
        mensajeMfa.textContent =
          `No fue posible generar la configuración: ${
            error.message || "Error desconocido"
          }`;

        mensajeMfa.style.display = "block";
        mensajeMfa.style.color = "#ff5b5b";
      }
    } finally {
      btnConfigurarMfa.disabled = false;
      btnConfigurarMfa.textContent =
        "🔐 Configurar verificación";
    }
  };
}

/* Confirmar y activar MFA */
if (
  btnConfirmarMfa &&
  inputCodigoMfa &&
  panelMfaConfiguracion
) {
  btnConfirmarMfa.onclick = async function () {
    const codigoMfa =
      inputCodigoMfa.value
        .replace(/\D/g, "")
        .slice(0, 6);

    inputCodigoMfa.value = codigoMfa;

    if (!factorMfaId) {
      if (mensajeMfa) {
        mensajeMfa.textContent =
          "Primero genera y escanea un código QR.";

        mensajeMfa.style.display = "block";
        mensajeMfa.style.color = "#ffbf47";
      }

      return;
    }

    if (!/^\d{6}$/.test(codigoMfa)) {
      if (mensajeMfa) {
        mensajeMfa.textContent =
          "Escribe exactamente los seis dígitos de tu aplicación.";

        mensajeMfa.style.display = "block";
        mensajeMfa.style.color = "#ffbf47";
      }

      inputCodigoMfa.focus();
      return;
    }

    btnConfirmarMfa.disabled = true;
    btnConfirmarMfa.textContent =
      "⏳ Verificando código...";

    inputCodigoMfa.disabled = true;

    if (mensajeMfa) {
      mensajeMfa.textContent =
        "Verificando el código de seguridad...";

      mensajeMfa.style.display = "block";
      mensajeMfa.style.color = "#fff";
    }

    try {
      const {
        error: errorVerificacion
      } =
        await supabaseClient.auth.mfa
          .challengeAndVerify({
            factorId: factorMfaId,
            code: codigoMfa
          });

      if (errorVerificacion) {
        throw errorVerificacion;
      }

      /*
        Evita que cerrarPanelConfiguracionMfa()
        elimine el factor que ya fue activado.
      */
      factorMfaId = null;

      if (seguridadMfaEstado) {
        seguridadMfaEstado.textContent =
          "Configurada y activa ✅";

        seguridadMfaEstado.style.color =
          "#39ff14";
      }

      if (btnConfigurarMfa) {
        btnConfigurarMfa.disabled = true;

        btnConfigurarMfa.textContent =
          "✅ Verificación configurada";

        btnConfigurarMfa.style.cursor =
          "not-allowed";

        btnConfigurarMfa.style.opacity =
          ".75";
      }

      await cerrarPanelConfiguracionMfa();

      if (seccionSeguridad) {
        seccionSeguridad.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

      alert(
        "✅ La verificación en dos pasos fue activada correctamente."
      );
    } catch (error) {
      console.error(
        "ERROR ACTIVANDO MFA:",
        error
      );

      if (mensajeMfa) {
        mensajeMfa.textContent =
          "El código es incorrecto o venció. Genera uno nuevo en tu aplicación e inténtalo otra vez.";

        mensajeMfa.style.display = "block";
        mensajeMfa.style.color = "#ff5b5b";
      }

      inputCodigoMfa.value = "";
      inputCodigoMfa.focus();
    } finally {
      btnConfirmarMfa.disabled = false;

      btnConfirmarMfa.textContent =
        "✅ Confirmar y activar";

      inputCodigoMfa.disabled = false;
    }
  };
}  

/* Cancelar configuración MFA */
if (
  btnCancelarMfa &&
  panelMfaConfiguracion
) {
  btnCancelarMfa.onclick = async function () {
  await cerrarPanelConfiguracionMfa();

    if (seccionSeguridad) {
      seccionSeguridad.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };
}  

/* Regresar desde Seguridad al menú principal */
if (
  btnVolverSeguridad &&
  menuPrincipal &&
  seccionSeguridad
) {
  btnVolverSeguridad.onclick = async function () {
  await cerrarPanelConfiguracionMfa();
    
    seccionSeguridad.style.display = "none";

    if (seccionInformacion) {
      seccionInformacion.style.display = "none";
    }

    if (seccionFotoPerfil) {
      seccionFotoPerfil.style.display = "none";
    }

    menuPrincipal.style.display = "block";

    panel.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
}  

/* Abrir selector de archivos */
if (btnSeleccionarFoto && fotoInput) {
  btnSeleccionarFoto.onclick = function () {
    fotoInput.value = "";
    fotoInput.click();
  };
}

/* Mostrar la foto seleccionada en la vista previa */
if (
  fotoInput &&
  fotoImagen &&
  fotoIcono
) {
  fotoInput.onchange = function () {
    const archivo = fotoInput.files?.[0];

    if (!archivo) {
      return;
    }

   archivoFotoSeleccionado = null;
actualizarBotonGuardarFoto(false); 

    const formatosPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!formatosPermitidos.includes(archivo.type)) {
      alert("❌ Selecciona una imagen JPG, PNG o WEBP.");
      fotoInput.value = "";
      return;
    }

    const limiteBytes = 5 * 1024 * 1024;

    if (archivo.size > limiteBytes) {
      alert("❌ La imagen no puede superar los 5 MB.");
      fotoInput.value = "";
      return;
    }

    const lector = new FileReader();

    lector.onload = function (evento) {
  fotoImagen.src = evento.target.result;
  fotoImagen.style.display = "block";
  fotoIcono.style.display = "none";

  archivoFotoSeleccionado = archivo;
  actualizarBotonGuardarFoto(true);
};

    lector.onerror = function () {
      alert("❌ No fue posible leer la imagen seleccionada.");
      fotoInput.value = "";
    
 archivoFotoSeleccionado = null;
actualizarBotonGuardarFoto(false);
    };

    lector.readAsDataURL(archivo);
  };
} 

/* Guardar la foto permanentemente */
if (
  btnGuardarFoto &&
  fotoInput &&
  fotoImagen &&
  fotoIcono
) {
  btnGuardarFoto.onclick = async function () {
    if (!archivoFotoSeleccionado) {
      alert("❌ Primero selecciona una fotografía.");
      return;
    }

  const fotoAnteriorUrl =
  perfil.foto_perfil_url || null;  

    actualizarBotonGuardarFoto(
      false,
      "⏳ Guardando foto..."
    );

    try {
      const extensiones = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp"
      };

      const extension =
        extensiones[archivoFotoSeleccionado.type];

      if (!extension) {
        throw new Error(
          "El formato de la fotografía no es válido."
        );
      }

      const nombreArchivo =
        `avatar-${Date.now()}.${extension}`;

      const rutaArchivo =
        `${user.id}/${nombreArchivo}`;

      const { error: errorSubida } =
        await supabaseClient.storage
          .from("mass-id-avatars")
          .upload(
            rutaArchivo,
            archivoFotoSeleccionado,
            {
              cacheControl: "3600",
              upsert: false,
              contentType:
                archivoFotoSeleccionado.type
            }
          );

      if (errorSubida) {
        throw errorSubida;
      }

      const { data: datosUrl } =
        supabaseClient.storage
          .from("mass-id-avatars")
          .getPublicUrl(rutaArchivo);

      const fotoPublicaUrl =
        datosUrl?.publicUrl;

      if (!fotoPublicaUrl) {
        throw new Error(
          "No se pudo obtener la URL pública."
        );
      }

      const { error: errorPerfil } =
        await supabaseClient
          .from("usuarios_mass")
          .update({
            foto_perfil_url: fotoPublicaUrl
          })
          .eq("auth_user_id", user.id);

      if (errorPerfil) {
  const { error: errorLimpieza } =
    await supabaseClient.storage
      .from("mass-id-avatars")
      .remove([rutaArchivo]);

  if (errorLimpieza) {
    console.warn(
      "NO SE PUDO LIMPIAR LA FOTO NUEVA:",
      errorLimpieza
    );
  }

  throw errorPerfil;
}

const rutaFotoAnterior =
  obtenerRutaAvatarDesdeUrl(fotoAnteriorUrl);

if (
  rutaFotoAnterior &&
  rutaFotoAnterior !== rutaArchivo
) {
  const { error: errorEliminarAnterior } =
    await supabaseClient.storage
      .from("mass-id-avatars")
      .remove([rutaFotoAnterior]);

  if (errorEliminarAnterior) {
    console.warn(
      "NO SE PUDO ELIMINAR LA FOTO ANTERIOR:",
      errorEliminarAnterior
    );
  }
}      

      perfil.foto_perfil_url =
        fotoPublicaUrl;

      fotoImagen.src =
        fotoPublicaUrl;

      fotoImagen.style.display =
        "block";

      fotoIcono.style.display =
        "none";

     if (
  fotoPrincipalImagen &&
  fotoPrincipalIcono
) {
  fotoPrincipalImagen.src =
    fotoPublicaUrl;

  fotoPrincipalImagen.style.display =
    "block";

  fotoPrincipalIcono.style.display =
    "none";
} 

      archivoFotoSeleccionado = null;
      fotoInput.value = "";

      actualizarBotonGuardarFoto(
        false,
        "✅ Foto guardada"
      );

      alert(
        "✅ Tu foto de perfil fue guardada correctamente."
      );
    } catch (error) {
      console.error(
        "ERROR GUARDANDO FOTO MASS ID:",
        error
      );

      alert(
        `❌ No fue posible guardar la foto: ${
          error.message || "Error desconocido"
        }`
      );

      actualizarBotonGuardarFoto(true);
    }
  };
}  

  panel.style.display = "block";
  panel.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function cerrarMiMassId() {
  const panel = document.getElementById("miMassIdPanel");

  if (panel) {
    panel.style.display = "none";
  }
}
