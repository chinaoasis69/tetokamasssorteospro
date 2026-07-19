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

/* Abrir Información personal */
if (
  btnInformacionPersonal &&
  menuPrincipal &&
  seccionInformacion
) {
  btnInformacionPersonal.onclick = function () {
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

/* Abrir formulario opcional de dirección */
if (
  btnAgregarDireccion &&
  direccionInvitacion &&
  direccionFormulario
) {
  btnAgregarDireccion.onclick = function () {
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
