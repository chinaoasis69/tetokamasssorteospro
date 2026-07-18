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

/* Regresar desde Seguridad al menú principal */
if (
  btnVolverSeguridad &&
  menuPrincipal &&
  seccionSeguridad
) {
  btnVolverSeguridad.onclick = function () {
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
