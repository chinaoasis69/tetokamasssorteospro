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
  .select("nombre, telefono, email, mass_id, estado")
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

/* Al abrir Mi MASS ID, siempre comienza en el menú principal */
if (menuPrincipal && seccionInformacion) {
  menuPrincipal.style.display = "block";
  seccionInformacion.style.display = "none";
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
