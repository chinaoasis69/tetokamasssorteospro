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

  const telefono =
  localStorage.getItem("mass_telefono") ||
  localStorage.getItem("mass_user");

if (telefono) {
  const { data: perfil, error } = await supabaseClient
    .from("usuarios_mass")
    .select("nombre, telefono, email")
    .eq("telefono", telefono)
    .maybeSingle();

  if (error) {
    console.error("ERROR CARGANDO PERFIL MASS ID:", error);
  }

  if (perfil) {
    const nombrePerfil = document.getElementById("massIdNombre");
    const numeroPerfil = document.getElementById("massIdNumero");

    if (nombrePerfil) {
      nombrePerfil.textContent = perfil.nombre || "Usuario MASS";
    }

    if (numeroPerfil) {
      numeroPerfil.innerHTML = `
        📱 ${perfil.telefono || telefono}<br>
        <span style="color:#bbb; font-size:15px;">
          📧 ${perfil.email || "Correo no disponible"}
        </span>
      `;
    }
  }
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
