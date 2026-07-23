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

const panelMfaCambioTelefono =
  document.getElementById(
    "massIdCambioTelefonoMfa"
  );

const inputCodigoMfaCambioTelefono =
  document.getElementById(
    "massIdCodigoMfaCambioTelefono"
  );

const mensajeMfaCambioTelefono =
  document.getElementById(
    "massIdCambioTelefonoMfaMensaje"
  );

const btnConfirmarMfaCambioTelefono =
  document.getElementById(
    "btnConfirmarMfaCambioTelefonoMassId"
  );

/* Panel SMS para verificar el nuevo teléfono */
const panelSmsCambioTelefono =
  document.getElementById(
    "massIdCambioTelefonoSms"
  );

const telefonoSmsDestino =
  document.getElementById(
    "massIdTelefonoSmsDestino"
  );

const inputCodigoSmsCambioTelefono =
  document.getElementById(
    "massIdCodigoSmsCambioTelefono"
  );

const mensajeSmsCambioTelefono =
  document.getElementById(
    "massIdCambioTelefonoSmsMensaje"
  );

const btnConfirmarSmsCambioTelefono =
  document.getElementById(
    "btnConfirmarSmsCambioTelefonoMassId"
  );

const btnReenviarSmsCambioTelefono =
  document.getElementById(
    "btnReenviarSmsCambioTelefonoMassId"
  );

let factorMfaCambioTelefonoId = null;
let nuevoTelefonoPendienteCambio = "";
let telefonoE164PendienteCambio = "";
let mfaCambioTelefonoAprobado = false;
let smsCambioTelefonoEnviado = false;
let smsCambioTelefonoConfirmado = false;
let temporizadorReenvioSmsCambioTelefono =
  null;

/* Elementos para Cambiar contraseña */
const seccionCambiarContrasena =
  document.getElementById(
    "massIdCambiarContrasena"
  );

const btnCambiarContrasena =
  document.getElementById(
    "btnMassIdCambiarContrasena"
  );

const btnVolverCambiarContrasena =
  document.getElementById(
    "btnVolverCambiarContrasenaMassId"
  );

const btnCancelarCambioContrasena =
  document.getElementById(
    "btnCancelarCambioContrasenaMassId"
  );

const btnContinuarCambioContrasena =
  document.getElementById(
    "btnContinuarCambioContrasenaMassId"
  );

const inputPasswordActualCambioContrasena =
  document.getElementById(
    "massIdPasswordActualCambioContrasena"
  );

const inputNuevaContrasena =
  document.getElementById(
    "massIdNuevaContrasena"
  );

const inputConfirmarNuevaContrasena =
  document.getElementById(
    "massIdConfirmarNuevaContrasena"
  );

const mensajeCambioContrasena =
  document.getElementById(
    "massIdCambiarContrasenaMensaje"
  );

const panelMfaCambioContrasena =
  document.getElementById(
    "massIdCambioContrasenaMfa"
  );

const inputCodigoMfaCambioContrasena =
  document.getElementById(
    "massIdCodigoMfaCambioContrasena"
  );

const mensajeMfaCambioContrasena =
  document.getElementById(
    "massIdCambioContrasenaMfaMensaje"
  );

const btnConfirmarMfaCambioContrasena =
  document.getElementById(
    "btnConfirmarMfaCambioContrasenaMassId"
  );

let factorMfaCambioContrasenaId = null;
let nuevaContrasenaPendienteCambio = "";
let mfaCambioContrasenaAprobado = false;

/* Elementos del panel Privacidad */
const seccionPrivacidad =
  document.getElementById(
    "massIdPrivacidad"
  );

const btnPrivacidad =
  document.getElementById(
    "btnMassIdPrivacidad"
  );

const btnVolverPrivacidad =
  document.getElementById(
    "btnVolverPrivacidadMassId"
  );

const btnGuardarPrivacidad =
  document.getElementById(
    "btnGuardarPrivacidadMassId"
  );

const btnCancelarPrivacidad =
  document.getElementById(
    "btnCancelarPrivacidadMassId"
  );

const inputPrivacidadPerfilPublico =
  document.getElementById(
    "massIdPrivacidadPerfilPublico"
  );

const inputPrivacidadMostrarTelefono =
  document.getElementById(
    "massIdPrivacidadMostrarTelefono"
  );

const inputPrivacidadMostrarCorreo =
  document.getElementById(
    "massIdPrivacidadMostrarCorreo"
  );

const inputPrivacidadPromociones =
  document.getElementById(
    "massIdPrivacidadPromociones"
  );

const inputPrivacidadPersonalizacion =
  document.getElementById(
    "massIdPrivacidadPersonalizacion"
  );

const mensajePrivacidad =
  document.getElementById(
    "massIdPrivacidadMensaje"
  );

/*
  Conserva las preferencias cargadas para
  poder restaurarlas al presionar Cancelar.
*/
let preferenciasPrivacidadOriginales = {
  perfil_publico: false,
  mostrar_telefono: false,
  mostrar_correo: false,
  promociones: false,
  personalizacion: false
};

let privacidadMassCargada = false;

/* Elementos del panel Documentos legales */
const seccionDocumentosLegales =
  document.getElementById(
    "massIdDocumentosLegales"
  );

const btnDocumentosLegales =
  document.getElementById(
    "btnMassIdDocumentosLegales"
  );

const btnVolverDocumentosLegales =
  document.getElementById(
    "btnVolverDocumentosLegalesMassId"
  );

const listaDocumentosLegales =
  document.getElementById(
    "massIdListaDocumentosLegales"
  );

const mensajeDocumentosLegales =
  document.getElementById(
    "massIdDocumentosLegalesMensaje"
  );

 /* Elementos del visor individual de documentos legales */
const detalleDocumentoLegal =
  document.getElementById(
    "massIdDocumentoLegalDetalle"
  );

const btnVolverListaDocumentosLegales =
  document.getElementById(
    "btnVolverListaDocumentosLegalesMassId"
  );

const estadoDocumentoLegal =
  document.getElementById(
    "massIdDocumentoLegalEstado"
  );

const codigoDocumentoLegal =
  document.getElementById(
    "massIdDocumentoLegalCodigo"
  );

const tituloDocumentoLegal =
  document.getElementById(
    "massIdDocumentoLegalTitulo"
  );

const versionDocumentoLegal =
  document.getElementById(
    "massIdDocumentoLegalVersion"
  );

const vigenciaDocumentoLegal =
  document.getElementById(
    "massIdDocumentoLegalVigencia"
  );

const contenidoDocumentoLegal =
  document.getElementById(
    "massIdDocumentoLegalContenido"
  ); 

/* Catálogo oficial del MASS ID Legal Center */
const catalogoDocumentosLegalesMassId =
  Object.freeze([
    {
  codigo: "MASS-LC-000",
  titulo: "Gobernanza del Centro Legal",
  descripcion:
    "Establece la estructura, autoridad, control de versiones y administración del MASS ID Legal Center.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-000
GOBERNANZA DEL MASS ID LEGAL CENTER

Versión: 1.0
Estado: En revisión
Administrado por: TE-TO-KA SOLUTIONS® LLC

1. PROPÓSITO

El presente documento establece la estructura oficial de gobierno, administración, publicación, actualización, conservación e interpretación del MASS ID Legal Center.

El MASS ID Legal Center constituye la base organizada de políticas, acuerdos, avisos, normas y documentos legales aplicables a MASS ID y a los productos, plataformas, módulos, aplicaciones, sitios web y servicios que formen parte del ecosistema MASS.

2. AUTORIDAD ADMINISTRATIVA

TE-TO-KA SOLUTIONS® LLC administra el MASS ID Legal Center y conserva la autoridad para:

a. Crear documentos legales nuevos.
b. Modificar documentos existentes.
c. Publicar nuevas versiones.
d. Retirar o sustituir documentos obsoletos.
e. Determinar fechas de vigencia.
f. Establecer reglas aplicables a productos o servicios específicos.
g. Mantener registros históricos de versiones anteriores.

Ningún usuario, organizador, proveedor, contratista, afiliado o tercero podrá modificar oficialmente estos documentos sin autorización expresa de TE-TO-KA SOLUTIONS® LLC.

3. ALCANCE

Esta gobernanza podrá aplicarse, según corresponda, a:

MASS ID.
TE-TO-KA MASS.
MASS Sorteos Pro.
MASS Ruta.
MASS VPN.
MASS Cash.
MASS Learn.
MASS TV.
MASS Face ID.
MASS Points.
MASS Wallet.
MASS Real Estate.
Los demás productos o servicios presentes y futuros integrados al ecosistema MASS.

Cada servicio podrá contar con términos adicionales. Cuando existan condiciones especiales para un producto, dichas condiciones complementarán los documentos generales del MASS ID Legal Center.

4. IDENTIFICACIÓN OFICIAL

Cada documento deberá contar con:

a. Un código oficial MASS-LC.
b. Un título identificable.
c. Un número de versión.
d. Un estado de publicación.
e. Una fecha de vigencia, cuando corresponda.
f. Una descripción de su finalidad.
g. Un historial de modificaciones cuando sea necesario.

La numeración MASS-LC será utilizada para mantener un catálogo ordenado, permanente y reutilizable.

5. ESTADOS DE LOS DOCUMENTOS

Los documentos podrán mostrar alguno de los siguientes estados:

En preparación: documento todavía no publicado para aplicación definitiva.

En revisión: documento sujeto a revisión administrativa, técnica o legal.

Vigente: documento oficialmente publicado y aplicable.

Actualizado: existe una nueva versión vigente del documento.

Sustituido: el documento fue reemplazado por otra versión.

Retirado: el documento dejó de utilizarse sin ser sustituido directamente.

Archivado: documento conservado únicamente para historial y evidencia.

6. CONTROL DE VERSIONES

Las versiones se identificarán mediante números, por ejemplo:

Versión 1.0: primera publicación oficial.

Versión 1.1: ajuste menor que no modifica sustancialmente las obligaciones principales.

Versión 2.0: modificación importante que puede cambiar derechos, obligaciones, procesos o condiciones de uso.

TE-TO-KA SOLUTIONS® LLC determinará cuándo un cambio requiere una versión nueva y si debe notificarse directamente a los usuarios.

7. PUBLICACIÓN Y VIGENCIA

Un documento se considerará oficialmente publicado cuando:

a. Aparezca identificado como vigente dentro del MASS ID Legal Center.
b. Incluya una versión oficial.
c. Incluya una fecha de vigencia o indique que entra en vigor al publicarse.
d. Sea accesible mediante los canales oficiales del ecosistema MASS.

Los documentos en preparación no deberán interpretarse como versiones jurídicas definitivas.

8. ACTUALIZACIONES Y NOTIFICACIONES

TE-TO-KA SOLUTIONS® LLC podrá actualizar los documentos para responder a:

a. Nuevos productos o servicios.
b. Cambios tecnológicos.
c. Nuevas funciones de seguridad.
d. Cambios operativos.
e. Requisitos regulatorios.
f. Prevención de fraude o abuso.
g. Protección de usuarios y del ecosistema MASS.
h. Cambios en métodos de pago o proveedores externos.

Cuando una modificación sea material, podrá solicitarse al usuario revisar o aceptar la nueva versión antes de continuar utilizando determinados servicios.

9. JERARQUÍA DOCUMENTAL

Salvo que un documento específico establezca lo contrario, se seguirá esta jerarquía:

Primero: términos especiales del producto o servicio utilizado.

Segundo: Acuerdo de usuario MASS ID.

Tercero: políticas específicas aplicables, como privacidad, seguridad, pagos, reembolsos o inteligencia artificial.

Cuarto: Normas de la comunidad.

Quinto: esta Gobernanza del MASS ID Legal Center.

Cuando exista una aparente contradicción, prevalecerá la disposición más específica aplicable al servicio o actividad correspondiente.

10. ACEPTACIÓN ELECTRÓNICA

La aceptación de documentos legales podrá registrarse mediante:

a. Casillas de aceptación.
b. Botones de confirmación.
c. Firmas electrónicas.
d. Registros de fecha y hora.
e. Identificación mediante auth_user_id.
f. Número MASS ID.
g. Dirección IP o información técnica permitida.
h. Registros internos de versión aceptada.

Estos registros podrán utilizarse para comprobar qué documento y versión fueron presentados o aceptados.

11. CONSERVACIÓN DE REGISTROS

TE-TO-KA SOLUTIONS® LLC podrá conservar:

a. Versiones publicadas.
b. Fechas de publicación.
c. Fechas de vigencia.
d. Historial de cambios.
e. Evidencia de aceptación.
f. Registros de sustitución o retiro.
g. Documentos archivados.

La conservación se realizará conforme a las necesidades legales, administrativas, operativas y de seguridad del ecosistema MASS.

12. IDIOMAS

Los documentos podrán publicarse en español, inglés u otros idiomas.

Cuando existan varias traducciones, la versión identificada expresamente como oficial o predominante será utilizada para resolver diferencias de interpretación, siempre respetando las leyes aplicables.

13. ACCESIBILIDAD

El MASS ID Legal Center procurará que los documentos puedan consultarse desde dispositivos móviles, computadoras y otros medios compatibles.

La falta temporal de acceso por mantenimiento, conexión, incidentes técnicos o causas externas no invalidará automáticamente una versión previamente publicada.

14. INTERPRETACIÓN

Los encabezados se incluyen para facilitar la lectura y no limitan el significado de las disposiciones.

Las palabras en singular podrán incluir el plural y viceversa cuando el contexto lo requiera.

Si una disposición fuera declarada inválida o inaplicable, las demás disposiciones continuarán vigentes en la mayor medida permitida.

15. AUSENCIA DE RENUNCIA

La falta de aplicación inmediata de una disposición no significará que TE-TO-KA SOLUTIONS® LLC renuncia a ejercer posteriormente sus derechos.

16. ADMINISTRACIÓN CONTINUA

El MASS ID Legal Center será administrado como una estructura legal evolutiva, diseñada para acompañar el crecimiento del ecosistema MASS durante sus distintas fases, servicios, territorios y modelos de operación.

FIN DEL DOCUMENTO MASS-LC-000
`
},
    {
  codigo: "MASS-LC-001",
  titulo: "Definiciones legales",
  descripcion:
    "Define los términos oficiales utilizados dentro de MASS ID y del ecosistema MASS.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-001
DEFINICIONES LEGALES DEL MASS ID LEGAL CENTER

Versión: 1.0
Estado: En revisión
Administrado por: TE-TO-KA SOLUTIONS® LLC

1. PROPÓSITO

El presente documento establece las definiciones oficiales utilizadas dentro del MASS ID Legal Center y en los productos, plataformas, aplicaciones, módulos, sitios web y servicios que formen parte del ecosistema MASS.

Estas definiciones tienen como propósito facilitar una interpretación uniforme de los documentos legales administrados por TE-TO-KA SOLUTIONS® LLC.

2. ALCANCE

Las definiciones contenidas en este documento se aplicarán, según corresponda, a:

a. MASS ID.
b. TE-TO-KA MASS.
c. MASS Sorteos Pro.
d. MASS Ruta.
e. MASS Cash.
f. MASS VPN.
g. MASS Learn.
h. MASS TV.
i. Los demás productos, módulos, plataformas y servicios presentes o futuros del ecosistema MASS.

Cuando un documento o servicio específico incluya una definición diferente, la definición específica prevalecerá únicamente para ese documento o servicio.

3. REGLAS DE INTERPRETACIÓN

Los términos en singular podrán incluir el plural y viceversa cuando el contexto lo requiera.

Las palabras que indiquen un género incluirán los demás géneros cuando resulte aplicable.

Los encabezados se utilizan para facilitar la lectura y no limitarán el alcance de las disposiciones.

Las palabras “incluye”, “incluyendo” o expresiones similares se interpretarán de manera enunciativa y no limitativa.

Las referencias a leyes, normas o reglamentos incluirán sus modificaciones, sustituciones y disposiciones relacionadas, según resulten aplicables.

4. DEFINICIONES OFICIALES

4.1. CUENTA

Registro digital creado para que una persona pueda acceder y utilizar MASS ID o cualquier servicio autorizado del ecosistema MASS.

4.2. CUENTA VERIFICADA

Cuenta que ha completado uno o más procedimientos de verificación establecidos por MASS, como confirmación de correo, teléfono, contraseña, código de seguridad o autenticación en dos pasos.

La verificación reduce riesgos, pero no constituye una garantía absoluta sobre la identidad, conducta, solvencia o confiabilidad de una persona.

4.3. CREDENCIALES DE ACCESO

Información o mecanismos utilizados para acceder a una cuenta, incluyendo correo electrónico, número telefónico, contraseña, PIN, códigos temporales, llaves digitales, enlaces de acceso y factores de autenticación.

4.4. MASS ID

Identidad digital asignada a un usuario dentro del ecosistema MASS para administrar su cuenta, perfil, acceso, preferencias, historial, verificaciones y servicios relacionados.

MASS ID no es una identificación emitida por un gobierno y no sustituye una licencia, pasaporte, tarjeta oficial ni otro documento legal de identidad.

4.5. NÚMERO MASS ID

Identificador único asignado por el sistema a una cuenta MASS ID para distinguirla de otras cuentas.

El número MASS ID no constituye por sí solo prueba absoluta de identidad personal.

4.6. ECOSISTEMA MASS

Conjunto de productos, plataformas, módulos, aplicaciones, sitios web, tecnologías, servicios y operaciones administrados, autorizados o integrados por TE-TO-KA SOLUTIONS® LLC bajo las marcas o sistemas MASS.

4.7. EMPRESA

TE-TO-KA SOLUTIONS® LLC, sus representantes autorizados y, cuando corresponda, las entidades afiliadas que administren servicios dentro del ecosistema MASS.

4.8. USUARIO

Persona física o jurídica que registra, accede, visita, utiliza, administra, contrata o interactúa con MASS ID o con algún servicio del ecosistema MASS.

4.9. USUARIO AUTORIZADO

Usuario que cuenta con permiso válido para acceder a una cuenta, función, perfil, panel, información o servicio determinado.

4.10. USUARIO COMERCIAL

Persona o entidad que utiliza MASS con fines empresariales, profesionales, organizacionales o comerciales, incluyendo organizadores, proveedores, operadores, anunciantes y prestadores de servicios.

4.11. ORGANIZADOR

Persona o entidad autorizada para crear, administrar u operar actividades, promociones, dinámicas, sorteos promocionales, publicaciones o servicios dentro de una plataforma MASS.

4.12. OPERADOR

Persona o entidad independiente autorizada para ofrecer, coordinar o realizar servicios mediante una plataforma del ecosistema MASS.

4.13. PROVEEDOR DE SERVICIOS

Persona o entidad que proporciona servicios tecnológicos, financieros, administrativos, logísticos, de comunicación, seguridad, almacenamiento, autenticación u otros servicios en apoyo del ecosistema MASS.

4.14. SERVICIO

Cualquier función, producto, módulo, plataforma, aplicación, contenido, beneficio o capacidad ofrecida dentro del ecosistema MASS.

4.15. PLATAFORMA

Sitio web, aplicación, sistema, interfaz, panel, infraestructura tecnológica o medio digital utilizado para proporcionar uno o más servicios MASS.

4.16. PERFIL

Conjunto de datos, configuraciones, fotografías, identificadores, preferencias y otra información asociada con una cuenta.

4.17. PERFIL PÚBLICO

Parte de un perfil que el usuario autoriza para que sea visible dentro de funciones o servicios determinados.

La existencia de un perfil público no autoriza la divulgación ilimitada de información privada.

4.18. DATOS PERSONALES

Información vinculada o razonablemente vinculable con una persona identificada o identificable.

Los datos personales pueden incluir nombre, correo, teléfono, dirección, identificadores, información de cuenta, ubicación, actividad, historial y demás información asociada con una persona.

4.19. DATOS SENSIBLES

Datos personales que, por su naturaleza, requieren protección reforzada, incluyendo información financiera, credenciales, identificaciones oficiales, ubicación precisa, información médica, genética, biométrica, datos de menores y otras categorías protegidas por la legislación aplicable.

4.20. IDENTIFICADOR BIOMÉTRICO

Característica física o biológica utilizada o potencialmente utilizada para reconocer o verificar a una persona, incluyendo huellas digitales, impresión de voz, geometría facial o de la mano y escaneo de retina o iris.

4.21. DATOS BIOMÉTRICOS

Información derivada de un identificador biométrico mediante procesamiento tecnológico y utilizada para fines de reconocimiento, autenticación o verificación.

4.22. AUTENTICACIÓN

Proceso utilizado para comprobar que una persona o dispositivo está autorizado para acceder a una cuenta, función o servicio.

4.23. AUTENTICACIÓN EN DOS PASOS O MFA

Medida de seguridad que requiere dos o más factores para verificar el acceso o confirmar una operación, como una contraseña y un código temporal generado por una aplicación de autenticación.

4.24. SESIÓN

Periodo durante el cual una cuenta permanece autenticada en un dispositivo, navegador, aplicación o servicio.

4.25. DISPOSITIVO

Computadora, teléfono, tableta, televisión, navegador, equipo conectado u otro medio tecnológico utilizado para acceder a MASS.

4.26. CONSENTIMIENTO

Manifestación libre, informada y verificable mediante la cual una persona autoriza una acción, tratamiento de datos o condición determinada.

El consentimiento podrá retirarse cuando la legislación y la naturaleza del servicio lo permitan.

4.27. TRATAMIENTO DE DATOS

Cualquier operación realizada sobre datos, incluyendo recopilación, registro, organización, almacenamiento, consulta, utilización, transmisión, protección, modificación, análisis, restricción o eliminación.

4.28. RESPONSABLE DEL TRATAMIENTO

Persona o entidad que determina los propósitos y medios principales del tratamiento de datos personales, conforme a la legislación aplicable.

4.29. ENCARGADO DEL TRATAMIENTO

Persona o entidad que procesa datos personales por cuenta o bajo instrucciones de un responsable del tratamiento.

4.30. TERCERO

Persona o entidad distinta del usuario, la Empresa y los proveedores que procesen información directamente para proporcionar los servicios MASS.

4.31. DATOS DESIDENTIFICADOS

Información modificada mediante medidas razonables para que no pueda vincularse con una persona identificada o identificable sin utilizar información adicional.

4.32. DATOS AGREGADOS

Información combinada de múltiples usuarios, operaciones o fuentes que se presenta de manera estadística o colectiva y que no pretende identificar directamente a una persona.

4.33. CONTENIDO

Texto, imagen, fotografía, video, audio, archivo, documento, diseño, código, anuncio, mensaje, publicación, comentario, dato u otro material disponible dentro de MASS.

4.34. CONTENIDO DEL USUARIO

Contenido que un usuario carga, publica, transmite, registra, comparte o proporciona mediante un servicio MASS.

4.35. CONTENIDO PROHIBIDO

Contenido ilegal, fraudulento, abusivo, engañoso, peligroso, infractor, discriminatorio, violento, sexualmente explotador, malicioso o contrario a las normas aplicables del ecosistema MASS.

4.36. PROPIEDAD INTELECTUAL

Derechos relacionados con marcas, nombres comerciales, derechos de autor, patentes, secretos comerciales, diseños, software, bases de datos, contenido y demás activos protegidos por la legislación aplicable.

4.37. REGISTRO ELECTRÓNICO

Contrato, aviso, consentimiento, archivo, comunicación u otro registro creado, generado, enviado, recibido, comunicado o almacenado por medios electrónicos.

4.38. FIRMA ELECTRÓNICA

Sonido, símbolo, acción o proceso electrónico asociado con un registro y adoptado por una persona con la intención de firmar, aceptar o autorizar dicho registro.

4.39. COMUNICACIÓN ELECTRÓNICA

Mensaje enviado mediante correo electrónico, SMS, notificación, aplicación, panel, sitio web u otro medio tecnológico.

4.40. TRANSACCIÓN

Acción realizada mediante MASS que pueda involucrar una compra, pago, reserva, recarga, transferencia, contratación, solicitud, canje, beneficio, servicio o intercambio autorizado.

4.41. PROCESADOR DE PAGOS

Entidad independiente que facilita, autoriza, procesa o administra pagos, tarjetas, cuentas financieras u otros métodos de pago utilizados en relación con MASS.

4.42. MASS CASH O SALDO MASS

Función interna que permite registrar saldos, créditos o movimientos autorizados dentro de servicios específicos del ecosistema MASS.

Salvo indicación legal y expresa en contrario, no constituye una cuenta bancaria, depósito asegurado, moneda de curso legal ni instrumento financiero independiente.

4.43. CRÉDITO, PUNTO, BENEFICIO O TOKEN INTERNO

Unidad digital utilizada para funciones, recompensas, promociones, acceso o beneficios dentro de un servicio MASS.

No tendrá valor monetario, transferibilidad ni posibilidad de redención fuera del servicio, salvo que MASS lo establezca expresamente.

4.44. PAGO

Transferencia autorizada de dinero u otro valor aceptado a cambio de un producto, servicio, acceso, membresía, recarga o beneficio.

4.45. REEMBOLSO

Devolución total o parcial de un pago cuando se cumplan las condiciones de la política aplicable.

4.46. CONTRACARGO

Reversión o disputa de una transacción iniciada mediante una institución financiera, red de pagos o procesador de pagos.

4.47. FRAUDE

Acción u omisión intencional dirigida a obtener un beneficio indebido, engañar, suplantar una identidad, manipular un sistema, evitar obligaciones o causar una pérdida.

4.48. ACTIVIDAD SOSPECHOSA

Conducta, acceso, transacción o patrón que razonablemente pueda indicar fraude, abuso, riesgo de seguridad, incumplimiento o uso no autorizado.

4.49. INTELIGENCIA ARTIFICIAL

Sistema tecnológico capaz de generar, analizar, clasificar, recomendar, predecir, automatizar o apoyar decisiones utilizando modelos computacionales.

4.50. SISTEMA AUTOMATIZADO

Programa, algoritmo, agente electrónico o proceso tecnológico que ejecuta acciones o genera resultados con intervención humana limitada o sin revisión humana inmediata.

4.51. DECISIÓN AUTOMATIZADA

Resultado producido principalmente mediante procesamiento automatizado que pueda influir en el acceso, seguridad, personalización, evaluación o funcionamiento de un servicio.

4.52. COOKIE

Archivo o tecnología utilizada para almacenar o recuperar información relacionada con un navegador, dispositivo, sesión o interacción digital.

4.53. ALMACENAMIENTO LOCAL

Capacidad de un navegador o dispositivo para conservar datos, configuraciones, identificadores o preferencias dentro del propio equipo.

4.54. INCIDENTE DE SEGURIDAD

Evento confirmado o razonablemente sospechoso que comprometa o pueda comprometer la confidencialidad, integridad, disponibilidad o seguridad de cuentas, sistemas o información.

4.55. SUSPENSIÓN

Restricción temporal de una cuenta, función o servicio mientras se investiga, corrige o administra una situación.

4.56. TERMINACIÓN

Cierre definitivo de una cuenta, relación, autorización, acceso o servicio, sujeto a las obligaciones legales y contractuales aplicables.

4.57. MENOR

Persona que no ha alcanzado la edad legal aplicable para consentir o contratar por sí misma en la jurisdicción correspondiente.

4.58. LEGISLACIÓN APLICABLE

Leyes, reglamentos, órdenes, normas y requisitos jurídicos que resulten aplicables a una persona, servicio, operación o territorio determinado.

4.59. AVISO

Comunicación oficial relacionada con una cuenta, política, cambio, solicitud, seguridad, pago, servicio o derecho.

4.60. FECHA DE VIGENCIA

Fecha a partir de la cual un documento o versión comienza a aplicarse oficialmente.

4.61. VERSIÓN

Identificador utilizado para distinguir una edición específica de un documento, política, acuerdo o norma.

4.62. ACTUALIZACIÓN

Modificación, corrección, ampliación, sustitución o reorganización de un documento, sistema o servicio.

4.63. FUERZA MAYOR

Acontecimiento fuera del control razonable de una parte que impida, retrase o afecte el cumplimiento de una obligación, sujeto a la legislación aplicable.

5. NATURALEZA CONTRACTUAL DE LAS DEFINICIONES

Las definiciones de este documento se establecen para la interpretación interna y contractual del MASS ID Legal Center.

Una definición interna no sustituirá ni limitará una definición obligatoria establecida por la legislación aplicable.

6. CONFLICTOS ENTRE DEFINICIONES

En caso de conflicto:

a. La legislación aplicable tendrá prioridad.
b. La definición específica de un servicio tendrá prioridad sobre una definición general.
c. La versión más reciente publicada tendrá prioridad sobre versiones anteriores.
d. Las disposiciones particulares tendrán prioridad sobre las disposiciones generales respecto del mismo asunto.

7. ACTUALIZACIONES

TE-TO-KA SOLUTIONS® LLC podrá ampliar, aclarar, modificar o reorganizar estas definiciones para adaptarlas a nuevos productos, tecnologías, requisitos legales, territorios y modelos de operación.

Cada actualización deberá conservar identificación, versión y fecha de vigencia.

8. DIVISIBILIDAD

Si una definición fuera declarada inválida o inaplicable, las demás definiciones continuarán vigentes en la mayor medida permitida.

9. ADMINISTRACIÓN CONTINUA

MASS-LC-001 será administrado como un documento evolutivo del MASS ID Legal Center y servirá como referencia para los demás documentos legales del ecosistema MASS.

FIN DEL DOCUMENTO MASS-LC-001
`
},
    {
  codigo: "MASS-LC-002",
  titulo: "Acuerdo de usuario MASS ID",
  descripcion:
    "Contiene los términos y condiciones aplicables al registro, acceso y uso de MASS ID.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-002
ACUERDO DE USUARIO MASS ID

Versión: 1.0
Estado: En revisión
Administrado por: TE-TO-KA SOLUTIONS® LLC

AVISO IMPORTANTE

Este Acuerdo constituye un contrato legal entre la persona que utiliza MASS ID y TE-TO-KA SOLUTIONS® LLC.

Antes de registrarte, acceder o utilizar MASS ID, debes leer este documento completo junto con el Aviso de privacidad y las demás políticas aplicables.

1. OBJETO DEL ACUERDO

El presente Acuerdo establece las condiciones generales aplicables al registro, acceso y uso de MASS ID.

MASS ID funciona como una identidad digital y cuenta central para permitir el acceso a productos, plataformas, aplicaciones, módulos, sitios web y servicios autorizados del ecosistema MASS.

Este Acuerdo podrá complementarse mediante políticas, avisos y condiciones específicas para cada servicio.

2. ACEPTACIÓN DEL ACUERDO

Aceptas este Acuerdo cuando realizas cualquiera de las siguientes acciones:

a. Creas una cuenta MASS ID.
b. Presionas un botón que indique aceptar, continuar, registrarse, confirmar o una expresión equivalente.
c. Utilizas una firma electrónica, código, PIN o mecanismo de confirmación.
d. Accedes o continúas utilizando MASS ID después de que este Acuerdo esté disponible.
e. Utilizas cualquier servicio que requiera una cuenta MASS ID.

Si no estás de acuerdo con estas condiciones, no debes crear una cuenta ni utilizar MASS ID.

3. CONSENTIMIENTO ELECTRÓNICO

Aceptas que los contratos, autorizaciones, avisos, comprobantes, consentimientos y demás registros relacionados con MASS ID puedan proporcionarse y conservarse electrónicamente.

Las acciones realizadas mediante tu cuenta, contraseña, PIN, código de seguridad, enlace de acceso, autenticación multifactor u otro mecanismo autorizado podrán utilizarse para atribuir una aceptación o instrucción a tu cuenta, sujeto a la legislación aplicable.

Podrás conservar una copia electrónica o impresa de este Acuerdo.

4. DEFINICIONES

Los términos utilizados en este Acuerdo tendrán el significado establecido en MASS-LC-001, Definiciones legales, salvo que este documento establezca expresamente una definición diferente.

5. ELEGIBILIDAD

Para crear y administrar una cuenta por cuenta propia debes:

a. Tener al menos dieciocho años de edad o la mayoría de edad legal aplicable.
b. Tener capacidad jurídica para celebrar este Acuerdo.
c. Proporcionar información veraz y actualizada.
d. No tener prohibido legalmente utilizar el servicio.
e. Cumplir las condiciones particulares de cada producto MASS.

Una empresa, organización o entidad solamente podrá registrar una cuenta mediante una persona con autoridad suficiente para representarla.

6. MENORES DE EDAD

MASS ID de uso general no está dirigido a menores de trece años.

Una persona menor de edad solamente podrá utilizar funciones específicamente autorizadas para menores cuando exista un proceso válido de consentimiento, autorización o supervisión de su padre, madre o tutor legal.

Los servicios dirigidos a menores podrán tener condiciones, controles y avisos de privacidad adicionales.

Si MASS determina que una cuenta fue creada por un menor sin la autorización legal requerida, podrá restringirla, suspenderla o eliminarla conforme a la legislación aplicable.

7. REGISTRO DE LA CUENTA

Para crear una cuenta podrás tener que proporcionar información como:

a. Nombre.
b. Correo electrónico.
c. Número telefónico.
d. Contraseña o PIN.
e. Fecha de nacimiento o confirmación de edad.
f. Dirección.
g. Fotografía de perfil.
h. Información necesaria para verificaciones o servicios específicos.

Debes proporcionar información completa, correcta y actualizada.

No puedes crear una cuenta utilizando la identidad de otra persona sin autorización legal.

8. NATURALEZA DE MASS ID

MASS ID es una identidad digital privada del ecosistema MASS.

MASS ID no es:

a. Una identificación gubernamental.
b. Una licencia profesional.
c. Un pasaporte.
d. Una cuenta bancaria.
e. Una garantía de solvencia.
f. Una garantía absoluta de identidad.
g. Una certificación de buena conducta.
h. Una autorización para realizar actividades reguladas.

Cada usuario conserva la responsabilidad de presentar licencias, permisos, seguros, identificaciones o documentos oficiales cuando sean requeridos.

9. NÚMERO MASS ID

La Empresa podrá asignar a cada cuenta un número MASS ID único.

El número MASS ID podrá utilizarse para identificar la cuenta dentro de servicios autorizados.

No debes vender, transferir, alterar, duplicar ni permitir el uso no autorizado de tu número MASS ID.

La asignación de un número MASS ID no transfiere al usuario propiedad sobre el sistema, formato, marca o tecnología relacionada.

10. CREDENCIALES Y SEGURIDAD

Eres responsable de proteger:

a. Tu contraseña.
b. Tu PIN.
c. Tus códigos de seguridad.
d. Tu aplicación de autenticación.
e. Tus dispositivos.
f. Tus enlaces de acceso.
g. Tus métodos de recuperación.
h. Las sesiones abiertas en tu cuenta.

No debes compartir tus credenciales con personas no autorizadas.

Debes notificarnos sin demora cuando sospeches pérdida, robo, acceso no autorizado, suplantación o compromiso de seguridad.

11. AUTENTICACIÓN MULTIFACTOR

La Empresa podrá exigir autenticación multifactor para:

a. Iniciar sesión.
b. Cambiar información personal.
c. Cambiar correo o teléfono.
d. Cambiar contraseña.
e. Aprobar pagos o movimientos.
f. Recuperar una cuenta.
g. Acceder a funciones administrativas.
h. Confirmar operaciones sensibles.

La autenticación multifactor reduce riesgos, pero no garantiza que una cuenta nunca será comprometida.

12. VERIFICACIÓN DE CUENTA

MASS podrá verificar información mediante uno o más de los siguientes mecanismos:

a. Confirmación de correo.
b. Confirmación telefónica.
c. SMS.
d. Aplicación de autenticación.
e. Documentos oficiales.
f. Fotografía.
g. Reconocimiento o comparación autorizada.
h. Preguntas o información adicional.
i. Proveedores externos de verificación.

La verificación no constituye una garantía absoluta sobre la identidad, antecedentes, solvencia, capacidad o conducta futura de una persona.

13. ACTUALIZACIÓN DE INFORMACIÓN

Debes mantener actualizados tu nombre, teléfono, correo, dirección y demás datos necesarios.

MASS podrá solicitar una nueva verificación cuando:

a. Cambies información importante.
b. Se detecte actividad inusual.
c. Exista una disputa sobre la cuenta.
d. Sea necesario cumplir una obligación legal.
e. Cambien los requisitos de un servicio.

14. LICENCIA LIMITADA DE USO

Mientras cumplas este Acuerdo, TE-TO-KA SOLUTIONS® LLC te concede una licencia personal, limitada, revocable, no exclusiva, no transferible y no sublicenciable para utilizar MASS ID conforme a sus funciones autorizadas.

Esta licencia no permite:

a. Copiar el sistema.
b. Revender el acceso.
c. Crear servicios derivados no autorizados.
d. Extraer bases de datos.
e. Eludir medidas de seguridad.
f. Utilizar marcas o propiedad intelectual sin permiso.

15. USOS PERMITIDOS

Puedes utilizar MASS ID para:

a. Administrar tu perfil.
b. Acceder a servicios autorizados.
c. Gestionar preferencias de privacidad.
d. Consultar actividad de la cuenta.
e. Administrar direcciones.
f. Confirmar operaciones.
g. Recibir comunicaciones.
h. Utilizar funciones comerciales o personales permitidas.
i. Interactuar con otros usuarios dentro de las funciones autorizadas.

16. CONDUCTAS PROHIBIDAS

No puedes utilizar MASS ID para:

a. Violar leyes o derechos de terceros.
b. Suplantar una identidad.
c. Crear cuentas falsas o duplicadas con intención engañosa.
d. Proporcionar información materialmente falsa.
e. Acceder a cuentas ajenas.
f. Compartir credenciales para evadir restricciones.
g. Manipular pagos, saldos, promociones, boletos, beneficios o resultados.
h. Realizar fraude, lavado de dinero o actividad sospechosa.
i. Introducir malware, código dañino o herramientas de ataque.
j. Interferir con servidores, redes o sistemas.
k. Realizar extracción automatizada no autorizada.
l. Descompilar, modificar o aplicar ingeniería inversa al sistema.
m. Hostigar, amenazar, discriminar o perjudicar a otras personas.
n. Publicar contenido ilegal o prohibido.
o. Evadir suspensiones, verificaciones o límites.
p. Utilizar MASS para una actividad que requiera licencia sin contar con ella.
q. Utilizar información obtenida mediante MASS para vigilancia, acoso o explotación.
r. Comercializar datos personales sin autorización legal.

17. CUENTAS COMERCIALES Y ADMINISTRATIVAS

Los organizadores, operadores, proveedores, comercios y administradores podrán estar sujetos a verificaciones y obligaciones adicionales.

Una cuenta con funciones administrativas deberá utilizarse únicamente por personas autorizadas.

El titular de una cuenta comercial será responsable de:

a. Sus representantes.
b. Sus empleados y colaboradores.
c. La legalidad de sus actividades.
d. Sus licencias, permisos y seguros.
e. La información publicada.
f. Las obligaciones frente a sus clientes.
g. Los impuestos y registros que le correspondan.

18. CONTENIDO DEL USUARIO

Conservas los derechos que legítimamente poseas sobre el contenido que proporciones.

Al cargar contenido, otorgas a la Empresa una licencia limitada para almacenar, reproducir, mostrar, adaptar técnicamente y transmitir ese contenido cuando sea necesario para:

a. Proporcionar el servicio.
b. Mostrarlo conforme a tus preferencias.
c. Procesar una solicitud.
d. Proteger la plataforma.
e. Cumplir obligaciones legales.
f. Investigar abuso o fraude.

Declaras que tienes derecho a proporcionar el contenido y que su uso autorizado no viola derechos de terceros.

19. MODERACIÓN Y RETIRO DE CONTENIDO

MASS podrá revisar, restringir, bloquear o retirar contenido cuando razonablemente considere que:

a. Viola este Acuerdo.
b. Viola las Normas de la comunidad.
c. Infringe derechos de terceros.
d. Representa un riesgo de seguridad.
e. Puede causar daño.
f. Es requerido por una autoridad competente.
g. Es necesario para proteger a usuarios o servicios.

La Empresa no está obligada a supervisar previamente todo el contenido.

20. PROPIEDAD INTELECTUAL

MASS ID, TE-TO-KA MASS, los nombres, marcas, diseños, interfaces, software, código, documentación, bases de datos, sistemas, logotipos y materiales oficiales pertenecen a TE-TO-KA SOLUTIONS® LLC o a sus licenciantes.

Nada en este Acuerdo transfiere al usuario derechos de propiedad sobre dichos activos.

No puedes utilizar las marcas MASS para crear confusión sobre patrocinio, afiliación, certificación o autorización.

21. PRIVACIDAD

El tratamiento de datos personales se regirá por MASS-LC-003, Aviso de privacidad, y por las preferencias de privacidad disponibles en MASS ID.

Tus preferencias podrán controlar determinadas formas de visualización, comunicación y personalización.

Las alertas esenciales relacionadas con seguridad, acceso, pagos, cumplimiento o funcionamiento de la cuenta podrán permanecer activas cuando sean necesarias.

22. SEGURIDAD

Las medidas de protección de cuentas, sistemas y datos se describirán en MASS-LC-004, Política de seguridad.

La Empresa utilizará medidas razonables de carácter administrativo, técnico y organizacional.

Ningún sistema puede garantizar seguridad absoluta o disponibilidad ininterrumpida.

23. COOKIES Y ALMACENAMIENTO LOCAL

MASS podrá utilizar cookies, almacenamiento local y tecnologías relacionadas para:

a. Mantener sesiones.
b. Recordar preferencias.
c. Proteger cuentas.
d. Prevenir fraude.
e. Analizar funcionamiento.
f. Mejorar la experiencia.
g. Proporcionar funciones autorizadas.

El uso de estas tecnologías se regirá por MASS-LC-005, Política de cookies.

24. INTELIGENCIA ARTIFICIAL Y AUTOMATIZACIÓN

MASS podrá utilizar sistemas automatizados o inteligencia artificial para apoyar funciones como:

a. Atención al usuario.
b. Seguridad.
c. Detección de fraude.
d. Clasificación.
e. Personalización.
f. Recomendaciones.
g. Moderación.
h. Procesamiento de solicitudes.

Los resultados automatizados pueden contener errores y no deben considerarse asesoría profesional, legal, médica o financiera.

El uso de inteligencia artificial se regirá por MASS-LC-006.

25. COMUNICACIONES ELECTRÓNICAS

Aceptas recibir comunicaciones relacionadas con:

a. Seguridad.
b. Inicio de sesión.
c. Verificación.
d. Cambios de cuenta.
e. Pagos.
f. Actualizaciones de políticas.
g. Soporte.
h. Operaciones solicitadas.
i. Servicios contratados.

Las comunicaciones promocionales se enviarán conforme a tus preferencias y a la legislación aplicable.

Podrás retirar el consentimiento para promociones sin desactivar necesariamente las comunicaciones esenciales de la cuenta.

26. SERVICIOS DE TERCEROS

MASS podrá integrarse con servicios proporcionados por terceros, incluyendo:

a. Procesadores de pagos.
b. Proveedores de autenticación.
c. Servicios de correo o SMS.
d. Servicios de almacenamiento.
e. Mapas y ubicación.
f. Proveedores de infraestructura.
g. Herramientas de seguridad.
h. Servicios comerciales independientes.

Los terceros podrán tener sus propios términos y políticas.

La Empresa no controla todas las decisiones, interrupciones o prácticas independientes de dichos proveedores.

27. PAGOS

Los cargos, métodos de pago, autorizaciones, recargas y demás operaciones financieras se regirán por MASS-LC-007, Política de pagos, y por las condiciones específicas del servicio correspondiente.

Debes revisar el precio, moneda, frecuencia y descripción antes de confirmar un pago.

La Empresa podrá utilizar proveedores externos para procesar las transacciones.

28. REEMBOLSOS

Los reembolsos estarán sujetos a MASS-LC-008, Política de reembolsos, a las condiciones particulares del servicio y a los derechos obligatorios establecidos por la legislación aplicable.

La presentación de una solicitud no garantiza automáticamente su aprobación.

29. MASS CASH, CRÉDITOS Y BENEFICIOS

MASS Cash, los saldos, créditos, puntos, beneficios, promociones o tokens internos solamente podrán utilizarse dentro de los servicios y condiciones donde sean autorizados.

Salvo que se indique legal y expresamente lo contrario:

a. No son moneda de curso legal.
b. No son depósitos bancarios.
c. No generan intereses.
d. No están asegurados por una institución gubernamental.
e. No son libremente transferibles.
f. No pueden utilizarse fuera del servicio autorizado.
g. Pueden estar vinculados a un organizador o producto específico.

30. PREVENCIÓN DE FRAUDE

MASS podrá utilizar controles para detectar:

a. Accesos inusuales.
b. Cuentas duplicadas.
c. Identidades falsas.
d. Pagos disputados.
e. Manipulación de promociones.
f. Abuso de beneficios.
g. Uso automatizado no autorizado.
h. Conductas sospechosas.

La Empresa podrá solicitar información adicional, limitar operaciones, retener temporalmente una función o suspender una cuenta mientras investiga.

Estas acciones se regirán por MASS-LC-009, Política antifraude.

31. NORMAS DE LA COMUNIDAD

La conducta dentro de MASS deberá cumplir MASS-LC-010, Normas de la comunidad.

Las normas podrán aplicarse a perfiles, mensajes, imágenes, publicaciones, actividades, transacciones y comunicaciones entre usuarios.

32. DISPONIBILIDAD DEL SERVICIO

MASS procurará mantener sus servicios disponibles, pero no garantiza funcionamiento continuo, libre de errores o compatible con todos los dispositivos.

El servicio podrá verse afectado por:

a. Mantenimiento.
b. Actualizaciones.
c. Fallas de internet.
d. Proveedores externos.
e. Ataques o incidentes.
f. Fuerza mayor.
g. Requisitos legales.
h. Cambios tecnológicos.

33. CAMBIOS EN FUNCIONES

La Empresa podrá agregar, modificar, suspender o retirar funciones cuando sea necesario para:

a. Mejorar el servicio.
b. Proteger la seguridad.
c. Cumplir la ley.
d. Adaptarse a nuevas tecnologías.
e. Corregir errores.
f. Administrar riesgos.
g. Cambiar modelos comerciales.

Cuando un cambio afecte materialmente derechos u obligaciones, se proporcionará el aviso requerido por la legislación aplicable.

34. SUSPENSIÓN

La Empresa podrá suspender temporalmente una cuenta o función cuando exista una razón legítima, incluyendo:

a. Incumplimiento de este Acuerdo.
b. Riesgo de seguridad.
c. Actividad sospechosa.
d. Información falsa.
e. Pago no autorizado.
f. Requerimiento legal.
g. Riesgo para otros usuarios.
h. Investigación de fraude.
i. Inactividad prolongada cuando así lo permitan las políticas aplicables.

La suspensión no elimina automáticamente obligaciones pendientes.

35. TERMINACIÓN POR EL USUARIO

Puedes dejar de utilizar MASS ID o solicitar el cierre de tu cuenta.

Antes de cerrar una cuenta podrán requerirse:

a. Verificación de identidad.
b. Resolución de pagos pendientes.
c. Cumplimiento de obligaciones.
d. Conservación legal de ciertos registros.
e. Transferencia o cierre de funciones administrativas.
f. Protección contra fraude o suplantación.

La eliminación de datos estará sujeta al Aviso de privacidad y a las obligaciones legales de conservación.

36. TERMINACIÓN POR LA EMPRESA

La Empresa podrá terminar una cuenta por incumplimiento grave, fraude, abuso, riesgo, actividad ilegal o imposibilidad legal de continuar proporcionando el servicio.

Cuando sea razonablemente posible y legalmente permitido, se proporcionará aviso de la medida.

37. EFECTOS DE LA TERMINACIÓN

Al terminar una cuenta:

a. Podrá finalizar el acceso a servicios.
b. Podrán cerrarse sesiones.
c. Podrán revocarse permisos.
d. Podrá retirarse contenido público.
e. Los saldos y beneficios se administrarán conforme a sus políticas.
f. Podrán conservarse registros legalmente necesarios.
g. Continuarán vigentes las obligaciones que por su naturaleza deban sobrevivir.

38. RESPONSABILIDAD DEL USUARIO

Eres responsable de:

a. Tus acciones dentro de la cuenta.
b. La información que proporciones.
c. El contenido que publiques.
d. Las operaciones que autorices.
e. Los dispositivos que utilices.
f. Cumplir la legislación aplicable.
g. Revisar las condiciones particulares de cada servicio.
h. Informar oportunamente accesos no autorizados.

39. RELACIONES ENTRE USUARIOS

Salvo que un servicio indique expresamente lo contrario, los usuarios, organizadores, operadores, proveedores y prestadores independientes no son empleados, socios, representantes ni agentes de TE-TO-KA SOLUTIONS® LLC.

Cada parte será responsable de sus propios actos, declaraciones, servicios, licencias, impuestos y obligaciones.

MASS podrá facilitar una conexión tecnológica sin convertirse automáticamente en parte de una relación o transacción independiente.

40. AUSENCIA DE ASESORÍA PROFESIONAL

La información proporcionada mediante MASS no constituye automáticamente asesoría:

a. Legal.
b. Financiera.
c. Fiscal.
d. Médica.
e. De seguros.
f. De inversión.
g. Profesional especializada.

Debes consultar a un profesional calificado cuando una decisión requiera asesoría específica.

41. DECLARACIONES Y GARANTÍAS

El servicio se proporciona en la condición disponible, sujeto a las garantías y derechos que no puedan excluirse legalmente.

En la mayor medida permitida por la legislación aplicable, la Empresa no garantiza que:

a. El servicio sea ininterrumpido.
b. Toda información de terceros sea exacta.
c. Todos los usuarios actúen correctamente.
d. Cada servicio satisfaga todas las necesidades.
e. Todo error sea corregido inmediatamente.
f. Una verificación elimine todos los riesgos.
g. Todo dispositivo sea compatible.

42. LIMITACIÓN DE RESPONSABILIDAD

En la mayor medida permitida por la legislación aplicable, TE-TO-KA SOLUTIONS® LLC no será responsable por daños indirectos, incidentales, especiales, punitivos o consecuentes derivados de:

a. Pérdida de acceso.
b. Fallas de terceros.
c. Conducta de otros usuarios.
d. Pérdida de oportunidades.
e. Interrupciones tecnológicas.
f. Uso no autorizado causado por incumplimiento del usuario.
g. Contenido proporcionado por terceros.

Esta cláusula no limitará responsabilidades que legalmente no puedan excluirse o limitarse.

43. DERECHOS DEL CONSUMIDOR

Nada en este Acuerdo elimina derechos obligatorios otorgados al usuario por las leyes de protección al consumidor.

Cuando una disposición entre en conflicto con un derecho que no pueda renunciarse, prevalecerá la legislación aplicable.

44. INDEMNIZACIÓN

En la medida permitida por la ley, aceptas defender, indemnizar y mantener libre de responsabilidad a TE-TO-KA SOLUTIONS® LLC frente a reclamaciones causadas directamente por:

a. Tu incumplimiento de este Acuerdo.
b. Tu actividad ilegal.
c. Tu contenido.
d. Tu infracción de derechos de terceros.
e. Tu uso no autorizado de una cuenta.
f. Tus actividades comerciales independientes.

Esta obligación no se aplicará cuando la reclamación haya sido causada por conducta de la Empresa que legalmente no pueda trasladarse al usuario.

45. NOTIFICACIÓN DE INFRACCIONES

Podrás informar:

a. Suplantación de identidad.
b. Fraude.
c. Contenido ilegal.
d. Violaciones de propiedad intelectual.
e. Accesos no autorizados.
f. Problemas de seguridad.
g. Incumplimientos de las Normas de la comunidad.

La Empresa podrá solicitar información suficiente para investigar y responder.

46. RESOLUCIÓN INFORMAL DE CONTROVERSIAS

Antes de iniciar una reclamación judicial, las partes procurarán resolver la controversia mediante una notificación escrita que incluya:

a. Nombre del reclamante.
b. Información de la cuenta.
c. Descripción de los hechos.
d. Solución solicitada.
e. Documentos relevantes.

Las partes dispondrán de un periodo razonable para intentar una solución, salvo que la ley permita o requiera una actuación inmediata.

47. LEY APLICABLE Y JURISDICCIÓN

Este Acuerdo se interpretará conforme a las leyes aplicables de Estados Unidos y del Estado de Texas, sin excluir derechos obligatorios que correspondan al usuario en otra jurisdicción.

Salvo que una ley obligatoria disponga otra cosa, cualquier procedimiento judicial relacionado con este Acuerdo podrá presentarse ante los tribunales competentes del Condado de Cameron, Texas.

Esta cláusula no impide utilizar un tribunal de reclamos menores cuando tenga jurisdicción.

48. CAMBIOS AL ACUERDO

La Empresa podrá actualizar este Acuerdo para reflejar:

a. Nuevas funciones.
b. Cambios legales.
c. Requisitos de seguridad.
d. Nuevas tecnologías.
e. Cambios comerciales.
f. Correcciones o aclaraciones.

Cada versión deberá mostrar su identificación, versión y fecha de vigencia.

Cuando un cambio sea material, se proporcionará el aviso y consentimiento requeridos por la legislación aplicable.

49. CESIÓN

El usuario no podrá transferir este Acuerdo ni su cuenta sin autorización escrita.

La Empresa podrá transferir sus derechos y obligaciones como parte de una reorganización, fusión, adquisición, venta de activos o cambio de operador, sujeto a la legislación y avisos aplicables.

50. DIVISIBILIDAD

Si una disposición fuera declarada inválida o inaplicable, las demás disposiciones continuarán vigentes.

La disposición afectada se interpretará o limitará en la medida necesaria para aproximarse legalmente a su propósito original.

51. AUSENCIA DE RENUNCIA

La falta de aplicación inmediata de una disposición no significa que la Empresa renuncie a ejercer posteriormente sus derechos.

52. ORDEN DE PRIORIDAD

En caso de conflicto se aplicará el siguiente orden, salvo que la ley establezca otro:

a. Legislación obligatoria.
b. Condiciones específicas del servicio.
c. Políticas específicas aplicables.
d. Este Acuerdo de usuario.
e. MASS-LC-001, Definiciones legales.

53. ACUERDO COMPLETO

Este Acuerdo, junto con las políticas y condiciones incorporadas, constituye el acuerdo general entre el usuario y TE-TO-KA SOLUTIONS® LLC respecto de MASS ID.

54. CONTACTO Y AVISOS LEGALES

Las solicitudes, preguntas o avisos legales deberán enviarse mediante los canales oficiales publicados por TE-TO-KA SOLUTIONS® LLC.

El usuario deberá conservar actualizados sus medios de contacto para recibir notificaciones relacionadas con su cuenta.

55. ADMINISTRACIÓN CONTINUA

MASS-LC-002 será administrado como un documento evolutivo del MASS ID Legal Center.

Su contenido podrá adaptarse durante las distintas fases, servicios, territorios y modelos de operación del ecosistema MASS.

FIN DEL DOCUMENTO MASS-LC-002
`
},
    {
  codigo: "MASS-LC-003",
  titulo: "Aviso de privacidad",
  descripcion:
    "Explica cómo se recopilan, utilizan, protegen y administran los datos personales.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-003
AVISO DE PRIVACIDAD DE MASS ID

Versión: 1.0
Estado: En revisión
Fecha de vigencia: Pendiente de publicación
Administrado por: TE-TO-KA SOLUTIONS® LLC

AVISO IMPORTANTE

Este Aviso de privacidad explica cómo TE-TO-KA SOLUTIONS® LLC recopila, utiliza, conserva, comparte, protege y administra datos personales relacionados con MASS ID y el ecosistema MASS.

Debes leer este Aviso junto con el Acuerdo de usuario MASS ID y las políticas particulares de cada producto o servicio.

1. RESPONSABLE DE LOS DATOS

TE-TO-KA SOLUTIONS® LLC administra MASS ID y determina los propósitos principales para los cuales se tratan los datos personales dentro del ecosistema MASS, salvo cuando un tercero independiente actúe como responsable de sus propias operaciones.

En este documento, las expresiones “MASS”, “Empresa”, “nosotros” o “nuestro” se refieren a TE-TO-KA SOLUTIONS® LLC y a los servicios que esta administre directamente.

2. ALCANCE

Este Aviso se aplica a los datos tratados mediante:

a. MASS ID.
b. TE-TO-KA MASS.
c. MASS Sorteos Pro.
d. MASS Ruta.
e. MASS Cash.
f. MASS VPN.
g. MASS Learn.
h. MASS TV.
i. Sitios web y aplicaciones MASS.
j. Paneles administrativos.
k. Servicios de atención al usuario.
l. Sistemas de autenticación y seguridad.
m. Productos, módulos y servicios futuros integrados con MASS ID.

Un producto específico podrá tener un aviso complementario cuando sus operaciones requieran información o tratamientos adicionales.

3. DATOS QUE EL USUARIO PROPORCIONA

Podemos recopilar información proporcionada directamente por el usuario, incluyendo:

a. Nombre y apellidos.
b. Correo electrónico.
c. Número telefónico.
d. Contraseña cifrada o credenciales administradas por proveedores de autenticación.
e. PIN y códigos de verificación.
f. Dirección residencial, comercial o de entrega.
g. Fotografía de perfil.
h. Fecha de nacimiento o confirmación de edad.
i. Idioma y preferencias.
j. Información de soporte.
k. Mensajes y comunicaciones.
l. Contenido publicado o cargado.
m. Información de una organización o negocio.
n. Documentos proporcionados para verificaciones.
o. Información necesaria para contratar, comprar o utilizar un servicio.

4. INFORMACIÓN DE CUENTA Y MASS ID

Podemos mantener datos relacionados con la cuenta, incluyendo:

a. Número MASS ID.
b. Identificador interno de autenticación.
c. Estado de la cuenta.
d. Fecha de registro.
e. Fecha de verificación.
f. Roles y permisos.
g. Organizaciones asociadas.
h. Historial de cambios importantes.
i. Preferencias de privacidad.
j. Configuración de seguridad.
k. Direcciones registradas.
l. Sesiones y dispositivos autorizados.

5. DATOS RECOPILADOS AUTOMÁTICAMENTE

Cuando se utiliza MASS podemos recibir automáticamente:

a. Dirección IP.
b. Tipo de navegador.
c. Sistema operativo.
d. Tipo de dispositivo.
e. Identificadores técnicos.
f. Fecha y hora de acceso.
g. Páginas o funciones utilizadas.
h. Errores técnicos.
i. Registros de seguridad.
j. Información de sesión.
k. Interacciones con notificaciones.
l. Datos aproximados de ubicación derivados de la red.
m. Información almacenada mediante cookies o almacenamiento local.

6. UBICACIÓN

Algunos servicios pueden requerir datos de ubicación para:

a. Mostrar rutas.
b. Coordinar entregas.
c. Asignar servicios.
d. Confirmar puntos de origen o destino.
e. Mostrar operadores cercanos.
f. Prevenir fraude.
g. Proteger cuentas.
h. Proporcionar funciones solicitadas.

La ubicación precisa solamente deberá utilizarse cuando sea necesaria para una función autorizada y cuando exista el permiso requerido.

El usuario podrá administrar los permisos de ubicación mediante su dispositivo, aunque desactivarlos puede impedir que determinadas funciones trabajen correctamente.

7. INFORMACIÓN DE PAGOS

Cuando se realizan pagos, recargas, compras o transacciones, podemos tratar:

a. Nombre del pagador.
b. Monto.
c. Moneda.
d. Fecha.
e. Descripción.
f. Estado de la transacción.
g. Identificador del procesador de pagos.
h. Últimos dígitos o descripción limitada del método de pago.
i. Historial de reembolsos o disputas.
j. Señales de prevención de fraude.

Los números completos de tarjetas y credenciales financieras sensibles podrán ser procesados directamente por proveedores de pagos independientes.

MASS no deberá almacenar información financiera completa cuando no sea necesaria para operar el servicio.

8. MASS CASH, SALDOS Y BENEFICIOS

Podemos mantener registros relacionados con:

a. Saldo MASS.
b. Recargas.
c. Compras.
d. Créditos.
e. Beneficios.
f. Premios.
g. Cupones.
h. Canjes.
i. Movimientos.
j. Organizador asociado.
k. Estado de aprobación.
l. Historial de transacciones.

Estos datos se utilizarán para administrar las funciones correspondientes, resolver disputas, prevenir fraude y cumplir obligaciones legales.

9. DATOS DE SERVICIOS DE TRANSPORTE Y LOGÍSTICA

Cuando se utilicen servicios como MASS Ruta, podremos tratar:

a. Dirección de origen.
b. Dirección de destino.
c. Información del paquete.
d. Peso o dimensiones.
e. Fotografías.
f. Datos del remitente.
g. Datos del destinatario.
h. Ubicación del operador.
i. Estado de la entrega.
j. Comprobantes.
k. Comunicaciones relacionadas.
l. Incidentes o reclamaciones.

10. DATOS DE ORGANIZADORES Y OPERADORES

Para funciones comerciales, administrativas o profesionales podremos solicitar:

a. Nombre legal.
b. Nombre comercial.
c. Identificación.
d. Información de contacto.
e. Licencias.
f. Seguros.
g. Fotografías.
h. Información del vehículo.
i. Datos fiscales.
j. Información bancaria para pagos autorizados.
k. Historial de servicios.
l. Evaluaciones.
m. Documentos de cumplimiento.
n. Roles y permisos administrativos.

11. DATOS SENSIBLES

Dependiendo del servicio, MASS podría tratar datos considerados sensibles, incluyendo:

a. Ubicación precisa.
b. Identificaciones oficiales.
c. Información financiera.
d. Datos de menores.
e. Información biométrica.
f. Información médica cuando una función autorizada lo requiera.
g. Credenciales y códigos de seguridad.
h. Información relacionada con seguros.
i. Datos protegidos por leyes especiales.

Los datos sensibles solamente deberán tratarse cuando exista una necesidad legítima, medidas de protección reforzadas y el consentimiento o autorización exigidos por la legislación aplicable.

12. FOTOGRAFÍAS Y VERIFICACIÓN FACIAL

Las fotografías podrán utilizarse para:

a. Mostrar una imagen de perfil.
b. Verificar una cuenta.
c. Comparar un documento con una persona.
d. Prevenir suplantación.
e. Confirmar identidad en operaciones sensibles.
f. Proteger a usuarios y servicios.

Una fotografía no deberá considerarse automáticamente un dato biométrico procesado.

Cuando MASS genere, utilice o conserve una plantilla, geometría facial u otro identificador biométrico para reconocer a una persona, deberá proporcionar los avisos y obtener los consentimientos que correspondan antes de dicho tratamiento.

13. BIOMETRÍA

MASS no venderá ni comercializará datos biométricos.

Antes de recopilar o utilizar un identificador biométrico, MASS deberá informar, según resulte aplicable:

a. Qué información se recopilará.
b. El propósito.
c. El tiempo de conservación.
d. Los proveedores participantes.
e. El método para retirar el consentimiento.
f. El proceso de eliminación.

La utilización de funciones biométricas podrá estar sujeta a una política y consentimiento separados.

14. MENORES DE EDAD

MASS ID de uso general no está dirigido a menores de trece años.

No recopilaremos conscientemente datos personales de un menor de trece años mediante un servicio general sin el consentimiento parental verificable requerido.

Los productos específicamente diseñados para menores deberán contar con:

a. Aviso directo para padres o tutores.
b. Consentimiento parental verificable.
c. Controles de acceso.
d. Recopilación limitada.
e. Medidas de seguridad apropiadas.
f. Derechos de revisión y eliminación.
g. Restricciones de publicidad y perfilamiento aplicables.

Si identificamos una cuenta creada por un menor sin la autorización necesaria, podremos restringirla y eliminar la información conforme a la ley.

15. FUENTES DE INFORMACIÓN

Podemos obtener datos de:

a. El propio usuario.
b. Padres o tutores autorizados.
c. Representantes de una organización.
d. Otros usuarios participantes en una operación.
e. Proveedores tecnológicos.
f. Procesadores de pagos.
g. Proveedores de verificación.
h. Sistemas de seguridad.
i. Fuentes públicas legalmente accesibles.
j. Dispositivos y navegadores.
k. Servicios integrados autorizados por el usuario.

16. PROPÓSITOS DEL TRATAMIENTO

Podemos utilizar los datos para:

a. Crear y administrar MASS ID.
b. Autenticar usuarios.
c. Verificar información.
d. Proporcionar servicios.
e. Procesar solicitudes.
f. Administrar pagos.
g. Mostrar saldos e historiales.
h. Coordinar operaciones.
i. Enviar comunicaciones esenciales.
j. Proporcionar soporte.
k. Personalizar funciones autorizadas.
l. Mantener preferencias.
m. Prevenir fraude.
n. Proteger cuentas.
o. Investigar incidentes.
p. Cumplir obligaciones legales.
q. Mantener registros.
r. Mejorar rendimiento y accesibilidad.
s. Desarrollar nuevas funciones.
t. Resolver disputas.
u. Aplicar acuerdos y políticas.
v. Generar análisis estadísticos.
w. Proteger los derechos de MASS y de terceros.

17. BASES Y AUTORIZACIONES

Cuando una legislación requiera identificar una base para el tratamiento, MASS podrá apoyarse en:

a. La ejecución de un contrato.
b. El consentimiento.
c. El cumplimiento de una obligación legal.
d. La protección de una persona.
e. Un interés legítimo que no prevalezca sobre los derechos del usuario.
f. El establecimiento, defensa o ejercicio de reclamaciones.
g. La prestación de un servicio solicitado.

El usuario podrá retirar un consentimiento cuando la legislación lo permita, sin afectar el tratamiento realizado previamente de manera válida.

18. PERFIL PÚBLICO Y VISIBILIDAD

El usuario podrá controlar determinadas preferencias, como:

a. Perfil visible.
b. Mostrar teléfono.
c. Mostrar correo.
d. Recibir promociones.
e. Permitir personalización.

El usuario siempre podrá consultar sus propios datos autenticados.

Activar un perfil visible no autoriza a otros usuarios a utilizar la información para acoso, fraude, vigilancia, comercialización no solicitada o actividades prohibidas.

19. COMUNICACIONES ESENCIALES

Podemos enviar comunicaciones necesarias sobre:

a. Seguridad.
b. Inicio de sesión.
c. Verificación.
d. Cambios de contraseña.
e. Cambios de correo o teléfono.
f. Pagos.
g. Operaciones solicitadas.
h. Actualizaciones legales.
i. Incidentes.
j. Soporte.
k. Suspensión o cierre de cuenta.

Estas comunicaciones podrán permanecer activas aunque el usuario no acepte mensajes promocionales.

20. PROMOCIONES

Solamente enviaremos comunicaciones promocionales conforme a las preferencias del usuario y la legislación aplicable.

El usuario podrá desactivar promociones mediante:

a. Las preferencias de MASS ID.
b. Un enlace para cancelar suscripción.
c. Los ajustes de notificaciones.
d. Una solicitud enviada por un canal oficial.

Desactivar promociones no desactiva alertas esenciales.

21. PERSONALIZACIÓN

Cuando el usuario lo autorice, podremos utilizar actividad e intereses para:

a. Organizar contenido.
b. Recomendar funciones.
c. Mostrar servicios relevantes.
d. Mejorar la experiencia.
e. Recordar preferencias.
f. Adaptar comunicaciones.

El usuario podrá desactivar la personalización desde sus preferencias cuando la función esté disponible.

22. INTELIGENCIA ARTIFICIAL

MASS podrá utilizar sistemas automatizados o de inteligencia artificial para:

a. Atención al usuario.
b. Detección de fraude.
c. Seguridad.
d. Clasificación.
e. Moderación.
f. Recomendaciones.
g. Traducción.
h. Resúmenes.
i. Procesamiento de solicitudes.
j. Mejora de servicios.

Los sistemas automatizados pueden producir resultados incorrectos.

Cuando una decisión automatizada produzca efectos importantes sobre una persona, MASS aplicará los derechos de revisión, información u oposición requeridos por la legislación aplicable.

23. DATOS DESIDENTIFICADOS Y AGREGADOS

Podemos transformar información para crear datos desidentificados o agregados.

Estos datos podrán utilizarse para:

a. Estadísticas.
b. Seguridad.
c. Investigación.
d. Mejora del servicio.
e. Planeación.
f. Análisis de desempeño.

MASS deberá mantener medidas razonables para evitar que los datos desidentificados se utilicen para volver a identificar a una persona.

24. PROVEEDORES DE SERVICIOS

Podemos compartir información necesaria con proveedores que apoyen:

a. Alojamiento.
b. Bases de datos.
c. Autenticación.
d. Correo electrónico.
e. SMS.
f. Notificaciones.
g. Pagos.
h. Mapas.
i. Seguridad.
j. Almacenamiento.
k. Verificación.
l. Análisis técnico.
m. Soporte.
n. Servicios jurídicos y contables.

Estos proveedores solamente deberán recibir los datos necesarios para realizar sus funciones y estarán sujetos a obligaciones contractuales o legales de protección.

25. OTROS USUARIOS

Cierta información podrá compartirse con otros usuarios cuando sea necesaria para completar una operación, por ejemplo:

a. Nombre.
b. Información de contacto autorizada.
c. Dirección de entrega.
d. Estado de un servicio.
e. Fotografía de perfil.
f. Información del organizador.
g. Información del operador.
h. Datos necesarios para una transacción.

La información compartida dependerá de las preferencias, funciones y necesidades del servicio.

26. TERCEROS INDEPENDIENTES

Algunos servicios integrados pueden ser operados por terceros independientes que determinan sus propias prácticas de privacidad.

Estos terceros podrán incluir:

a. Instituciones financieras.
b. Procesadores de pagos.
c. Aseguradoras.
d. Comercios.
e. Operadores.
f. Organizadores.
g. Servicios profesionales.
h. Proveedores de telecomunicaciones.
i. Autoridades públicas.

El usuario deberá revisar los avisos de privacidad de dichos terceros.

27. VENTA DE DATOS

Conforme al diseño y prácticas actuales de MASS, no vendemos datos personales, datos sensibles ni datos biométricos.

Tampoco intercambiamos datos personales por dinero con empresas de publicidad.

Si estas prácticas fueran a cambiar, MASS deberá actualizar este Aviso, proporcionar las divulgaciones requeridas y habilitar los mecanismos de consentimiento u oposición antes de implementar el cambio.

28. PUBLICIDAD DIRIGIDA

MASS no deberá utilizar datos sensibles para publicidad dirigida sin la autorización legal correspondiente.

Cuando una función utilice datos personales para publicidad dirigida, el usuario recibirá un aviso y un mecanismo para oponerse cuando la legislación lo requiera.

29. DIVULGACIONES LEGALES

Podemos divulgar información cuando resulte razonablemente necesario para:

a. Cumplir una ley.
b. Responder a una orden válida.
c. Cooperar con autoridades competentes.
d. Proteger la seguridad de una persona.
e. Investigar fraude.
f. Defender derechos legales.
g. Aplicar contratos.
h. Responder a una emergencia.
i. Prevenir daños.
j. Cumplir obligaciones regulatorias.

Cuando sea legalmente permitido, intentaremos limitar la divulgación a la información razonablemente necesaria.

30. TRANSACCIONES EMPRESARIALES

La información podrá transferirse como parte de:

a. Una fusión.
b. Una adquisición.
c. Una reorganización.
d. Una financiación.
e. Una venta de activos.
f. Un cambio de operador.
g. Un procedimiento de insolvencia.

El nuevo responsable deberá respetar las obligaciones legales aplicables y proporcionar avisos sobre cambios materiales.

31. CONSERVACIÓN

Conservaremos datos solamente durante el tiempo razonablemente necesario para:

a. Proporcionar servicios.
b. Mantener una cuenta.
c. Cumplir contratos.
d. Cumplir obligaciones legales.
e. Prevenir fraude.
f. Resolver disputas.
g. Proteger la seguridad.
h. Mantener registros financieros.
i. Defender reclamaciones.
j. Cumplir solicitudes válidas.

Los periodos podrán variar según el tipo de información, servicio, riesgo y obligación legal.

32. ELIMINACIÓN

Cuando los datos ya no sean necesarios, podrán:

a. Eliminarse.
b. Anonimizarse.
c. Desidentificarse.
d. Mantenerse bloqueados durante un periodo legal.
e. Conservarse en respaldos hasta su eliminación programada.

Una solicitud de eliminación no exige borrar información que deba conservarse legalmente o que sea necesaria para prevenir fraude, completar una transacción o defender derechos.

33. SEGURIDAD

MASS utilizará medidas administrativas, técnicas y organizacionales razonables, incluyendo según corresponda:

a. Controles de acceso.
b. Autenticación.
c. Autenticación multifactor.
d. Cifrado en tránsito.
e. Restricciones de permisos.
f. Registro de actividad.
g. Copias de seguridad.
h. Actualizaciones.
i. Evaluaciones de proveedores.
j. Procedimientos de respuesta a incidentes.
k. Separación de funciones administrativas.
l. Verificación de operaciones sensibles.

Ninguna medida garantiza seguridad absoluta.

34. RESPONSABILIDADES DEL USUARIO

El usuario debe:

a. Proteger su contraseña.
b. Proteger sus códigos.
c. Mantener sus dispositivos seguros.
d. Cerrar sesiones no reconocidas.
e. Mantener actualizados sus datos.
f. Informar accesos sospechosos.
g. No compartir credenciales.
h. Revisar sus preferencias.
i. Proteger información descargada.
j. Evitar publicar datos sensibles innecesarios.

35. INCIDENTES DE SEGURIDAD

Cuando ocurra un incidente, MASS podrá:

a. Investigar.
b. Contener la situación.
c. Cambiar credenciales.
d. Cerrar sesiones.
e. Suspender funciones.
f. Solicitar verificaciones.
g. Notificar a usuarios.
h. Notificar a autoridades.
i. Restaurar sistemas.
j. Mejorar controles.

Las notificaciones se realizarán cuando lo requiera la legislación aplicable.

36. DERECHOS DE PRIVACIDAD

Dependiendo de la jurisdicción, el usuario podrá tener derecho a:

a. Confirmar si tratamos sus datos.
b. Acceder a sus datos.
c. Obtener una copia.
d. Corregir datos inexactos.
e. Solicitar eliminación.
f. Retirar consentimiento.
g. Oponerse a determinados tratamientos.
h. Limitar ciertos usos.
i. Optar por no participar en publicidad dirigida.
j. Optar por no participar en una venta de datos.
k. Oponerse a determinados perfiles automatizados.
l. Presentar una apelación.
m. No sufrir discriminación por ejercer sus derechos.
n. Presentar una queja ante una autoridad competente.

Los derechos disponibles dependerán de la residencia del usuario y de la legislación aplicable.

37. SOLICITUDES DE PRIVACIDAD

Las solicitudes deberán enviarse mediante los canales oficiales publicados por MASS.

La solicitud deberá proporcionar suficiente información para:

a. Identificar la cuenta.
b. Verificar la identidad.
c. Comprender la solicitud.
d. Localizar los datos.
e. Proteger la información contra accesos no autorizados.

MASS podrá solicitar verificación adicional antes de revelar, corregir o eliminar información.

38. REPRESENTANTES AUTORIZADOS

Cuando la legislación lo permita, un representante autorizado podrá presentar una solicitud en nombre del usuario.

Podremos solicitar:

a. Prueba de autorización.
b. Verificación directa del usuario.
c. Identificación del representante.
d. Documentación legal aplicable.

39. APELACIONES

Cuando MASS rechace total o parcialmente una solicitud de privacidad y la ley otorgue derecho de apelación, el usuario podrá solicitar una revisión mediante el canal indicado en la respuesta.

La apelación deberá identificar la decisión impugnada y explicar por qué debe reconsiderarse.

40. TIEMPOS DE RESPUESTA

MASS responderá dentro del plazo establecido por la legislación aplicable.

Cuando sea permitido, el plazo podrá ampliarse debido a la complejidad, cantidad de solicitudes o necesidad de verificación.

El usuario será informado cuando una ampliación resulte necesaria.

41. NO DISCRIMINACIÓN

MASS no discriminará ilegalmente contra una persona por ejercer un derecho de privacidad.

El ejercicio de derechos no impide que MASS:

a. Requiera datos necesarios para un servicio.
b. Limite una función que no pueda operar sin esos datos.
c. Mantenga información legalmente necesaria.
d. Proteja cuentas y operaciones.
e. Cumpla obligaciones contractuales o legales.

42. TEXAS

Los residentes de Texas podrán tener derechos relacionados con:

a. Confirmación del tratamiento.
b. Acceso.
c. Corrección.
d. Eliminación.
e. Portabilidad.
f. Exclusión de publicidad dirigida.
g. Exclusión de venta de datos.
h. Exclusión de ciertos perfiles automatizados.
i. Apelación.
j. No discriminación.

MASS proporcionará métodos seguros para presentar solicitudes conforme a los requisitos aplicables.

43. OTROS ESTADOS DE ESTADOS UNIDOS

Los residentes de otros estados podrán tener derechos adicionales conforme a las leyes aplicables en su lugar de residencia.

MASS evaluará cada solicitud conforme a:

a. La residencia verificada.
b. La ley correspondiente.
c. Las excepciones aplicables.
d. La naturaleza del servicio.
e. El tipo de datos involucrados.

44. USUARIOS INTERNACIONALES

MASS está administrado desde Estados Unidos.

Cuando se ofrezcan servicios en otros países, los datos podrán transferirse y tratarse en Estados Unidos u otros lugares donde operen proveedores autorizados.

MASS implementará los avisos, contratos, consentimientos y mecanismos de transferencia exigidos por la legislación aplicable.

45. COOKIES Y ALMACENAMIENTO LOCAL

MASS podrá utilizar:

a. Cookies esenciales.
b. Almacenamiento local.
c. Identificadores de sesión.
d. Preferencias.
e. tecnologías de seguridad.
f. Herramientas de rendimiento.
g. Notificaciones.

La información detallada se encontrará en MASS-LC-005, Política de cookies.

46. SEÑALES DE PREFERENCIA

Cuando la legislación aplicable requiera reconocer una señal tecnológica válida de exclusión, MASS deberá evaluar y aplicar dicha señal conforme a los requisitos correspondientes.

Las preferencias vinculadas a una cuenta podrán prevalecer dentro de las funciones autenticadas cuando reflejen una elección verificable del usuario.

47. ENLACES EXTERNOS

Los servicios MASS pueden incluir enlaces a sitios o aplicaciones externas.

MASS no controla las prácticas independientes de esos terceros.

El usuario debe revisar sus políticas antes de proporcionar información.

48. CAMBIOS AL AVISO

Podremos actualizar este Aviso para reflejar:

a. Cambios legales.
b. Nuevos servicios.
c. Nuevas categorías de datos.
d. Nuevos proveedores.
e. Cambios de seguridad.
f. Nuevas tecnologías.
g. Cambios empresariales.
h. Correcciones o aclaraciones.

Cada versión mostrará su número y fecha de vigencia.

Cuando un cambio sea material, proporcionaremos el aviso o consentimiento exigido.

49. VERSIONES ANTERIORES

MASS podrá conservar copias de versiones anteriores para:

a. Cumplimiento.
b. Auditoría.
c. Resolución de disputas.
d. Historial de consentimiento.
e. Administración legal.

La versión publicada más reciente será la aplicable a partir de su fecha de vigencia, salvo que la ley establezca otra cosa.

50. CONFLICTOS

En caso de conflicto se aplicará el siguiente orden:

a. Legislación obligatoria.
b. Aviso específico de un servicio.
c. Este Aviso de privacidad.
d. Acuerdo de usuario MASS ID.
e. Definiciones generales del MASS ID Legal Center.

51. CONTACTO

Las preguntas, solicitudes y avisos de privacidad deberán enviarse mediante los canales oficiales publicados por TE-TO-KA SOLUTIONS® LLC.

Antes de la publicación definitiva deberán incorporarse como mínimo:

a. Correo electrónico oficial de privacidad.
b. Dirección postal oficial.
c. Método para ejercer derechos.
d. Método para presentar apelaciones.
e. Canal para reportar incidentes.
f. Información de contacto adicional exigida por la ley.

52. ADMINISTRACIÓN CONTINUA

MASS-LC-003 será administrado como un documento evolutivo del MASS ID Legal Center.

Su contenido deberá actualizarse cuando cambien las prácticas reales de recopilación, uso, conservación, intercambio, seguridad o derechos de privacidad.

FIN DEL DOCUMENTO MASS-LC-003
`
},
    {
  codigo: "MASS-LC-004",
  titulo: "Política de seguridad",
  descripcion:
    "Describe las medidas utilizadas para proteger cuentas, identidad, sesiones y datos.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-004
POLÍTICA DE SEGURIDAD DE MASS ID

Versión: 1.0
Estado: En revisión
Fecha de vigencia: Pendiente de publicación
Administrado por: TE-TO-KA SOLUTIONS® LLC

AVISO IMPORTANTE

Esta Política establece los principios administrativos, técnicos, físicos y organizacionales que TE-TO-KA SOLUTIONS® LLC aplicará para proteger MASS ID y los productos, plataformas, aplicaciones, módulos, sitios web, sistemas y servicios que formen parte del ecosistema MASS.

La seguridad es una responsabilidad compartida entre MASS, sus usuarios, administradores, organizadores, operadores, empleados, contratistas, proveedores tecnológicos y demás participantes autorizados.

Ningún sistema puede garantizar seguridad absoluta. MASS aplicará medidas razonables y proporcionales al tipo de información, los riesgos identificados, la naturaleza del servicio y los recursos disponibles.

1. PROPÓSITO

Esta Política tiene como propósito:

a. Proteger la confidencialidad de la información.
b. Mantener la integridad de datos y sistemas.
c. Preservar la disponibilidad de servicios.
d. Prevenir accesos no autorizados.
e. Reducir riesgos de fraude y suplantación.
f. Detectar actividad sospechosa.
g. Responder a incidentes.
h. Recuperar operaciones.
i. Cumplir obligaciones legales.
j. Proteger los derechos de usuarios y terceros.
k. Mantener la confianza en MASS ID.

2. ALCANCE

Esta Política se aplica, según corresponda, a:

a. MASS ID.
b. TE-TO-KA MASS.
c. MASS Sorteos Pro.
d. MASS Ruta.
e. MASS Cash.
f. MASS VPN.
g. MASS Learn.
h. MASS TV.
i. MASS Face ID.
j. MASS Points.
k. MASS Contract.
l. Central IA.
m. TOKAYO IA.
n. Sitios web MASS.
o. Aplicaciones móviles.
p. Paneles administrativos.
q. Bases de datos.
r. Sistemas de autenticación.
s. Proveedores conectados.
t. Infraestructura tecnológica.
u. Productos y servicios futuros vinculados con MASS ID.

3. OBJETIVOS DE SEGURIDAD

MASS procurará mantener:

a. Confidencialidad, para que los datos solamente sean accesibles por personas y sistemas autorizados.
b. Integridad, para evitar alteraciones no autorizadas o accidentales.
c. Disponibilidad, para conservar acceso razonable a sistemas y datos.
d. Autenticidad, para confirmar la identidad de usuarios y sistemas.
e. Trazabilidad, para registrar operaciones importantes.
f. Resiliencia, para continuar o restaurar servicios después de una interrupción.
g. Privacidad, para utilizar datos conforme a las preferencias y obligaciones aplicables.
h. Responsabilidad, para identificar funciones y decisiones relacionadas con la seguridad.

4. GOBIERNO DE SEGURIDAD

TE-TO-KA SOLUTIONS® LLC conservará la autoridad administrativa sobre el programa de seguridad del ecosistema MASS.

La Empresa podrá:

a. Establecer políticas.
b. Aprobar controles.
c. Designar responsables.
d. Evaluar riesgos.
e. Revisar incidentes.
f. Suspender accesos.
g. Exigir correcciones.
h. Seleccionar proveedores.
i. Ordenar auditorías.
j. Actualizar procedimientos.
k. Adoptar estándares adicionales.
l. Modificar controles conforme evolucionen los riesgos.

5. RESPONSABILIDADES

Las responsabilidades podrán distribuirse entre:

a. Dirección administrativa.
b. Responsables tecnológicos.
c. Superadministradores.
d. Administradores autorizados.
e. Organizadores.
f. Operadores.
g. Desarrolladores.
h. Personal de soporte.
i. Proveedores de infraestructura.
j. Procesadores de pagos.
k. Proveedores de autenticación.
l. Consultores legales o de seguridad.

Cada persona deberá tener solamente los permisos necesarios para cumplir sus funciones.

6. GESTIÓN DE RIESGOS

MASS procurará identificar y evaluar riesgos relacionados con:

a. Acceso no autorizado.
b. Robo de credenciales.
c. Suplantación de identidad.
d. Fraude.
e. Pérdida de datos.
f. Alteración de registros.
g. Vulnerabilidades de software.
h. Configuraciones incorrectas.
i. Errores humanos.
j. Proveedores.
k. Dispositivos comprometidos.
l. Ingeniería social.
m. Ataques automatizados.
n. Interrupciones operativas.
o. Amenazas internas.
p. Desastres naturales.
q. Fallas de servicios externos.
r. Nuevas tecnologías.

Las evaluaciones deberán actualizarse cuando cambien los sistemas, datos, proveedores, amenazas o modelos de operación.

7. INVENTARIO DE ACTIVOS

MASS procurará mantener un inventario razonable de:

a. Aplicaciones.
b. Sitios web.
c. Bases de datos.
d. Repositorios de código.
e. Dominios.
f. Servidores.
g. Servicios en la nube.
h. Cuentas administrativas.
i. Llaves y credenciales.
j. Proveedores.
k. Dispositivos autorizados.
l. Integraciones.
m. Datos sensibles.
n. Copias de seguridad.
o. Sistemas críticos.

El nivel de detalle dependerá del riesgo y la importancia del activo.

8. CLASIFICACIÓN DE INFORMACIÓN

La información podrá clasificarse como:

a. Pública.
b. Interna.
c. Confidencial.
d. Sensible.
e. Restringida.
f. Legalmente protegida.

Los datos sensibles, financieros, biométricos, de ubicación, autenticación, identificación y seguridad deberán recibir controles reforzados cuando corresponda.

9. MINIMIZACIÓN DE DATOS

MASS procurará:

a. Recopilar solamente información razonablemente necesaria.
b. Limitar duplicaciones innecesarias.
c. Evitar almacenar credenciales sensibles sin necesidad.
d. Eliminar o anonimizar datos que ya no sean requeridos.
e. Restringir el acceso conforme a la función.
f. Revisar periódicamente los datos conservados.

10. IDENTIDAD Y AUTENTICACIÓN

MASS podrá utilizar:

a. Correo electrónico.
b. Número telefónico.
c. Contraseña.
d. PIN.
e. Códigos de verificación.
f. Enlaces seguros.
g. Autenticación multifactor.
h. Aplicaciones de autenticación.
i. Verificación documental.
j. Confirmación biométrica autorizada.
k. Identificadores internos.
l. Controles de sesión.

La autenticación deberá ser proporcional al riesgo de la operación.

11. CONTRASEÑAS

Los usuarios deberán utilizar contraseñas que:

a. Sean difíciles de adivinar.
b. No sean compartidas.
c. No se reutilicen innecesariamente.
d. Se mantengan privadas.
e. Se cambien cuando exista sospecha de compromiso.
f. No sean enviadas mediante canales inseguros.

MASS no deberá mostrar públicamente contraseñas ni almacenarlas en texto legible cuando sean administradas directamente por sus sistemas.

12. AUTENTICACIÓN MULTIFACTOR

MASS podrá requerir autenticación multifactor para:

a. Superadministradores.
b. Administradores.
c. Cambios de contraseña.
d. Cambios de correo.
e. Cambios de teléfono.
f. Operaciones financieras.
g. Accesos desde dispositivos nuevos.
h. Recuperación de cuenta.
i. Funciones sensibles.
j. Actividad considerada de alto riesgo.

Los códigos de autenticación son personales y no deben compartirse.

13. RECUPERACIÓN DE CUENTA

Los procesos de recuperación podrán requerir:

a. Acceso al correo registrado.
b. Acceso al teléfono registrado.
c. Código de autenticación.
d. Contraseña actual.
e. Confirmación de identidad.
f. Revisión administrativa.
g. Documentación adicional.
h. Periodos de seguridad.
i. Cierre de sesiones anteriores.
j. Revisión de actividad reciente.

MASS podrá negar o retrasar una recuperación cuando existan señales razonables de fraude.

14. CONTROL DE ACCESO

El acceso deberá basarse en:

a. Identidad verificada.
b. Función autorizada.
c. Necesidad operativa.
d. Principio de mínimo privilegio.
e. Separación de responsabilidades.
f. Duración necesaria.
g. Riesgo de la información.
h. Estado de la cuenta.

Los permisos deberán revisarse y retirarse cuando dejen de ser necesarios.

15. ROLES Y PERMISOS

MASS podrá utilizar roles como:

a. Usuario.
b. Organizador.
c. Operador.
d. Administrador de organización.
e. Personal de soporte.
f. Administrador técnico.
g. Superadministrador.
h. Auditor.
i. Proveedor autorizado.

Un rol no concede autoridad ilimitada.

Cada operación deberá permanecer sujeta a las restricciones técnicas, legales y administrativas aplicables.

16. CUENTAS ADMINISTRATIVAS

Las cuentas administrativas deberán:

a. Estar vinculadas con una persona o función autorizada.
b. Utilizar autenticación reforzada.
c. Mantener permisos limitados.
d. Registrar operaciones importantes.
e. Evitar el uso cotidiano cuando no sea necesario.
f. Ser desactivadas al terminar la autorización.
g. Evitar credenciales compartidas.
h. Proteger secretos y llaves.
i. Revisarse periódicamente.

17. SESIONES

MASS podrá:

a. Registrar sesiones.
b. Mostrar dispositivos conectados.
c. Cerrar sesiones individuales.
d. Cerrar todas las sesiones.
e. Invalidar sesiones comprometidas.
f. Aplicar vencimientos.
g. Solicitar nueva autenticación.
h. Detectar cambios sospechosos.
i. Limitar sesiones simultáneas.
j. Proteger tokens de acceso.

Cerrar una ventana no necesariamente finaliza una sesión, por lo que el usuario deberá utilizar la función oficial de cerrar sesión cuando corresponda.

18. DISPOSITIVOS

El usuario es responsable de proteger los dispositivos utilizados para acceder a MASS.

Se recomienda:

a. Utilizar bloqueo de pantalla.
b. Mantener el sistema actualizado.
c. Evitar dispositivos comprometidos.
d. No guardar contraseñas en lugares inseguros.
e. Instalar software solamente de fuentes confiables.
f. Evitar redes públicas para operaciones sensibles.
g. Cerrar sesión en dispositivos compartidos.
h. Revisar dispositivos conectados.
i. Reportar pérdida o robo.
j. Activar protección contra malware cuando corresponda.

19. CIFRADO

MASS procurará utilizar mecanismos de cifrado apropiados:

a. Durante la transmisión de datos.
b. En bases de datos o almacenamiento cuando resulte necesario.
c. En copias de seguridad sensibles.
d. En conexiones administrativas.
e. En integraciones con terceros.
f. Para proteger secretos y credenciales.

La selección del mecanismo dependerá del tipo de información, el proveedor y el riesgo.

20. PROTECCIÓN DE CREDENCIALES Y SECRETOS

Las llaves, tokens, contraseñas técnicas y secretos deberán:

a. Mantenerse fuera del código público.
b. Limitarse a sistemas autorizados.
c. Rotarse cuando sea necesario.
d. Revocarse cuando exista compromiso.
e. Separarse por entorno.
f. No compartirse mediante mensajes inseguros.
g. Almacenarse mediante herramientas apropiadas.
h. Tener permisos mínimos.
i. Supervisarse cuando corresponda.

21. DESARROLLO SEGURO

El desarrollo de aplicaciones MASS deberá procurar:

a. Revisar requisitos de seguridad.
b. Validar entradas.
c. Limitar permisos.
d. Evitar exposición de secretos.
e. Proteger consultas a bases de datos.
f. Utilizar autenticación segura.
g. Manejar errores sin revelar información sensible.
h. Actualizar dependencias.
i. Revisar cambios importantes.
j. Probar funciones críticas.
k. Separar entornos cuando sea posible.
l. Mantener respaldos del código.
m. Documentar controles importantes.
n. Aplicar seguridad desde el diseño.

22. REPOSITORIOS Y CAMBIOS DE CÓDIGO

Los repositorios deberán protegerse mediante medidas como:

a. Acceso limitado.
b. Historial de cambios.
c. Confirmaciones identificables.
d. Revisión antes de producción.
e. Protección de ramas cuando resulte apropiado.
f. Recuperación de versiones anteriores.
g. Exclusión de credenciales.
h. Revisión de archivos sensibles.
i. Control sobre colaboradores.
j. Monitoreo de cambios inesperados.

23. BASES DE DATOS

Las bases de datos deberán aplicar, según corresponda:

a. Autenticación.
b. Políticas de acceso.
c. Seguridad por filas.
d. Permisos por rol.
e. Validación de identificadores.
f. Restricción de operaciones anónimas.
g. Copias de seguridad.
h. Registros de actividad.
i. Separación entre datos públicos y privados.
j. Protección de campos sensibles.
k. Revisión de consultas administrativas.
l. Prevención de acceso cruzado entre usuarios.

24. SEGURIDAD POR FILAS Y AUTORIZACIÓN

Cuando se utilicen políticas de seguridad por filas, estas deberán procurar que:

a. Un usuario acceda solamente a sus propios datos.
b. Un organizador acceda solamente a la información autorizada.
c. Un administrador tenga los permisos necesarios y no más.
d. Los identificadores de autenticación sean verificados.
e. Las operaciones de inserción, consulta, actualización y eliminación estén controladas.
f. Las políticas se prueben antes de su publicación.

25. VALIDACIÓN DE OPERACIONES SENSIBLES

Las operaciones sensibles podrán requerir:

a. Sesión activa.
b. Contraseña actual.
c. Autenticación multifactor.
d. Código enviado al usuario.
e. Confirmación adicional.
f. Revisión administrativa.
g. Validación del identificador de autenticación.
h. Registro del cambio.
i. Notificación al usuario.
j. Periodo de seguridad.

26. PAGOS Y DATOS FINANCIEROS

Los pagos podrán ser procesados por proveedores especializados.

MASS procurará:

a. No almacenar números completos de tarjetas cuando no sea necesario.
b. Utilizar conexiones protegidas.
c. Limitar información financiera visible.
d. Mantener registros de transacciones.
e. Detectar operaciones sospechosas.
f. Separar saldos cuando el servicio lo requiera.
g. Proteger reembolsos y aprobaciones.
h. Aplicar permisos administrativos.
i. Conservar evidencia de operaciones.
j. Cumplir requisitos del proveedor de pagos.

27. SEGURIDAD DE MASS CASH Y SALDOS

Los sistemas de saldo, recarga, beneficio, premio o crédito deberán procurar:

a. Registrar cada movimiento.
b. Identificar al usuario.
c. Identificar al organizador.
d. Evitar dobles acreditaciones.
e. Evitar uso cruzado no autorizado.
f. Registrar aprobaciones.
g. Limitar modificaciones manuales.
h. Mantener historial.
i. Revisar inconsistencias.
j. Permitir correcciones documentadas.

28. PROVEEDORES

Antes de confiar datos o funciones importantes a un proveedor, MASS podrá evaluar:

a. Reputación.
b. Medidas de seguridad.
c. Controles de acceso.
d. Cifrado.
e. Ubicación de datos.
f. Respuesta a incidentes.
g. Disponibilidad.
h. Subcontratistas.
i. Políticas de privacidad.
j. Historial conocido.
k. Capacidad técnica.
l. Condiciones contractuales.
m. Métodos de eliminación.
n. Obligaciones de notificación.

29. CONTRATOS CON PROVEEDORES

Cuando resulte apropiado, los contratos deberán incluir obligaciones relacionadas con:

a. Confidencialidad.
b. Seguridad razonable.
c. Uso limitado de datos.
d. Acceso autorizado.
e. Notificación de incidentes.
f. Cooperación en investigaciones.
g. Eliminación o devolución de información.
h. Cumplimiento legal.
i. Subcontratación.
j. Auditoría o evidencia de cumplimiento.
k. Continuidad.
l. Terminación del servicio.

30. REGISTROS DE SEGURIDAD

MASS podrá conservar registros relacionados con:

a. Inicio de sesión.
b. Cierre de sesión.
c. Cambios de contraseña.
d. Cambios de correo.
e. Cambios de teléfono.
f. Autenticación multifactor.
g. Modificación de permisos.
h. Acciones administrativas.
i. Operaciones financieras.
j. Errores.
k. Eventos de seguridad.
l. Accesos sospechosos.
m. Creación o eliminación de registros.
n. Actividad de proveedores.

Los registros deberán protegerse contra alteraciones y accesos no autorizados.

31. MONITOREO

MASS podrá utilizar monitoreo razonable para:

a. Detectar errores.
b. Identificar patrones sospechosos.
c. Prevenir fraude.
d. Proteger disponibilidad.
e. Detectar accesos no autorizados.
f. Investigar incidentes.
g. Mejorar rendimiento.
h. Verificar integraciones.
i. Revisar cambios administrativos.
j. Confirmar funcionamiento de controles.

El monitoreo deberá respetar la legislación y las políticas de privacidad aplicables.

32. DETECCIÓN DE FRAUDE

Las señales de riesgo podrán incluir:

a. Intentos repetidos de acceso.
b. Cambios repentinos de credenciales.
c. Dispositivos desconocidos.
d. Ubicaciones incompatibles.
e. Operaciones duplicadas.
f. Uso anormal de saldo.
g. Múltiples cuentas relacionadas.
h. Documentos inconsistentes.
i. Suplantación.
j. Manipulación de solicitudes.
k. Actividad automatizada.
l. Uso indebido de privilegios.

MASS podrá limitar temporalmente una cuenta mientras investiga.

33. VULNERABILIDADES

MASS procurará:

a. Recibir reportes de vulnerabilidades.
b. Evaluar su gravedad.
c. Priorizar riesgos críticos.
d. Aplicar correcciones.
e. Actualizar componentes.
f. Mitigar riesgos no corregibles inmediatamente.
g. Documentar decisiones.
h. Verificar la corrección.
i. Revisar exposición.
j. Coordinar con proveedores.

Los detalles que puedan facilitar ataques podrán mantenerse confidenciales mientras exista riesgo.

34. ACTUALIZACIONES Y PARCHES

Los sistemas y componentes deberán actualizarse conforme al riesgo.

La prioridad podrá considerar:

a. Gravedad de la vulnerabilidad.
b. Exposición pública.
c. Existencia de ataques activos.
d. Sensibilidad de los datos.
e. Importancia del sistema.
f. Compatibilidad.
g. Disponibilidad de corrección.
h. Riesgo de interrupción.
i. Medidas temporales existentes.

35. COPIAS DE SEGURIDAD

MASS procurará mantener copias de seguridad razonables para información y sistemas críticos.

Las copias podrán:

a. Crearse periódicamente.
b. Conservarse separadas.
c. Protegerse mediante controles de acceso.
d. Cifrarse cuando corresponda.
e. Probarse.
f. Mantener versiones.
g. Eliminarse conforme a los periodos aplicables.
h. Utilizarse para restauración.
i. Excluir información innecesaria.
j. Mantener registros de su ejecución.

36. CONTINUIDAD Y RECUPERACIÓN

MASS podrá preparar procedimientos para:

a. Restaurar bases de datos.
b. Recuperar código.
c. Cambiar proveedores.
d. Reanudar autenticación.
e. Mantener comunicaciones.
f. Preservar evidencia.
g. Priorizar servicios críticos.
h. Operar temporalmente con funciones limitadas.
i. Validar integridad después de la recuperación.
j. Informar interrupciones importantes.

37. DISPONIBILIDAD

MASS no garantiza funcionamiento ininterrumpido.

Los servicios podrán limitarse o suspenderse por:

a. Mantenimiento.
b. Actualizaciones.
c. Fallas de red.
d. Incidentes.
e. Ataques.
f. Problemas de proveedores.
g. Cambios legales.
h. Emergencias.
i. Desastres.
j. Protección de usuarios.

MASS procurará restaurar las operaciones de manera razonable y segura.

38. RESPUESTA A INCIDENTES

Cuando exista un incidente real o sospechado, MASS podrá:

a. Identificarlo.
b. Clasificarlo.
c. Contenerlo.
d. Preservar evidencia.
e. Revocar credenciales.
f. Cerrar sesiones.
g. Limitar sistemas.
h. Cambiar configuraciones.
i. Corregir vulnerabilidades.
j. Restaurar información.
k. Coordinar con proveedores.
l. Obtener apoyo profesional.
m. Notificar a personas afectadas.
n. Notificar a autoridades.
o. Documentar decisiones.
p. Revisar causas.
q. Mejorar controles.

39. EQUIPO DE RESPUESTA

La respuesta podrá involucrar:

a. Dirección.
b. Personal técnico.
c. Responsable de seguridad.
d. Asesor jurídico.
e. Proveedor de infraestructura.
f. Proveedor de autenticación.
g. Procesador de pagos.
h. Especialistas forenses.
i. Aseguradora.
j. Autoridades.
k. Personal de comunicaciones.
l. Responsables del servicio afectado.

40. NOTIFICACIÓN DE INCIDENTES

MASS realizará notificaciones cuando sean exigidas por la legislación aplicable.

Las notificaciones podrán incluir, cuando corresponda:

a. Naturaleza del incidente.
b. Categorías de información afectada.
c. Fecha o periodo aproximado.
d. Medidas adoptadas.
e. Recomendaciones de protección.
f. Canales de contacto.
g. Información exigida por autoridades.
h. Recursos disponibles.
i. Actualizaciones posteriores.

Una investigación podrá continuar después de la primera notificación.

41. INVESTIGACIÓN

MASS podrá investigar:

a. Registros de acceso.
b. Cambios administrativos.
c. Sistemas afectados.
d. Dispositivos relacionados.
e. Cuentas vinculadas.
f. Proveedores.
g. Transacciones.
h. Direcciones de red.
i. Evidencia proporcionada por usuarios.
j. Comunicaciones relacionadas.
k. Historial de versiones.
l. Configuraciones.

La investigación deberá limitarse a fines legítimos de seguridad, cumplimiento y protección.

42. CONSERVACIÓN DE EVIDENCIA

MASS podrá conservar evidencia relacionada con un incidente durante el periodo necesario para:

a. Investigar.
b. Cumplir la ley.
c. Cooperar con autoridades.
d. Resolver disputas.
e. Defender derechos.
f. Presentar reclamaciones.
g. Aplicar contratos.
h. Mejorar controles.

43. REPORTE POR USUARIOS

Los usuarios deberán reportar de manera inmediata:

a. Accesos no reconocidos.
b. Pérdida de dispositivo.
c. Robo de credenciales.
d. Mensajes sospechosos.
e. Suplantación.
f. Transacciones desconocidas.
g. Vulnerabilidades.
h. Exposición de datos.
i. Uso indebido de una cuenta.
j. Actividad administrativa no autorizada.

Los reportes deberán enviarse mediante los canales oficiales publicados por MASS.

44. PROHIBICIONES

Queda prohibido:

a. Intentar acceder a cuentas ajenas.
b. Compartir credenciales administrativas.
c. Evadir controles.
d. Probar vulnerabilidades sin autorización.
e. Interceptar comunicaciones.
f. Extraer datos masivamente.
g. Instalar código malicioso.
h. Manipular saldos.
i. Alterar registros.
j. Suplantar identidades.
k. Crear cuentas fraudulentas.
l. Utilizar automatización dañina.
m. Publicar secretos.
n. Interferir con la disponibilidad.
o. Utilizar información obtenida por error.
p. Ayudar a terceros a realizar actividades prohibidas.

45. INGENIERÍA SOCIAL

MASS nunca deberá solicitar que un usuario comparta públicamente:

a. Contraseña.
b. Código completo de autenticación.
c. PIN de seguridad.
d. Llave privada.
e. Token administrativo.
f. Código de recuperación.
g. Número completo de tarjeta.

Los usuarios deberán desconfiar de mensajes que generen urgencia, soliciten credenciales o utilicen enlaces no verificados.

46. CORREO, SMS Y NOTIFICACIONES

Las comunicaciones de seguridad podrán utilizar correo, SMS, notificaciones o mensajes dentro de MASS.

El usuario deberá:

a. Verificar el remitente.
b. Evitar enlaces sospechosos.
c. No responder con credenciales.
d. Confirmar cambios desde la aplicación oficial.
e. Reportar mensajes falsos.
f. Mantener sus medios de contacto actualizados.

47. DATOS BIOMÉTRICOS

Cuando MASS utilice funciones biométricas deberá:

a. Proporcionar aviso.
b. Obtener los consentimientos requeridos.
c. Limitar el propósito.
d. Restringir el acceso.
e. Proteger las plantillas.
f. Establecer periodos de conservación.
g. Aplicar procedimientos de eliminación.
h. Supervisar proveedores.
i. Cumplir la legislación aplicable.

MASS no venderá ni comercializará identificadores biométricos.

48. SEGURIDAD DE MENORES

Los servicios destinados a menores deberán incorporar protecciones reforzadas, incluyendo cuando corresponda:

a. Consentimiento parental verificable.
b. Recopilación limitada.
c. Controles de contacto.
d. Restricciones de publicación.
e. Acceso parental.
f. Eliminación.
g. Moderación.
h. Protección contra perfilamiento indebido.
i. Verificación apropiada.
j. Diseño adecuado para la edad.

49. CAPACITACIÓN

Las personas con acceso administrativo o técnico deberán recibir orientación apropiada sobre:

a. Protección de credenciales.
b. Phishing.
c. Ingeniería social.
d. Privacidad.
e. Manejo de datos.
f. Reporte de incidentes.
g. Uso de dispositivos.
h. Seguridad de proveedores.
i. Cambios de código.
j. Permisos.
k. Obligaciones legales.
l. Fraude.

50. AUDITORÍAS Y REVISIONES

MASS podrá realizar:

a. Revisiones internas.
b. Verificación de permisos.
c. Revisión de políticas.
d. Evaluaciones de proveedores.
e. Pruebas de recuperación.
f. Revisión de incidentes.
g. Análisis de registros.
h. Evaluaciones técnicas.
i. Pruebas autorizadas.
j. Revisión de prácticas reales.

Las revisiones deberán priorizar los sistemas y datos de mayor riesgo.

51. EXCEPCIONES

Una excepción a esta Política deberá:

a. Tener una justificación.
b. Identificar el riesgo.
c. Ser aprobada por una persona autorizada.
d. Incluir controles compensatorios cuando sea posible.
e. Tener duración limitada.
f. Revisarse periódicamente.
g. Revocarse cuando deje de ser necesaria.

52. MEDIDAS DE PROTECCIÓN DE CUENTA

MASS podrá proteger una cuenta mediante:

a. Suspensión temporal.
b. Cierre de sesiones.
c. Cambio obligatorio de contraseña.
d. Revocación de permisos.
e. Verificación adicional.
f. Limitación de transacciones.
g. Congelamiento de funciones.
h. Revisión administrativa.
i. Notificación.
j. Cierre definitivo en casos graves.

53. APLICACIÓN

El incumplimiento de esta Política podrá producir:

a. Advertencia.
b. Limitación.
c. Suspensión.
d. Revocación de rol.
e. Terminación de acceso.
f. Cancelación de una integración.
g. Retención de evidencia.
h. Reclamación contractual.
i. Reporte a autoridades.
j. Acción legal.

La medida dependerá de la gravedad, intención, daño, reincidencia y obligaciones aplicables.

54. COOPERACIÓN CON AUTORIDADES

MASS podrá cooperar con autoridades cuando:

a. Exista una obligación legal.
b. Se reciba una solicitud válida.
c. Sea necesario proteger a una persona.
d. Exista fraude.
e. Exista robo de identidad.
f. Exista actividad criminal.
g. Sea necesario defender derechos.

MASS procurará limitar cualquier divulgación a la información razonablemente necesaria.

55. CAMBIOS A LA POLÍTICA

Esta Política podrá actualizarse por:

a. Cambios tecnológicos.
b. Nuevas amenazas.
c. Nuevas leyes.
d. Nuevos servicios.
e. Nuevos proveedores.
f. Incidentes.
g. Auditorías.
h. Cambios empresariales.
i. Correcciones.
j. Mejoras operativas.

Cada versión deberá conservar su identificación, estado y fecha de vigencia.

56. RELACIÓN CON OTROS DOCUMENTOS

Esta Política deberá interpretarse junto con:

a. MASS-LC-000, Gobernanza del Centro Legal.
b. MASS-LC-001, Definiciones legales.
c. MASS-LC-002, Acuerdo de usuario MASS ID.
d. MASS-LC-003, Aviso de privacidad.
e. MASS-LC-005, Política de cookies.
f. MASS-LC-006, Política de inteligencia artificial.
g. MASS-LC-007, Política de pagos.
h. MASS-LC-008, Política de reembolsos.
i. MASS-LC-009, Política antifraude.
j. MASS-LC-010, Normas de la comunidad.
k. Políticas específicas de cada servicio.

57. CONFLICTOS

En caso de conflicto se aplicará, salvo disposición legal distinta:

a. Legislación obligatoria.
b. Requisitos regulatorios.
c. Política específica del servicio.
d. Esta Política de seguridad.
e. Acuerdo de usuario MASS ID.
f. Definiciones generales del MASS ID Legal Center.

58. CONTACTO DE SEGURIDAD

Antes de la publicación definitiva deberán incorporarse:

a. Correo oficial de seguridad.
b. Canal para reportar vulnerabilidades.
c. Canal para reportar fraude.
d. Canal para reportar incidentes.
e. Dirección postal oficial.
f. Información necesaria para avisos legales.
g. Procedimiento para emergencias.
h. Procedimiento de escalamiento.

59. ADMINISTRACIÓN CONTINUA

MASS-LC-004 será administrado como un documento evolutivo del MASS ID Legal Center.

Su contenido deberá revisarse cuando cambien los sistemas, amenazas, proveedores, prácticas reales, obligaciones legales o medidas de protección del ecosistema MASS.

FIN DEL DOCUMENTO MASS-LC-004
`
},
    {
  codigo: "MASS-LC-005",
  titulo: "Política de cookies",
  descripcion:
    "Explica el uso de cookies, almacenamiento local y tecnologías relacionadas.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-005
POLÍTICA DE COOKIES Y TECNOLOGÍAS RELACIONADAS DE MASS ID

Versión: 1.0
Estado: En revisión
Fecha de vigencia: Pendiente de publicación
Administrado por: TE-TO-KA SOLUTIONS® LLC

AVISO IMPORTANTE

Esta Política explica cómo TE-TO-KA SOLUTIONS® LLC podrá utilizar cookies, almacenamiento local, identificadores de sesión, píxeles, caché, registros técnicos, identificadores de dispositivos, kits de desarrollo y otras tecnologías semejantes dentro de MASS ID y del ecosistema MASS.

Esta Política deberá leerse junto con:

a. MASS-LC-002, Acuerdo de usuario MASS ID.
b. MASS-LC-003, Aviso de privacidad.
c. MASS-LC-004, Política de seguridad.
d. Las políticas específicas de cada servicio.
e. Los avisos de consentimiento que aparezcan en un sitio, aplicación o dispositivo.

1. PROPÓSITO

Esta Política tiene como propósito:

a. Explicar qué son estas tecnologías.
b. Identificar sus categorías principales.
c. Informar por qué pueden utilizarse.
d. Explicar las opciones del usuario.
e. Proteger la seguridad de MASS ID.
f. Mantener preferencias autorizadas.
g. Cumplir obligaciones legales.
h. Proporcionar transparencia.
i. Evitar tecnologías innecesarias.
j. Mantener un inventario actualizado antes de la publicación definitiva.

2. ALCANCE

Esta Política se aplica, según corresponda, a:

a. MASS ID.
b. TE-TO-KA MASS.
c. MASS Sorteos Pro.
d. MASS Ruta.
e. MASS Cash.
f. MASS VPN.
g. MASS Learn.
h. MASS TV.
i. MASS Face ID.
j. Central IA.
k. TOKAYO IA.
l. Sitios web MASS.
m. Aplicaciones móviles.
n. Aplicaciones para computadoras.
o. Paneles administrativos.
p. Portales para organizadores.
q. Servicios conectados.
r. Productos futuros integrados con MASS ID.

3. DEFINICIÓN DE COOKIE

Una cookie es un archivo o identificador que un sitio web puede guardar en un navegador o dispositivo para reconocer una sesión, recordar información o permitir determinadas funciones.

Dependiendo de su diseño, una cookie puede conservar:

a. Un identificador aleatorio.
b. Estado de sesión.
c. Preferencias.
d. Opciones de idioma.
e. Configuración de seguridad.
f. Información técnica.
g. Actividad dentro del servicio.
h. Consentimientos.
i. Información necesaria para una compra o solicitud.

4. TECNOLOGÍAS RELACIONADAS

Esta Política también cubre tecnologías que almacenan información o acceden a información almacenada en un dispositivo, incluyendo:

a. Local Storage.
b. Session Storage.
c. IndexedDB.
d. Caché del navegador.
e. Service Workers.
f. Píxeles.
g. Balizas web.
h. Etiquetas.
i. Scripts.
j. Identificadores de dispositivo.
k. Identificadores publicitarios.
l. Kits de desarrollo de software.
m. Enlaces con parámetros.
n. Huellas técnicas del navegador.
o. Almacenamiento dentro de aplicaciones.
p. Tokens de autenticación.
q. Tecnologías futuras con funciones semejantes.

5. COOKIES PROPIAS

Las cookies propias son establecidas directamente por un sitio, aplicación o dominio administrado por MASS.

Podrán utilizarse para:

a. Mantener una sesión.
b. Recordar preferencias.
c. Proteger una cuenta.
d. Completar una operación.
e. Mantener el funcionamiento del servicio.
f. Registrar una elección de privacidad.
g. Evitar solicitudes repetidas.
h. Conservar temporalmente información necesaria.

6. COOKIES DE TERCEROS

Las cookies de terceros pueden ser establecidas por proveedores integrados con MASS.

Estos proveedores podrán apoyar funciones como:

a. Autenticación.
b. Bases de datos.
c. Pagos.
d. Mapas.
e. Mensajería.
f. Notificaciones.
g. Soporte.
h. Prevención de fraude.
i. Seguridad.
j. Análisis técnico.
k. Contenido multimedia.
l. Servicios de inteligencia artificial.

Antes de la publicación definitiva deberá identificarse cada proveedor que realmente coloque o utilice estas tecnologías.

7. COOKIES DE SESIÓN

Las cookies de sesión normalmente existen durante una visita o sesión activa.

Podrán utilizarse para:

a. Navegación.
b. Autenticación temporal.
c. Seguridad.
d. Conservación de formularios.
e. Procesamiento de una solicitud.
f. Prevención de operaciones duplicadas.
g. Continuidad entre páginas.
h. Confirmación temporal de permisos.

Podrán eliminarse cuando termine la sesión, expire el tiempo establecido o se cierre el navegador, dependiendo de la tecnología utilizada.

8. COOKIES PERSISTENTES

Las cookies persistentes pueden permanecer durante un periodo determinado después de terminar una sesión.

Podrán utilizarse para:

a. Recordar preferencias.
b. Mantener una sesión autorizada.
c. Reconocer un dispositivo.
d. Conservar una elección de privacidad.
e. Recordar idioma o región.
f. Facilitar accesos futuros.
g. Aplicar medidas antifraude.
h. Medir funcionamiento durante un periodo.

Cada cookie persistente deberá tener una duración razonable y proporcional a su propósito.

9. TECNOLOGÍAS ESTRICTAMENTE NECESARIAS

Las tecnologías estrictamente necesarias permiten proporcionar una función solicitada o mantener la seguridad esencial del servicio.

Podrán utilizarse para:

a. Iniciar sesión.
b. Mantener autenticación.
c. Proteger formularios.
d. Prevenir ataques.
e. Distribuir tráfico.
f. Recordar artículos o números seleccionados.
g. Procesar una compra.
h. Conservar una solicitud activa.
i. Aplicar preferencias de privacidad.
j. Prevenir operaciones duplicadas.
k. Proteger pagos.
l. Cumplir funciones esenciales.

Estas tecnologías podrían no poder desactivarse desde MASS cuando sean indispensables para prestar el servicio solicitado.

10. AUTENTICACIÓN Y SESIONES

MASS podrá utilizar identificadores o almacenamiento para:

a. Reconocer una sesión autenticada.
b. Mantener al usuario conectado.
c. Renovar credenciales autorizadas.
d. Detectar sesiones vencidas.
e. Identificar dispositivos conectados.
f. Cerrar sesiones.
g. Aplicar autenticación multifactor.
h. Evitar suplantación.
i. Proteger cambios de correo, teléfono o contraseña.
j. Confirmar el identificador interno de autenticación.

Los tokens y credenciales deberán protegerse mediante controles razonables.

11. SEGURIDAD

Las tecnologías de seguridad podrán apoyar:

a. Detección de actividad sospechosa.
b. Prevención de fraude.
c. Protección contra solicitudes automatizadas.
d. Control de intentos de acceso.
e. Identificación de sesiones anormales.
f. Validación de integridad.
g. Protección contra falsificación de solicitudes.
h. Registro de errores.
i. Protección de paneles administrativos.
j. Investigación de incidentes.

12. PREFERENCIAS

MASS podrá conservar preferencias relacionadas con:

a. Idioma.
b. Apariencia.
c. Privacidad.
d. Personalización.
e. Notificaciones.
f. Promociones.
g. Perfil visible.
h. Mostrar teléfono.
i. Mostrar correo.
j. Organización seleccionada.
k. Servicio seleccionado.
l. Accesibilidad.
m. Consentimientos.

13. FUNCIONALIDAD

Las tecnologías funcionales podrán facilitar:

a. Navegación.
b. Formularios.
c. Direcciones guardadas.
d. Selección de números.
e. Carritos.
f. Historial visible.
g. Paneles personalizados.
h. Preferencias de organizadores.
i. Reproducción multimedia.
j. Integraciones de soporte.
k. Recuperación de estados temporales.
l. Funciones solicitadas por el usuario.

14. ALMACENAMIENTO LOCAL

MASS podrá utilizar almacenamiento local para conservar información directamente en el navegador o aplicación.

Esta información podrá incluir:

a. Preferencias.
b. Identificadores de sesión.
c. Datos temporales de navegación.
d. Estado de una función.
e. Selecciones pendientes.
f. Configuración de privacidad.
g. Información necesaria para cargar un módulo.
h. Identificadores técnicos.
i. Confirmaciones de interfaz.
j. Datos utilizados para mantener continuidad.

El almacenamiento local podrá permanecer hasta que sea eliminado por MASS, el usuario, el navegador, la aplicación o el dispositivo.

15. ALMACENAMIENTO DE SESIÓN

El almacenamiento de sesión podrá conservar información temporal mientras una pestaña, ventana o sesión permanezca activa.

Podrá utilizarse para:

a. Formularios incompletos.
b. Navegación temporal.
c. Confirmaciones.
d. Estados de autenticación.
e. Prevención de repeticiones.
f. Datos necesarios entre pantallas.
g. Procesos de verificación.

16. INDEXEDDB Y BASES LOCALES

Algunas aplicaciones podrán utilizar bases de datos locales para:

a. Funcionamiento sin conexión.
b. Caché de información.
c. Sincronización.
d. Rendimiento.
e. Conservación temporal de archivos.
f. Recuperación de una operación.
g. Reducción de transferencias repetidas.

La información sensible deberá limitarse y protegerse conforme al riesgo.

17. CACHÉ

La caché permite conservar temporalmente archivos o respuestas para cargar un servicio con mayor rapidez.

Podrá incluir:

a. Hojas de estilo.
b. Archivos JavaScript.
c. Imágenes.
d. Fuentes.
e. Interfaces.
f. Respuestas temporales.
g. Recursos de una aplicación.
h. Contenido necesario para funcionamiento sin conexión.

La caché no deberá utilizarse intencionalmente para evadir las preferencias de privacidad del usuario.

18. SERVICE WORKERS

Los Service Workers podrán utilizarse para:

a. Cargar aplicaciones.
b. Proporcionar funciones sin conexión.
c. Administrar caché.
d. Recibir notificaciones.
e. Sincronizar información.
f. Mejorar rendimiento.
g. Mantener ciertas funciones web instalables.

El usuario podrá eliminar estas tecnologías mediante los controles del navegador o de la aplicación.

19. ANÁLISIS Y RENDIMIENTO

Conforme a las preferencias y leyes aplicables, MASS podrá utilizar tecnologías de análisis para:

a. Medir visitas.
b. Identificar páginas utilizadas.
c. Detectar errores.
d. Analizar tiempos de carga.
e. Evaluar funcionamiento.
f. Conocer tipos generales de dispositivos.
g. Mejorar accesibilidad.
h. Medir adopción de funciones.
i. Identificar problemas de navegación.
j. Generar estadísticas agregadas.

Cuando sea posible, MASS procurará limitar, agregar o desidentificar la información utilizada para análisis.

20. PÍXELES Y BALIZAS

Un píxel o baliza puede registrar que una página, mensaje o elemento fue cargado.

Podrá utilizarse para:

a. Confirmar entrega de comunicaciones.
b. Medir interacción.
c. Detectar errores.
d. Prevenir fraude.
e. Generar estadísticas.
f. Evaluar campañas autorizadas.
g. Confirmar funcionamiento técnico.

Las funciones promocionales deberán respetar las preferencias del usuario.

21. PUBLICIDAD Y PROMOCIONES

MASS no deberá activar tecnologías de publicidad dirigida sin las divulgaciones, elecciones y autorizaciones requeridas.

Cuando se implementen, estas tecnologías podrán utilizarse para:

a. Medir campañas.
b. Evitar mostrar repetidamente un anuncio.
c. Mostrar promociones autorizadas.
d. Calcular conversiones.
e. Limitar fraude publicitario.
f. Personalizar contenido cuando exista autorización.

Antes de su uso deberán identificarse los proveedores, propósitos, datos y periodos de conservación correspondientes.

22. REDES SOCIALES

Las funciones de redes sociales podrán permitir:

a. Compartir contenido.
b. Abrir una página externa.
c. Reproducir contenido.
d. Mostrar publicaciones.
e. Autenticarse mediante un tercero.

El tercero podrá recopilar información conforme a su propia política, incluso cuando el usuario tenga una cuenta activa con dicho proveedor.

23. PAGOS

Los proveedores de pagos podrán utilizar tecnologías para:

a. Procesar transacciones.
b. Prevenir fraude.
c. Recordar un método autorizado.
d. Mantener seguridad.
e. Confirmar estados.
f. Cumplir obligaciones financieras.
g. Resolver disputas.
h. Aplicar controles regulatorios.

MASS no deberá controlar las tecnologías establecidas directamente por un proveedor independiente fuera de sus propios servicios.

24. MAPAS Y UBICACIÓN

Las integraciones de mapas podrán utilizar tecnologías para:

a. Mostrar direcciones.
b. Calcular rutas.
c. Conservar una ubicación temporal.
d. Coordinar servicios.
e. Mostrar puntos cercanos.
f. Recordar preferencias de mapas.
g. Proteger operaciones.

La ubicación precisa requerirá los permisos y autorizaciones aplicables.

25. NOTIFICACIONES Y MENSAJERÍA

Las tecnologías relacionadas con notificaciones podrán:

a. Registrar un dispositivo.
b. Entregar mensajes.
c. Confirmar recepción.
d. Mantener preferencias.
e. Identificar una suscripción.
f. Proteger contra envíos no autorizados.
g. Administrar alertas esenciales.
h. Medir funcionamiento técnico.

26. INTELIGENCIA ARTIFICIAL

Las funciones de inteligencia artificial podrán utilizar almacenamiento o identificadores técnicos para:

a. Mantener una conversación.
b. Conservar contexto autorizado.
c. Aplicar preferencias.
d. Prevenir abuso.
e. Limitar solicitudes automatizadas.
f. Medir rendimiento.
g. Proteger sistemas.
h. Mejorar respuestas.

El tratamiento de información mediante inteligencia artificial también estará sujeto a MASS-LC-006.

27. IDENTIFICADORES DE DISPOSITIVOS

Las aplicaciones podrán recibir o generar identificadores relacionados con:

a. Instalación.
b. Dispositivo.
c. Navegador.
d. Suscripción de notificación.
e. Sesión.
f. Seguridad.
g. Prevención de fraude.
h. Configuración.

MASS procurará no utilizar identificadores permanentes cuando un identificador temporal sea suficiente.

28. KITS DE DESARROLLO

Las aplicaciones podrán integrar kits de desarrollo proporcionados por terceros.

Estos kits podrán apoyar:

a. Autenticación.
b. Pagos.
c. Notificaciones.
d. Mapas.
e. Análisis.
f. Seguridad.
g. Soporte.
h. Multimedia.
i. Inteligencia artificial.
j. Redes sociales.

Antes de la publicación deberá verificarse qué información recibe cada kit y si utiliza almacenamiento o seguimiento.

29. HUELLA DIGITAL DEL DISPOSITIVO

La huella digital puede combinar características técnicas para diferenciar un navegador o dispositivo.

MASS no deberá utilizar huellas digitales para seguimiento oculto o publicidad dirigida sin una base legal, aviso y elección apropiados.

Podrá utilizar señales técnicas limitadas para:

a. Seguridad.
b. Prevención de fraude.
c. Detección de automatización maliciosa.
d. Protección contra abuso.
e. Investigación de incidentes.

30. INFORMACIÓN RECOPILADA

Estas tecnologías podrán recopilar o generar:

a. Identificador de sesión.
b. Dirección IP.
c. Fecha y hora.
d. Navegador.
e. Sistema operativo.
f. Tipo de dispositivo.
g. Página o función utilizada.
h. Fuente de navegación.
i. Errores.
j. Preferencias.
k. Idioma.
l. Región aproximada.
m. Interacción con comunicaciones.
n. Estado de autenticación.
o. Identificadores técnicos.
p. Información de seguridad.
q. Consentimientos.

31. CONSENTIMIENTO

Cuando la legislación lo requiera, MASS solicitará consentimiento antes de activar tecnologías no esenciales.

El consentimiento deberá procurar ser:

a. Informado.
b. Específico.
c. Libre.
d. Comprensible.
e. Otorgado mediante una acción afirmativa.
f. Retirable.
g. Registrado cuando corresponda.

No se considerará consentimiento válido el silencio cuando la ley exija una elección activa.

32. PANEL DE PREFERENCIAS

Cuando resulte necesario, MASS podrá ofrecer controles para:

a. Aceptar todas las categorías autorizables.
b. Rechazar tecnologías no esenciales.
c. Elegir categorías.
d. Cambiar una decisión.
e. Retirar consentimiento.
f. Consultar proveedores.
g. Consultar propósitos.
h. Conocer periodos aproximados.

Las tecnologías estrictamente necesarias podrán permanecer activas cuando sean indispensables.

33. CAMBIO DE PREFERENCIAS

El usuario podrá cambiar sus preferencias mediante:

a. MASS ID.
b. Un panel de cookies.
c. Configuración del navegador.
d. Configuración del dispositivo.
e. Configuración de la aplicación.
f. Un enlace publicado.
g. Un canal oficial de privacidad.

Un cambio podrá aplicarse únicamente al navegador, dispositivo o cuenta donde fue realizado, dependiendo de la tecnología.

34. CONTROLES DEL NAVEGADOR

La mayoría de los navegadores permiten:

a. Consultar cookies.
b. Eliminar cookies.
c. Bloquear cookies.
d. Limitar cookies de terceros.
e. Eliminar almacenamiento local.
f. Borrar caché.
g. Desactivar permisos.
h. Administrar notificaciones.
i. Navegar en modo privado.

Bloquear tecnologías necesarias puede impedir que algunas funciones trabajen correctamente.

35. GLOBAL PRIVACY CONTROL

Cuando resulte legalmente obligatorio y técnicamente aplicable, MASS deberá reconocer una señal válida de Global Privacy Control como una solicitud de exclusión respecto de la venta o intercambio de datos personales cubiertos por la ley correspondiente.

Una señal podrá aplicarse al navegador o dispositivo desde el cual se reciba.

Cuando el usuario esté autenticado y la legislación lo requiera, MASS deberá evaluar si la elección también debe asociarse con la cuenta.

36. DO NOT TRACK

Algunos navegadores transmiten una señal denominada Do Not Track.

Debido a que esta señal no tiene una interpretación técnica uniforme en todas las jurisdicciones, MASS podrá no responder a ella de manera independiente, salvo cuando exista una obligación aplicable.

Esto no limita el reconocimiento de Global Privacy Control u otras señales legalmente válidas.

37. VENTA O INTERCAMBIO DE DATOS

Conforme a las prácticas actuales declaradas en el Aviso de privacidad, MASS no vende datos personales, datos sensibles ni datos biométricos.

Si una futura integración se considerara venta o intercambio conforme a una legislación aplicable, MASS deberá:

a. Actualizar sus avisos.
b. Proporcionar opciones de exclusión.
c. Respetar señales legalmente válidas.
d. Obtener consentimiento cuando sea necesario.
e. Actualizar esta Política.
f. Identificar a los terceros participantes.

38. MENORES

Las tecnologías utilizadas en servicios destinados a menores deberán aplicar medidas reforzadas.

Cuando corresponda, MASS deberá:

a. Obtener consentimiento parental verificable.
b. Limitar seguimiento.
c. Evitar publicidad conductual prohibida.
d. Minimizar datos.
e. Proteger identificadores.
f. Proporcionar controles parentales.
g. Eliminar información conforme a solicitudes válidas.
h. Respetar restricciones de edad.
i. Evaluar proveedores.

39. TERCEROS

Los terceros podrán administrar sus propias tecnologías conforme a sus políticas.

MASS procurará:

a. Identificar proveedores.
b. Revisar sus propósitos.
c. Limitar información.
d. Celebrar contratos apropiados.
e. Evaluar seguridad.
f. Desactivar integraciones innecesarias.
g. Mantener vínculos a políticas aplicables.
h. Revisar cambios importantes.

40. CONSERVACIÓN

Las cookies y tecnologías relacionadas deberán conservarse solamente durante el tiempo razonablemente necesario para su propósito.

Los periodos podrán depender de:

a. Tipo de tecnología.
b. Función.
c. Seguridad.
d. Elección del usuario.
e. Duración de la sesión.
f. Obligación legal.
g. Configuración del proveedor.
h. Prevención de fraude.
i. Necesidad operativa.

Antes de la publicación definitiva deberá incorporarse un inventario con periodos específicos cuando corresponda.

41. SEGURIDAD

MASS procurará proteger estas tecnologías mediante:

a. Atributos seguros.
b. Restricciones de acceso.
c. Cifrado en tránsito.
d. Límites de duración.
e. Renovación de identificadores.
f. Revocación.
g. Separación por entorno.
h. Validación de sesiones.
i. Prevención de scripts no autorizados.
j. Revisión de proveedores.
k. Configuración apropiada de dominios.
l. Protección contra acceso cruzado.

42. INCIDENTES

Si una cookie, token o tecnología relacionada fuera comprometida, MASS podrá:

a. Revocarla.
b. Cerrar sesiones.
c. Cambiar credenciales.
d. Bloquear dispositivos.
e. Investigar registros.
f. Corregir configuraciones.
g. Suspender integraciones.
h. Notificar a usuarios.
i. Notificar a autoridades.
j. Exigir nueva autenticación.

43. DERECHOS DE PRIVACIDAD

Dependiendo de la jurisdicción, el usuario podrá ejercer derechos relacionados con datos obtenidos mediante estas tecnologías, incluyendo:

a. Acceso.
b. Corrección.
c. Eliminación.
d. Portabilidad.
e. Retiro de consentimiento.
f. Exclusión de publicidad dirigida.
g. Exclusión de venta o intercambio.
h. Limitación de determinados usos.
i. Apelación.
j. No discriminación.

Las solicitudes deberán enviarse mediante los canales oficiales de privacidad.

44. INVENTARIO DE TECNOLOGÍAS

Antes de publicar esta Política, MASS deberá completar un inventario que identifique, cuando corresponda:

a. Nombre de la cookie o tecnología.
b. Proveedor.
c. Dominio.
d. Categoría.
e. Propósito.
f. Información procesada.
g. Duración.
h. Primera o tercera parte.
i. Si requiere consentimiento.
j. Método para desactivarla.
k. Servicios donde se utiliza.
l. Enlace a la política del proveedor.

45. AUDITORÍA

MASS deberá revisar periódicamente:

a. Tecnologías activas.
b. Scripts.
c. Proveedores.
d. Cookies inesperadas.
e. Duraciones.
f. Categorías.
g. Consentimientos.
h. Transferencias.
i. Integraciones eliminadas.
j. Cumplimiento de preferencias.
k. Señales de exclusión.
l. Cambios en aplicaciones.

46. CAMBIOS A ESTA POLÍTICA

Esta Política podrá actualizarse debido a:

a. Nuevas tecnologías.
b. Nuevos servicios.
c. Nuevos proveedores.
d. Cambios legales.
e. Cambios de consentimiento.
f. Cambios de publicidad.
g. Cambios de seguridad.
h. Nuevas aplicaciones.
i. Correcciones.
j. Resultados de auditorías.

Cada versión deberá mostrar su identificación y fecha de vigencia.

47. RELACIÓN CON OTROS DOCUMENTOS

Esta Política deberá interpretarse junto con:

a. MASS-LC-000, Gobernanza del Centro Legal.
b. MASS-LC-001, Definiciones legales.
c. MASS-LC-002, Acuerdo de usuario MASS ID.
d. MASS-LC-003, Aviso de privacidad.
e. MASS-LC-004, Política de seguridad.
f. MASS-LC-006, Política de inteligencia artificial.
g. Políticas específicas de cada servicio.

48. CONFLICTOS

En caso de conflicto se aplicará, salvo disposición legal distinta:

a. Legislación obligatoria.
b. Requisitos regulatorios.
c. Aviso específico del servicio.
d. Preferencia o consentimiento válido del usuario.
e. Esta Política.
f. Aviso de privacidad.
g. Acuerdo de usuario MASS ID.
h. Definiciones generales del MASS ID Legal Center.

49. CONTACTO

Antes de la publicación definitiva deberán incorporarse:

a. Correo oficial de privacidad.
b. Dirección postal.
c. Enlace al panel de preferencias.
d. Método para retirar consentimiento.
e. Método para ejercer derechos.
f. Canal para reportar problemas.
g. Lista de proveedores.
h. Inventario de cookies y tecnologías.

50. ADMINISTRACIÓN CONTINUA

MASS-LC-005 será administrado como un documento evolutivo del MASS ID Legal Center.

Su contenido deberá revisarse cuando cambien las tecnologías, proveedores, prácticas reales, configuraciones, consentimientos, aplicaciones, servicios u obligaciones legales del ecosistema MASS.

FIN DEL DOCUMENTO MASS-LC-005
`
},
    {
  codigo: "MASS-LC-006",
  titulo: "Política de inteligencia artificial",
  descripcion:
    "Regula el uso responsable, transparente y seguro de inteligencia artificial dentro de MASS.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-006
POLÍTICA DE INTELIGENCIA ARTIFICIAL DEL ECOSISTEMA MASS

Versión: 1.0
Estado: En revisión
Fecha de vigencia: Pendiente de publicación
Administrado por: TE-TO-KA SOLUTIONS® LLC

AVISO IMPORTANTE

Esta Política establece los principios, obligaciones, restricciones y medidas de control aplicables al desarrollo, adquisición, integración, configuración, entrenamiento, evaluación y utilización de sistemas de inteligencia artificial dentro de MASS ID y del ecosistema MASS.

La inteligencia artificial puede producir errores, información incompleta, resultados inesperados, contenido inexacto o recomendaciones inapropiadas.

Las funciones de inteligencia artificial no sustituyen automáticamente la revisión humana, el juicio profesional, el asesoramiento jurídico, médico, financiero, de seguridad o cualquier otra decisión que requiera una persona debidamente autorizada.

1. PROPÓSITO

Esta Política tiene como propósito:

a. Promover el uso responsable de inteligencia artificial.
b. Proteger a usuarios y terceros.
c. Reducir riesgos previsibles.
d. Mantener supervisión humana.
e. Evitar discriminación ilegal.
f. Proteger datos personales.
g. Proteger la seguridad.
h. Mantener transparencia.
i. Documentar sistemas y decisiones.
j. Prevenir fraude y suplantación.
k. Cumplir obligaciones legales.
l. Establecer responsabilidades.
m. Facilitar auditorías.
n. Mantener mecanismos de corrección.
o. Permitir innovación segura.

2. ALCANCE

Esta Política se aplica, según corresponda, a:

a. MASS ID.
b. TE-TO-KA MASS.
c. MASS Sorteos Pro.
d. MASS Ruta.
e. MASS Cash.
f. MASS VPN.
g. MASS Learn.
h. MASS TV.
i. MASS Face ID.
j. Central IA.
k. TOKAYO IA.
l. MASS Contract.
m. MASS Fit.
n. MASS Real Estate.
o. MASS Points.
p. Aplicaciones móviles.
q. Sitios web.
r. Paneles administrativos.
s. Herramientas de soporte.
t. Sistemas de detección de fraude.
u. Sistemas de recomendación.
v. Sistemas de clasificación.
w. Sistemas de moderación.
x. Sistemas de verificación.
y. Servicios futuros conectados con MASS ID.

3. DEFINICIÓN DE SISTEMA DE INTELIGENCIA ARTIFICIAL

Para esta Política, un sistema de inteligencia artificial es un sistema basado en máquinas que recibe información y genera resultados como:

a. Contenido.
b. Respuestas.
c. Decisiones.
d. Predicciones.
e. Clasificaciones.
f. Recomendaciones.
g. Puntajes.
h. Imágenes.
i. Audio.
j. Video.
k. Traducciones.
l. Resúmenes.
m. Alertas.
n. Acciones automatizadas.

4. INTELIGENCIA ARTIFICIAL GENERATIVA

La inteligencia artificial generativa puede producir:

a. Texto.
b. Imágenes.
c. Audio.
d. Video.
e. Código.
f. Diseños.
g. Resúmenes.
h. Traducciones.
i. Documentos.
j. Recomendaciones.
k. Conversaciones.
l. Datos sintéticos.

Los resultados generados no deberán considerarse automáticamente verdaderos, originales, completos, seguros o jurídicamente válidos.

5. FUNCIONES DE MASS

MASS podrá utilizar inteligencia artificial para:

a. Atención al usuario.
b. Orientación dentro de aplicaciones.
c. Clasificación de solicitudes.
d. Traducción.
e. Resúmenes.
f. Recomendaciones.
g. Detección de fraude.
h. Seguridad.
i. Moderación.
j. Análisis de errores.
k. Organización de contenido.
l. Procesamiento documental.
m. Automatización administrativa.
n. Apoyo logístico.
o. Personalización autorizada.
p. Educación.
q. Creación de contenido.
r. Análisis de operaciones.
s. Apoyo a decisiones humanas.
t. Desarrollo de nuevas funciones.

6. PRINCIPIOS GENERALES

Los sistemas de inteligencia artificial de MASS deberán procurar:

a. Legalidad.
b. Seguridad.
c. Transparencia.
d. Responsabilidad.
e. Privacidad.
f. Equidad.
g. Supervisión humana.
h. Precisión razonable.
i. Robustez.
j. Trazabilidad.
k. Accesibilidad.
l. Proporcionalidad.
m. Minimización de datos.
n. Protección contra abuso.
o. Corrección continua.

7. GOBIERNO DE INTELIGENCIA ARTIFICIAL

TE-TO-KA SOLUTIONS® LLC conservará autoridad administrativa sobre el uso de inteligencia artificial dentro del ecosistema MASS.

La Empresa podrá:

a. Aprobar sistemas.
b. Rechazar integraciones.
c. Establecer niveles de riesgo.
d. Designar responsables.
e. Ordenar pruebas.
f. Limitar funciones.
g. Suspender sistemas.
h. Solicitar documentación.
i. Revisar proveedores.
j. Modificar instrucciones.
k. Exigir supervisión humana.
l. Investigar incidentes.
m. Retirar un modelo.
n. Actualizar esta Política.

8. RESPONSABILIDADES

Las responsabilidades podrán distribuirse entre:

a. Dirección administrativa.
b. Responsables tecnológicos.
c. Desarrolladores.
d. Administradores.
e. Personal de seguridad.
f. Personal de privacidad.
g. Personal jurídico.
h. Personal de soporte.
i. Organizadores.
j. Operadores.
k. Proveedores de modelos.
l. Proveedores de infraestructura.
m. Evaluadores externos.
n. Usuarios autorizados.

9. INVENTARIO DE SISTEMAS

MASS procurará mantener un inventario de sistemas de inteligencia artificial que identifique:

a. Nombre del sistema.
b. Proveedor.
c. Versión.
d. Propósito.
e. Servicio donde se utiliza.
f. Responsable interno.
g. Datos de entrada.
h. Categorías de salida.
i. Usuarios afectados.
j. Nivel de riesgo.
k. Supervisión humana.
l. Fecha de aprobación.
m. Fecha de revisión.
n. Limitaciones conocidas.
o. Estado del sistema.

10. CLASIFICACIÓN DE RIESGO

Los sistemas podrán clasificarse como:

a. Riesgo mínimo.
b. Riesgo limitado.
c. Riesgo moderado.
d. Riesgo alto.
e. Riesgo crítico.
f. Uso prohibido.

La clasificación deberá considerar:

a. Propósito.
b. Datos utilizados.
c. Personas afectadas.
d. Consecuencias posibles.
e. Nivel de automatización.
f. Capacidad de corregir errores.
g. Uso de datos sensibles.
h. Impacto económico.
i. Impacto legal.
j. Impacto físico.
k. Riesgo de fraude.
l. Riesgo de discriminación.
m. Riesgo para menores.
n. Riesgo para seguridad.
o. Escala de utilización.

11. USOS DE RIESGO MÍNIMO

Podrán considerarse de riesgo mínimo funciones como:

a. Corrección ortográfica.
b. Formato de texto.
c. Organización de contenido.
d. Traducción no crítica.
e. Resúmenes informativos.
f. Ayuda de navegación.
g. Sugerencias no vinculantes.
h. Clasificación técnica interna.
i. Generación de borradores.
j. Automatización sin impacto significativo.

Estos sistemas seguirán sujetos a seguridad, privacidad y revisión razonable.

12. USOS DE RIESGO ALTO

Podrán considerarse de riesgo alto los sistemas relacionados con:

a. Identidad.
b. Biometría.
c. Pagos.
d. Crédito.
e. Seguros.
f. Empleo.
g. Vivienda.
h. Salud.
i. Educación.
j. Seguridad física.
k. Servicios esenciales.
l. Acceso a oportunidades.
m. Verificación de antecedentes.
n. Prevención de fraude con consecuencias importantes.
o. Decisiones que afecten derechos legales.
p. Menores.
q. Ubicación precisa.
r. Suspensión o cierre de cuentas.
s. Elegibilidad para servicios.
t. Operaciones de gran valor.

13. EVALUACIÓN PREVIA

Antes de implementar un sistema de riesgo significativo, MASS procurará evaluar:

a. Propósito.
b. Necesidad.
c. Beneficios.
d. Riesgos.
e. Datos utilizados.
f. Calidad de datos.
g. Grupos afectados.
h. Posibles errores.
i. Posibles sesgos.
j. Seguridad.
k. Privacidad.
l. Supervisión humana.
m. Capacidad de apelación.
n. Proveedor.
o. Alternativas menos riesgosas.
p. Impacto sobre menores.
q. Impacto legal.
r. Medidas de mitigación.

14. USOS PROHIBIDOS

MASS no autorizará intencionalmente sistemas diseñados para:

a. Incitar autolesiones.
b. Incitar suicidio.
c. Incitar daño físico contra otras personas.
d. Facilitar actividad criminal.
e. Realizar discriminación ilegal.
f. Suplantar identidades con fines fraudulentos.
g. Crear material sexual ilegal.
h. Crear material sexual que represente menores.
i. Eludir controles de seguridad.
j. Manipular saldos o pagos.
k. Interceptar credenciales.
l. Extraer datos sin autorización.
m. Engañar deliberadamente a usuarios.
n. Vulnerar derechos constitucionales.
o. Generar puntuaciones sociales prohibidas.
p. Realizar vigilancia ilegal.
q. Identificar personas biométricamente sin autorización.
r. Tomar decisiones importantes sin los controles requeridos.
s. Ocultar deliberadamente que una persona interactúa con inteligencia artificial cuando la ley exige divulgación.

15. MANIPULACIÓN

Los sistemas no deberán diseñarse con la intención de explotar vulnerabilidades para causar daño.

Esto incluye vulnerabilidades relacionadas con:

a. Edad.
b. Discapacidad.
c. Condición económica.
d. Dependencia emocional.
e. Emergencias.
f. Salud.
g. Falta de conocimiento técnico.
h. Presión o miedo.
i. Aislamiento.
j. Capacidad limitada para comprender consecuencias.

16. DISCRIMINACIÓN

MASS no desarrollará ni utilizará intencionalmente sistemas para discriminar ilegalmente por motivos protegidos.

Las características protegidas podrán incluir:

a. Raza.
b. Color.
c. Nacionalidad.
d. Sexo.
e. Edad.
f. Religión.
g. Discapacidad.
h. Origen étnico.
i. Condición familiar.
j. Condición militar.
k. Información genética.
l. Otras categorías protegidas por la ley.

17. EQUIDAD

MASS procurará evaluar si un sistema produce resultados injustificadamente diferentes entre grupos.

Las evaluaciones podrán incluir:

a. Comparación de resultados.
b. Análisis de errores.
c. Revisión de datos.
d. Pruebas con escenarios distintos.
e. Revisión humana.
f. Investigación de quejas.
g. Corrección de instrucciones.
h. Cambio de modelo.
i. Limitación de uso.
j. Suspensión del sistema.

18. TRANSPARENCIA

Cuando corresponda, MASS deberá informar:

a. Que se utiliza inteligencia artificial.
b. El propósito general.
c. Las funciones principales.
d. Las limitaciones relevantes.
e. Si existe supervisión humana.
f. Si una salida es generada automáticamente.
g. Cómo reportar un problema.
h. Cómo solicitar revisión.
i. Cómo ejercer derechos.
j. Qué política resulta aplicable.

19. DIVULGACIÓN AL USUARIO

Cuando un usuario interactúe directamente con una función de inteligencia artificial, MASS podrá mostrar avisos como:

a. Asistente impulsado por inteligencia artificial.
b. Respuesta generada automáticamente.
c. Revisa la información antes de utilizarla.
d. La respuesta puede contener errores.
e. No constituye asesoramiento profesional.
f. Puedes solicitar ayuda humana cuando esté disponible.

La divulgación deberá ser clara, visible y comprensible.

20. IDENTIDAD DEL ASISTENTE

Un asistente de inteligencia artificial no deberá presentarse falsamente como:

a. Abogado.
b. Médico.
c. Contador.
d. Profesional financiero.
e. Funcionario público.
f. Policía.
g. Persona real.
h. Empleado humano.
i. Representante autorizado cuando no lo sea.

Los nombres comerciales de asistentes MASS podrán utilizarse siempre que se comunique claramente su naturaleza automatizada cuando resulte necesario.

21. TOKAYO IA Y CENTRAL IA

TOKAYO IA y Central IA podrán:

a. Responder preguntas.
b. Orientar sobre funciones.
c. Generar borradores.
d. Organizar información.
e. Facilitar soporte.
f. Traducir contenido.
g. Resumir información.
h. Proponer acciones.
i. Ayudar a completar procesos.
j. Escalar solicitudes a una persona.

No deberán ejecutar automáticamente operaciones sensibles sin las confirmaciones y permisos correspondientes.

22. SUPERVISIÓN HUMANA

La supervisión humana podrá incluir:

a. Revisión antes de una decisión.
b. Confirmación del usuario.
c. Aprobación administrativa.
d. Revisión posterior.
e. Capacidad de detener el sistema.
f. Capacidad de modificar el resultado.
g. Capacidad de ignorar una recomendación.
h. Capacidad de escalar un caso.
i. Registro del responsable.
j. Capacitación apropiada.

23. DECISIONES IMPORTANTES

Un sistema no deberá tomar por sí solo una decisión con consecuencias jurídicas o comparables cuando la ley, el riesgo o la naturaleza del servicio requieran revisión humana.

Estas decisiones pueden incluir:

a. Negar acceso a un servicio esencial.
b. Suspender permanentemente una cuenta.
c. Rechazar una reclamación importante.
d. Determinar elegibilidad financiera.
e. Determinar acceso a vivienda.
f. Determinar acceso a empleo.
g. Determinar tratamiento médico.
h. Determinar acciones disciplinarias graves.
i. Determinar pagos de alto valor.
j. Identificar penalmente a una persona.

24. DERECHO A REVISIÓN

Cuando corresponda, una persona afectada podrá:

a. Solicitar explicación general.
b. Solicitar revisión humana.
c. Presentar información adicional.
d. Corregir datos.
e. Impugnar el resultado.
f. Presentar una queja.
g. Solicitar apelación.
h. Reportar discriminación.
i. Reportar un error.
j. Solicitar un canal alternativo.

25. DATOS DE ENTRADA

Los sistemas podrán recibir información como:

a. Preguntas.
b. Mensajes.
c. Documentos.
d. Imágenes.
e. Audio.
f. Video.
g. Ubicación.
h. Datos de cuenta.
i. Historial autorizado.
j. Información de transacciones.
k. Registros técnicos.
l. Preferencias.
m. Datos proporcionados por proveedores.

La información utilizada deberá limitarse al propósito autorizado.

26. DATOS PERSONALES

El uso de datos personales deberá cumplir con:

a. MASS-LC-003, Aviso de privacidad.
b. Preferencias del usuario.
c. Principios de minimización.
d. Controles de acceso.
e. Periodos de conservación.
f. Requisitos de seguridad.
g. Derechos de privacidad.
h. Consentimientos aplicables.
i. Restricciones contractuales.
j. Legislación aplicable.

27. DATOS SENSIBLES

Los datos sensibles no deberán utilizarse en un sistema de inteligencia artificial sin:

a. Necesidad legítima.
b. Propósito definido.
c. Acceso restringido.
d. Seguridad reforzada.
e. Revisión del riesgo.
f. Consentimiento cuando sea requerido.
g. Periodo de conservación.
h. Evaluación del proveedor.
i. Método de eliminación.
j. Supervisión adecuada.

28. BIOMETRÍA

Cuando una función utilice biometría, MASS deberá procurar:

a. Proporcionar aviso.
b. Obtener consentimiento cuando corresponda.
c. Definir el propósito.
d. Limitar el acceso.
e. Proteger las plantillas.
f. Evitar usos secundarios incompatibles.
g. Establecer conservación.
h. Aplicar eliminación.
i. Evaluar proveedores.
j. Evitar identificación no autorizada.
k. No vender identificadores biométricos.
l. Mantener documentación.

29. FOTOGRAFÍAS

Una fotografía podrá utilizarse para:

a. Perfil.
b. Verificación visual.
c. Moderación.
d. Prevención de fraude.
e. Comparación autorizada.
f. Funciones solicitadas.

La fotografía no deberá convertirse en una plantilla biométrica identificable sin los avisos y autorizaciones correspondientes.

30. MENORES

Las funciones utilizadas por menores deberán aplicar protecciones reforzadas.

MASS procurará:

a. Limitar recopilación.
b. Evitar manipulación.
c. Evitar contenido inapropiado.
d. Aplicar controles parentales.
e. Obtener consentimiento cuando corresponda.
f. Facilitar eliminación.
g. Limitar personalización.
h. Evitar publicidad prohibida.
i. Aplicar moderación.
j. Diseñar experiencias apropiadas para la edad.
k. Escalar situaciones de riesgo.
l. Evitar conversaciones sexuales simulando ser un menor.

31. DATOS PARA ENTRENAMIENTO

Antes de utilizar datos para entrenar o ajustar un sistema, MASS deberá evaluar:

a. Origen.
b. Autorización.
c. Licencia.
d. Privacidad.
e. Calidad.
f. Representatividad.
g. Sesgos.
h. Información sensible.
i. Derechos de terceros.
j. Seguridad.
k. Conservación.
l. Posibilidad de eliminación.

32. CONTENIDO DEL USUARIO

El contenido proporcionado por un usuario no deberá utilizarse para entrenar modelos externos salvo que exista:

a. Aviso claro.
b. Base legal.
c. Autorización apropiada.
d. Contrato con el proveedor.
e. Controles de privacidad.
f. Medidas de seguridad.
g. Opción de exclusión cuando corresponda.
h. Limitación del propósito.

33. PROVEEDORES DE MODELOS

MASS podrá utilizar proveedores externos de modelos o servicios de inteligencia artificial.

Antes de una integración importante podrá evaluar:

a. Reputación.
b. Seguridad.
c. Privacidad.
d. Uso de datos.
e. Conservación.
f. Entrenamiento con datos del cliente.
g. Ubicación de procesamiento.
h. Subprocesadores.
i. Disponibilidad.
j. Limitaciones.
k. Propiedad intelectual.
l. Controles administrativos.
m. Respuesta a incidentes.
n. Métodos de eliminación.
o. Condiciones contractuales.

34. CONTRATOS CON PROVEEDORES

Los contratos podrán incluir obligaciones sobre:

a. Confidencialidad.
b. Seguridad.
c. Uso limitado de datos.
d. Prohibición de entrenamiento no autorizado.
e. Notificación de incidentes.
f. Eliminación.
g. Subcontratación.
h. Cooperación.
i. Disponibilidad.
j. Propiedad intelectual.
k. Cumplimiento legal.
l. Documentación.
m. Cambios de modelo.
n. Terminación.
o. Exportación de datos.

35. EXACTITUD

MASS procurará evaluar la exactitud de un sistema según su propósito.

La evaluación podrá considerar:

a. Respuestas correctas.
b. Errores.
c. Información inventada.
d. Omisiones.
e. Ambigüedad.
f. Resultados desactualizados.
g. Falsos positivos.
h. Falsos negativos.
i. Consistencia.
j. Contexto.
k. Idioma.
l. Grupos de usuarios.

36. ALUCINACIONES

Un sistema generativo puede producir información falsa presentada de manera convincente.

Para reducir este riesgo, MASS podrá:

a. Mostrar advertencias.
b. Limitar usos críticos.
c. Utilizar fuentes autorizadas.
d. Solicitar confirmación.
e. Aplicar recuperación de información.
f. Verificar datos.
g. Requerir revisión humana.
h. Limitar respuestas.
i. Bloquear afirmaciones sensibles.
j. Mantener registros de errores.

37. INFORMACIÓN ACTUALIZADA

Los sistemas no deberán presentarse como fuentes de información actualizada cuando no tengan acceso a datos recientes.

Cuando una respuesta dependa de:

a. Leyes.
b. Precios.
c. Noticias.
d. Clima.
e. Horarios.
f. Resultados deportivos.
g. Disponibilidad.
h. Políticas de proveedores.
i. Información financiera.
j. Información médica.

deberán utilizarse fuentes actuales o advertirse la posible desactualización.

38. ASESORAMIENTO PROFESIONAL

La inteligencia artificial podrá proporcionar información general, pero no deberá presentarse automáticamente como sustituto de:

a. Asesoramiento jurídico.
b. Diagnóstico médico.
c. Tratamiento médico.
d. Asesoramiento financiero.
e. Asesoramiento fiscal.
f. Ingeniería profesional.
g. Evaluación de seguridad.
h. Servicios de emergencia.
i. Decisiones de recursos humanos.
j. Decisiones regulatorias.

39. EMERGENCIAS

Una función de inteligencia artificial no deberá utilizarse como único canal para emergencias.

Cuando se detecte una posible emergencia, el sistema podrá:

a. Recomendar contactar servicios de emergencia.
b. Mostrar recursos apropiados.
c. Interrumpir respuestas automatizadas.
d. Escalar a personal autorizado.
e. Evitar instrucciones peligrosas.
f. Preservar información cuando la ley lo permita.

40. AUTOPROTECCIÓN Y DAÑO

Los sistemas no deberán incitar intencionalmente:

a. Suicidio.
b. Autolesión.
c. Violencia.
d. Daño a terceros.
e. Actividad criminal.
f. Consumo peligroso.
g. Manipulación de dispositivos de seguridad.
h. Conductas que generen riesgo físico inmediato.

41. CONTENIDO GENERADO

El contenido generado podrá requerir una etiqueta cuando:

a. Pueda confundirse con contenido humano.
b. Represente una persona real.
c. Se utilice con fines comerciales.
d. Tenga impacto público.
e. Pueda alterar una decisión importante.
f. Incluya voz o imagen sintética.
g. La ley exija divulgación.

42. IMÁGENES, AUDIO Y VIDEO SINTÉTICOS

MASS no autorizará contenido sintético utilizado para:

a. Fraude.
b. Suplantación.
c. Extorsión.
d. Acoso.
e. Difamación.
f. Engaño electoral ilegal.
g. Material sexual no consentido.
h. Material sexual infantil.
i. Falsificación de evidencia.
j. Evasión de verificaciones.

43. PROPIEDAD INTELECTUAL

Los usuarios deberán respetar:

a. Derechos de autor.
b. Marcas.
c. Patentes.
d. Secretos comerciales.
e. Derechos de imagen.
f. Licencias.
g. Contratos.
h. Derechos de publicidad.
i. Restricciones de proveedores.

Los resultados generados podrán no ser exclusivos ni susceptibles de protección.

44. CÓDIGO GENERADO

El código generado por inteligencia artificial deberá revisarse antes de producción.

La revisión podrá incluir:

a. Seguridad.
b. Funcionamiento.
c. Dependencias.
d. Licencias.
e. Credenciales.
f. Privacidad.
g. Validación de entradas.
h. Manejo de errores.
i. Permisos.
j. Pruebas.
k. Compatibilidad.
l. Vulnerabilidades.

45. PRUEBAS

Antes de publicar un sistema, MASS podrá realizar:

a. Pruebas funcionales.
b. Pruebas de seguridad.
c. Pruebas de privacidad.
d. Pruebas de sesgo.
e. Pruebas de exactitud.
f. Pruebas adversariales.
g. Pruebas de abuso.
h. Pruebas de carga.
i. Pruebas con idiomas.
j. Pruebas con escenarios extremos.
k. Pruebas de supervisión humana.
l. Pruebas de recuperación.

46. EVALUACIÓN ADVERSARIAL

Las pruebas adversariales podrán intentar detectar:

a. Instrucciones peligrosas.
b. Evasión de controles.
c. Extracción de datos.
d. Revelación de instrucciones internas.
e. Generación de malware.
f. Fraude.
g. Suplantación.
h. Discriminación.
i. Manipulación.
j. Contenido ilegal.
k. Acceso no autorizado.
l. Uso de herramientas sin permiso.

47. MÉTRICAS

Las métricas podrán incluir:

a. Exactitud.
b. Precisión.
c. Falsos positivos.
d. Falsos negativos.
e. Tasa de rechazo.
f. Errores por grupo.
g. Tiempo de respuesta.
h. Disponibilidad.
i. Quejas.
j. Incidentes.
k. Solicitudes de revisión.
l. Resultados corregidos.
m. Respuestas inseguras.
n. Cumplimiento de instrucciones.

48. DOCUMENTACIÓN

MASS procurará documentar:

a. Propósito.
b. Propietario.
c. Proveedor.
d. Versión.
e. Datos.
f. Instrucciones.
g. Limitaciones.
h. Riesgos.
i. Pruebas.
j. Resultados.
k. Supervisión.
l. Controles.
m. Incidentes.
n. Cambios.
o. Aprobaciones.
p. Retiro del sistema.

49. REGISTROS

MASS podrá conservar registros relacionados con:

a. Solicitudes.
b. Respuestas.
c. Herramientas utilizadas.
d. Errores.
e. Bloqueos.
f. Versiones.
g. Cambios.
h. Revisiones humanas.
i. Quejas.
j. Apelaciones.
k. Incidentes.
l. Operaciones sensibles.
m. Acciones administrativas.

Los registros deberán limitarse y protegerse conforme a privacidad y seguridad.

50. SEGURIDAD

Los sistemas de inteligencia artificial deberán procurar protección contra:

a. Acceso no autorizado.
b. Inyección de instrucciones.
c. Extracción de datos.
d. Manipulación de contexto.
e. Envenenamiento de datos.
f. Robo de modelos.
g. Exposición de secretos.
h. Uso abusivo de herramientas.
i. Ejecución de código no autorizado.
j. Solicitudes automatizadas.
k. Ataques a proveedores.
l. Falsificación de resultados.

51. HERRAMIENTAS Y ACCIONES

Cuando un sistema pueda ejecutar herramientas, deberá aplicarse:

a. Autorización.
b. Mínimo privilegio.
c. Confirmación del usuario.
d. Límites de operación.
e. Validación de parámetros.
f. Registro.
g. Separación de entornos.
h. Bloqueo de acciones peligrosas.
i. Revisión humana cuando corresponda.
j. Capacidad de revocación.

52. PAGOS Y OPERACIONES FINANCIERAS

La inteligencia artificial no deberá aprobar por sí sola una operación financiera sensible sin los controles correspondientes.

Podrá apoyar:

a. Detección de fraude.
b. Clasificación.
c. Soporte.
d. Conciliación.
e. Alertas.
f. Análisis.
g. Recomendaciones.

Las operaciones finales deberán seguir las autorizaciones y registros aplicables.

53. MASS RUTA Y LOGÍSTICA

La inteligencia artificial podrá apoyar:

a. Rutas.
b. Asignaciones.
c. Tiempos estimados.
d. Clasificación de solicitudes.
e. Detección de inconsistencias.
f. Comunicación.
g. Predicción de demanda.
h. Seguridad.

Las recomendaciones no deberán sustituir las obligaciones del operador, las condiciones reales de tránsito ni las decisiones de seguridad.

54. MASS SORTEOS PRO

La inteligencia artificial podrá apoyar:

a. Moderación.
b. Detección de fraude.
c. Soporte.
d. Análisis de actividad.
e. Organización de contenido.
f. Traducción.
g. Notificaciones.

No deberá manipular resultados, números ganadores, probabilidades, saldos, premios ni registros oficiales.

55. MASS VPN

La inteligencia artificial podrá apoyar:

a. Soporte.
b. Detección de errores.
c. Selección de servidor.
d. Análisis de rendimiento.
e. Seguridad.
f. Clasificación de incidentes.

No deberá utilizarse para inspeccionar contenido privado más allá de lo necesario y permitido por las políticas aplicables.

56. MASS LEARN

La inteligencia artificial podrá apoyar:

a. Explicaciones.
b. Ejercicios.
c. Traducciones.
d. Evaluaciones formativas.
e. Accesibilidad.
f. Personalización.
g. Resúmenes.

Los resultados educativos deberán permitir revisión y no deberán representar automáticamente calificaciones oficiales.

57. MASS TV Y CONTENIDO

La inteligencia artificial podrá utilizarse para:

a. Recomendaciones.
b. Subtítulos.
c. Traducciones.
d. Moderación.
e. Organización.
f. Búsqueda.
g. Generación autorizada.

El contenido sintético deberá cumplir derechos de autor, normas comunitarias y requisitos de divulgación.

58. VIGILANCIA POSTERIOR

Después de publicar un sistema, MASS podrá revisar:

a. Errores.
b. Quejas.
c. Incidentes.
d. Sesgos.
e. Cambios de desempeño.
f. Cambios del proveedor.
g. Uso no previsto.
h. Intentos de abuso.
i. Resultados perjudiciales.
j. Vulnerabilidades.
k. Cambios regulatorios.
l. Necesidad de retiro.

59. CAMBIOS DE MODELO

Cuando cambie un modelo, MASS podrá revisar nuevamente:

a. Exactitud.
b. Seguridad.
c. Privacidad.
d. Sesgos.
e. Instrucciones.
f. Costos.
g. Disponibilidad.
h. Comportamiento.
i. Datos.
j. Contratos.
k. Resultados.
l. Riesgos.

60. INCIDENTES DE INTELIGENCIA ARTIFICIAL

Un incidente podrá incluir:

a. Resultado peligroso.
b. Divulgación de datos.
c. Acción no autorizada.
d. Discriminación.
e. Suplantación.
f. Fraude.
g. Contenido ilegal.
h. Vulnerabilidad.
i. Uso de herramientas sin permiso.
j. Pérdida de control.
k. Error con impacto significativo.
l. Incumplimiento legal.

61. RESPUESTA A INCIDENTES

MASS podrá:

a. Suspender el sistema.
b. Limitar funciones.
c. Revocar accesos.
d. Preservar evidencia.
e. Investigar.
f. Corregir instrucciones.
g. Cambiar el modelo.
h. Notificar al proveedor.
i. Notificar a usuarios.
j. Notificar a autoridades.
k. Revisar resultados anteriores.
l. Restaurar operaciones.
m. Documentar mejoras.

62. QUEJAS

Los usuarios podrán reportar:

a. Información falsa.
b. Resultado inseguro.
c. Discriminación.
d. Suplantación.
e. Exposición de datos.
f. Contenido ilegal.
g. Decisión injusta.
h. Falta de transparencia.
i. Error de identidad.
j. Problema de accesibilidad.
k. Uso no autorizado de contenido.

63. APELACIONES

Cuando una decisión asistida por inteligencia artificial produzca un efecto importante, MASS podrá proporcionar un proceso de apelación que permita:

a. Identificar la decisión.
b. Presentar información adicional.
c. Solicitar revisión humana.
d. Corregir datos.
e. Recibir respuesta.
f. Escalar la revisión.
g. Documentar el resultado.

64. CAPACITACIÓN

Las personas que utilicen o administren sistemas de inteligencia artificial deberán recibir orientación sobre:

a. Limitaciones.
b. Privacidad.
c. Seguridad.
d. Sesgos.
e. Verificación.
f. Supervisión humana.
g. Datos sensibles.
h. Propiedad intelectual.
i. Reporte de incidentes.
j. Uso de herramientas.
k. Fraude.
l. Cumplimiento.

65. ACCESIBILIDAD

Los sistemas deberán procurar:

a. Lenguaje comprensible.
b. Compatibilidad con tecnologías de asistencia.
c. Alternativas no automatizadas cuando corresponda.
d. Diseño legible.
e. Navegación por teclado.
f. Subtítulos.
g. Descripciones.
h. Reducción de barreras.
i. Apoyo multilingüe.
j. Revisión de resultados que afecten a personas con discapacidad.

66. USO POR EMPLEADOS Y CONTRATISTAS

Los empleados y contratistas no deberán introducir en herramientas no autorizadas:

a. Contraseñas.
b. Secretos.
c. Llaves.
d. Datos sensibles.
e. Información confidencial.
f. Datos de clientes.
g. Código privado.
h. Documentos legales reservados.
i. Información financiera.
j. Información de incidentes.

67. USO PERSONAL DE HERRAMIENTAS

El uso personal de herramientas externas para actividades de MASS requerirá autorización cuando involucre:

a. Datos del usuario.
b. Información confidencial.
c. Código.
d. Decisiones empresariales.
e. Documentos legales.
f. Comunicaciones oficiales.
g. Operaciones financieras.
h. Seguridad.
i. Biometría.
j. Menores.

68. PROPIEDAD DE RESULTADOS

La propiedad o licencia sobre un resultado dependerá de:

a. La legislación.
b. Los términos del proveedor.
c. El contenido de entrada.
d. Los derechos de terceros.
e. La participación humana.
f. El contrato aplicable.
g. El servicio donde se genere.

MASS no garantiza que todo resultado sea exclusivo.

69. INFORMACIÓN CONFIDENCIAL

Un sistema no deberá revelar:

a. Instrucciones internas protegidas.
b. Credenciales.
c. Datos privados.
d. Secretos comerciales.
e. Información de otros usuarios.
f. Investigaciones.
g. Vulnerabilidades.
h. Información legal privilegiada.
i. Configuraciones de seguridad.
j. Datos financieros restringidos.

70. AUDITORÍAS

MASS podrá realizar:

a. Auditorías internas.
b. Evaluaciones independientes.
c. Revisión de documentación.
d. Revisión de proveedores.
e. Pruebas adversariales.
f. Revisión de permisos.
g. Revisión de datos.
h. Revisión de quejas.
i. Evaluación de cumplimiento.
j. Comparación de versiones.
k. Verificación de controles.
l. Revisión de prácticas reales.

71. EXCEPCIONES

Una excepción deberá:

a. Identificar el sistema.
b. Explicar la necesidad.
c. Evaluar el riesgo.
d. Ser aprobada.
e. Incluir controles compensatorios.
f. Tener duración limitada.
g. Ser revisada.
h. Ser revocada cuando deje de ser necesaria.

72. CUMPLIMIENTO EN TEXAS

Las funciones utilizadas en Texas deberán cumplir las obligaciones aplicables relacionadas con:

a. Desarrollo responsable.
b. Protección contra riesgos previsibles.
c. Transparencia.
d. Discriminación ilegal.
e. Manipulación dañina.
f. Derechos constitucionales.
g. Biometría.
h. Seguridad.
i. Investigaciones regulatorias.
j. Conservación de documentación.
k. Medidas de corrección.

73. CUMPLIMIENTO INTERNACIONAL

Cuando MASS ofrezca servicios fuera de Estados Unidos, podrá aplicar requisitos adicionales relacionados con:

a. Sistemas prohibidos.
b. Clasificación de alto riesgo.
c. Transparencia.
d. Evaluaciones de conformidad.
e. Documentación técnica.
f. Registros.
g. Supervisión humana.
h. Información a usuarios.
i. Datos y privacidad.
j. Representación local.
k. Notificación de incidentes.
l. Etiquetado de contenido sintético.

74. MARCOS DE GESTIÓN DE RIESGOS

MASS podrá utilizar marcos reconocidos para organizar sus controles, incluyendo:

a. Gobierno.
b. Identificación de riesgos.
c. Medición.
d. Gestión.
e. Evaluación.
f. Pruebas.
g. Documentación.
h. Supervisión.
i. Corrección.
j. Seguimiento.

La adopción de un marco no sustituye el cumplimiento de la legislación obligatoria.

75. CAMBIOS A ESTA POLÍTICA

Esta Política podrá actualizarse por:

a. Nuevos modelos.
b. Nuevos servicios.
c. Nuevas leyes.
d. Nuevos riesgos.
e. Nuevos proveedores.
f. Incidentes.
g. Auditorías.
h. Cambios empresariales.
i. Nuevas capacidades.
j. Correcciones.
k. Experiencia operativa.
l. Recomendaciones profesionales.

76. RELACIÓN CON OTROS DOCUMENTOS

Esta Política deberá interpretarse junto con:

a. MASS-LC-000, Gobernanza del Centro Legal.
b. MASS-LC-001, Definiciones legales.
c. MASS-LC-002, Acuerdo de usuario MASS ID.
d. MASS-LC-003, Aviso de privacidad.
e. MASS-LC-004, Política de seguridad.
f. MASS-LC-005, Política de cookies.
g. MASS-LC-007, Política de pagos.
h. MASS-LC-008, Política de reembolsos.
i. MASS-LC-009, Política antifraude.
j. MASS-LC-010, Normas de la comunidad.
k. Políticas específicas de cada servicio.

77. CONFLICTOS

En caso de conflicto se aplicará, salvo disposición legal distinta:

a. Legislación obligatoria.
b. Requisitos regulatorios.
c. Política específica del servicio.
d. Consentimiento válido.
e. Esta Política.
f. Aviso de privacidad.
g. Política de seguridad.
h. Acuerdo de usuario MASS ID.
i. Definiciones del MASS ID Legal Center.

78. CONTACTO

Antes de la publicación definitiva deberán incorporarse:

a. Correo oficial de inteligencia artificial.
b. Canal para reportar errores.
c. Canal para reportar discriminación.
d. Canal para solicitar revisión humana.
e. Canal para presentar apelaciones.
f. Canal para reportar contenido sintético dañino.
g. Dirección postal.
h. Información adicional exigida por la ley.

79. ADMINISTRACIÓN CONTINUA

MASS-LC-006 será administrado como un documento evolutivo del MASS ID Legal Center.

Su contenido deberá revisarse cuando cambien los modelos, proveedores, prácticas reales, datos, riesgos, productos, obligaciones legales, tecnologías o métodos de supervisión del ecosistema MASS.

FIN DEL DOCUMENTO MASS-LC-006
`
},
    {
  codigo: "MASS-LC-007",
  titulo: "Política de pagos",
  descripcion:
    "Establece las reglas relacionadas con cargos, autorizaciones y procesamiento de pagos.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-007
POLÍTICA DE PAGOS DEL ECOSISTEMA MASS

Versión: 1.0
Estado: En revisión
Fecha de vigencia: Pendiente de publicación
Administrado por: TE-TO-KA SOLUTIONS® LLC

AVISO IMPORTANTE

Esta Política establece las reglas generales aplicables a precios, cargos, autorizaciones, suscripciones, saldos, recargas, pagos a organizadores, disputas y procesamiento de transacciones dentro de MASS ID y del ecosistema MASS.

Las condiciones específicas mostradas antes de cada compra formarán parte de esta Política.

Los pagos podrán ser procesados por proveedores financieros independientes. TE-TO-KA SOLUTIONS® LLC no controla las decisiones de bancos, emisores de tarjetas, redes de pago o procesadores externos.

1. PROPÓSITO

Esta Política tiene como propósito:

a. Informar cómo se realizan los pagos.
b. Exigir autorización antes de cobrar.
c. Mostrar precios y cargos aplicables.
d. Regular suscripciones y renovaciones.
e. Proteger transacciones y saldos.
f. Establecer responsabilidades.
g. Prevenir fraude.
h. Mantener registros.
i. Administrar disputas.
j. Cumplir obligaciones legales.
k. Proteger a usuarios, organizadores y operadores.
l. Coordinar esta Política con la Política de reembolsos.

2. ALCANCE

Esta Política se aplica, según corresponda, a:

a. MASS ID.
b. TE-TO-KA MASS.
c. MASS Sorteos Pro.
d. MASS Ruta.
e. MASS Cash.
f. MASS VPN.
g. MASS Learn.
h. MASS TV.
i. MASS Contract.
j. MASS Points.
k. MASS Real Estate.
l. MASS Fit.
m. Central IA.
n. TOKAYO IA.
o. Membresías.
p. Suscripciones.
q. Recargas.
r. Compras individuales.
s. Pagos a organizadores.
t. Comisiones de plataforma.
u. Productos y servicios futuros.

3. PARTES DE UNA TRANSACCIÓN

Una transacción podrá involucrar:

a. Usuario comprador.
b. Organizador.
c. Operador o prestador.
d. TE-TO-KA SOLUTIONS® LLC.
e. Procesador de pagos.
f. Banco adquirente.
g. Emisor de tarjeta.
h. Red de pagos.
i. Proveedor de billetera digital.
j. Autoridad fiscal.
k. Proveedor externo.

La participación de MASS podrá variar según el servicio.

4. VENDEDOR O PRESTADOR

Antes del pago deberá identificarse, cuando corresponda:

a. Quién vende el producto.
b. Quién presta el servicio.
c. Quién recibe el pago.
d. Quién administra la transacción.
e. Quién responde por la entrega.
f. Quién administra reembolsos.
g. Qué políticas específicas resultan aplicables.

Un organizador independiente podrá ser responsable de sus propias ofertas, entregas, impuestos y obligaciones.

5. PRECIOS

Antes de confirmar una compra, MASS procurará mostrar:

a. Precio principal.
b. Moneda.
c. Impuestos conocidos.
d. Tarifas obligatorias.
e. Comisión de servicio.
f. Cargos de entrega.
g. Cargos de procesamiento.
h. Descuentos.
i. Créditos aplicados.
j. Saldo utilizado.
k. Total estimado o definitivo.

Los precios podrán variar por servicio, organizador, ubicación, disponibilidad o promoción.

6. MONEDA

Los precios podrán mostrarse en:

a. Dólares estadounidenses.
b. Pesos mexicanos.
c. Otra moneda autorizada.

Cuando exista conversión de moneda:

a. El proveedor podrá establecer el tipo de cambio.
b. El banco podrá cobrar cargos adicionales.
c. El total final podrá variar.
d. MASS deberá identificar la moneda antes del pago.
e. El usuario es responsable de revisar la moneda seleccionada.

7. IMPUESTOS

Los impuestos podrán depender de:

a. Ubicación.
b. Producto.
c. Servicio.
d. Organizador.
e. Situación fiscal.
f. Legislación aplicable.
g. Proveedor de pagos.

MASS podrá calcular, recaudar o transferir impuestos cuando resulte obligatorio o contractualmente acordado.

8. AUTORIZACIÓN

Al confirmar una transacción, el usuario autoriza:

a. El cargo mostrado.
b. El método de pago seleccionado.
c. El procesamiento por proveedores autorizados.
d. La verificación antifraude.
e. La conservación de registros.
f. La entrega de información necesaria al procesador.
g. Los cargos recurrentes expresamente aceptados.
h. La aplicación de créditos o saldos seleccionados.

No deberá realizarse un cargo sin una autorización válida o una base legal aplicable.

9. CONFIRMACIÓN FINAL

Antes de cobrar, la interfaz deberá procurar mostrar:

a. Producto o servicio.
b. Cantidad.
c. Organizador o proveedor.
d. Precio.
e. Cargos adicionales.
f. Total.
g. Moneda.
h. Método de pago.
i. Condiciones de cancelación.
j. Condiciones de reembolso.
k. Si el cargo es único o recurrente.

10. MÉTODOS DE PAGO

MASS podrá aceptar:

a. Tarjetas de crédito.
b. Tarjetas de débito.
c. Transferencias.
d. Billeteras digitales.
e. Enlaces de pago.
f. Pagos bancarios.
g. Saldo MASS autorizado.
h. Créditos promocionales.
i. Métodos locales.
j. Otros métodos publicados.

La disponibilidad dependerá del país, servicio y proveedor.

11. PROCESADORES EXTERNOS

Los procesadores podrán:

a. Recibir datos de pago.
b. Autorizar cargos.
c. Rechazar operaciones.
d. Aplicar controles antifraude.
e. Convertir monedas.
f. Retener fondos.
g. Administrar disputas.
h. Solicitar verificación.
i. Aplicar sus términos.
j. Conservar información conforme a sus políticas.

MASS no deberá almacenar números completos de tarjeta cuando no sea necesario.

12. RECHAZO DE PAGOS

Un pago podrá rechazarse por:

a. Fondos insuficientes.
b. Tarjeta vencida.
c. Información incorrecta.
d. Restricción bancaria.
e. Riesgo de fraude.
f. Límite excedido.
g. Ubicación inusual.
h. Fallo técnico.
i. Cuenta restringida.
j. Decisión del procesador.

Un rechazo no garantiza que no exista una autorización temporal bancaria.

13. AUTORIZACIONES TEMPORALES

Un proveedor podrá colocar una autorización temporal para:

a. Verificar el método.
b. Reservar el importe.
c. Confirmar disponibilidad.
d. Prevenir fraude.
e. Preparar una transacción futura.

La duración de la autorización dependerá del banco o proveedor.

14. RECIBOS

Después de una operación exitosa, MASS procurará proporcionar:

a. Número de transacción.
b. Fecha y hora.
c. Importe.
d. Moneda.
e. Método parcialmente identificado.
f. Producto o servicio.
g. Organizador.
h. Estado.
i. Cargos aplicados.
j. Canal de soporte.

El usuario deberá conservar sus comprobantes.

15. SUSCRIPCIONES

Una suscripción podrá otorgar acceso durante un periodo determinado.

Antes de contratarla deberán mostrarse:

a. Precio.
b. Periodicidad.
c. Fecha aproximada de cobro.
d. Renovación automática.
e. Duración mínima, si existe.
f. Beneficios.
g. Restricciones.
h. Procedimiento de cancelación.
i. Política de reembolso.
j. Cargos por terminación, si fueran legales y aplicables.

16. RENOVACIÓN AUTOMÁTICA

MASS no deberá activar una renovación automática sin informar claramente:

a. Que el cargo se repetirá.
b. La cantidad o método para calcularla.
c. La frecuencia.
d. Cómo cancelar.
e. Cuándo debe cancelarse para evitar otro cargo.
f. Si el precio puede cambiar.
g. Qué ocurre al terminar una prueba gratuita.

La autorización deberá conservarse cuando corresponda.

17. PRUEBAS GRATUITAS

Una prueba gratuita deberá informar:

a. Duración.
b. Funciones incluidas.
c. Fecha de conversión.
d. Precio posterior.
e. Frecuencia de cobro.
f. Método de cancelación.
g. Restricciones.
h. Si se requiere método de pago.

No deberá presentarse una oferta como gratuita ocultando un cargo obligatorio.

18. CANCELACIÓN DE SUSCRIPCIONES

El usuario podrá cancelar mediante el procedimiento publicado.

La cancelación:

a. Detendrá renovaciones futuras.
b. No necesariamente elimina cargos ya procesados.
c. Podrá mantener acceso hasta terminar el periodo pagado.
d. Deberá generar confirmación.
e. Deberá conservarse en los registros.
f. No deberá requerir obstáculos injustificados.

19. CAMBIOS DE PRECIO

Antes de aplicar un aumento a una suscripción, MASS procurará:

a. Notificar el nuevo precio.
b. Informar la fecha de aplicación.
c. Explicar opciones.
d. Permitir cancelación cuando corresponda.
e. Obtener nueva autorización si la ley lo exige.
f. Conservar evidencia del aviso.

20. MEMBRESÍAS

Las membresías podrán tener:

a. Tarifa mensual.
b. Tarifa anual.
c. Beneficios.
d. Límites.
e. Requisitos.
f. Renovación.
g. Periodos mínimos.
h. Condiciones específicas.

Los beneficios podrán cambiar con aviso razonable, salvo derechos ya adquiridos.

21. MASS CASH

MASS Cash podrá funcionar como un sistema interno de saldo, crédito o registro de valor únicamente bajo las condiciones publicadas.

MASS no deberá presentar MASS Cash como:

a. Cuenta bancaria.
b. Depósito bancario.
c. Moneda de curso legal.
d. Inversión.
e. Cuenta que produce intereses.
f. Producto asegurado por el gobierno.
g. Criptomoneda, salvo que se establezca expresamente mediante una estructura legal distinta.

22. LANZAMIENTO DE MASS CASH

Antes de habilitar transferencias generales, retiro de efectivo o uso entre múltiples comercios, deberá realizarse una revisión jurídica, financiera y regulatoria.

MASS podrá limitar inicialmente MASS Cash a:

a. Créditos internos.
b. Recargas para un organizador específico.
c. Reembolsos internos.
d. Beneficios.
e. Premios permitidos.
f. Compras dentro de un servicio definido.

23. SALDO POR ORGANIZADOR

Cuando el saldo esté vinculado con un organizador:

a. Solamente podrá utilizarse con ese organizador.
b. No podrá transferirse automáticamente a otro organizador.
c. La interfaz deberá identificar al organizador.
d. La recarga deberá mostrar esta limitación.
e. Cada movimiento deberá registrar el organizador.
f. No deberá mezclarse con otros saldos sin autorización.

24. RECARGAS

Una solicitud de recarga podrá requerir:

a. Usuario autenticado.
b. Organizador seleccionado.
c. Importe.
d. Método de pago.
e. Comprobante.
f. Aprobación.
g. Verificación antifraude.
h. Registro de fecha.
i. Identificador único.

Una recarga pendiente no constituye saldo disponible hasta su aprobación.

25. APROBACIÓN DE RECARGAS

La aprobación deberá:

a. Identificar al administrador.
b. Identificar al usuario.
c. Identificar al organizador.
d. Registrar el importe.
e. Evitar acreditación duplicada.
f. Generar historial.
g. Notificar al usuario.
h. Conservar evidencia.

26. MOVIMIENTOS DE SALDO

Cada movimiento deberá procurar registrar:

a. Identificador.
b. Usuario.
c. Organizador.
d. Importe.
e. Tipo de operación.
f. Saldo anterior.
g. Saldo posterior.
h. Fecha.
i. Estado.
j. Referencia.
k. Administrador, cuando corresponda.

27. SALDOS PROMOCIONALES

Los créditos promocionales podrán:

a. Tener fecha de vencimiento.
b. Limitarse a un servicio.
c. Limitarse a un organizador.
d. No ser transferibles.
e. No ser canjeables por efectivo.
f. Requerir una compra mínima.
g. Excluir determinados cargos.
h. Estar sujetos a prevención de fraude.

Las condiciones deberán mostrarse al otorgarlos.

28. PREMIOS Y BENEFICIOS

Los premios, beneficios o boletos gratuitos:

a. No equivaldrán necesariamente a efectivo.
b. Podrán tener restricciones.
c. Podrán estar vinculados con un organizador.
d. Podrán requerir verificación.
e. Podrán vencer.
f. No deberán venderse o transferirse sin autorización.
g. Deberán conservar historial de entrega y canje.

29. TRANSFERENCIAS ENTRE USUARIOS

Las transferencias de saldo entre usuarios permanecerán deshabilitadas salvo que MASS implemente:

a. Revisión regulatoria.
b. Verificación de identidad.
c. Prevención de lavado de dinero cuando corresponda.
d. Límites.
e. Monitoreo.
f. Registros.
g. Procedimientos de error.
h. Controles de fraude.
i. Términos específicos.

30. RETIRO DE EFECTIVO

El saldo interno no será canjeable por efectivo salvo que:

a. La función sea publicada expresamente.
b. Exista estructura legal apropiada.
c. Se cumplan verificaciones.
d. Se identifiquen tarifas.
e. Se apliquen límites.
f. Se cumplan obligaciones regulatorias.
g. El retiro sea exigido por la ley.

31. COMISIONES

MASS podrá cobrar:

a. Comisión de plataforma.
b. Comisión por transacción.
c. Cuota de membresía.
d. Cargo tecnológico.
e. Cargo administrativo.
f. Cargo de entrega.
g. Cargo por servicio.
h. Otro cargo informado.

Ningún cargo obligatorio deberá ocultarse antes de la confirmación.

32. PAGOS A ORGANIZADORES

Los pagos a organizadores podrán estar sujetos a:

a. Verificación.
b. Periodo de procesamiento.
c. Reservas.
d. Comisiones.
e. Reembolsos.
f. Disputas.
g. Contracargos.
h. Impuestos.
i. Límites.
j. Retenciones legales.
k. Revisión antifraude.

33. RESERVAS Y RETENCIONES

MASS o el procesador podrá mantener una reserva razonable cuando exista:

a. Riesgo de contracargos.
b. Actividad inusual.
c. Servicio pendiente.
d. Quejas.
e. Obligación de reembolso.
f. Investigación.
g. Requisito del procesador.
h. Riesgo de fraude.
i. Incumplimiento contractual.

La reserva no deberá utilizarse como sanción arbitraria.

34. ENTREGA DEL PRODUCTO O SERVICIO

El cobro no sustituye la obligación de entregar lo ofrecido.

El vendedor o prestador deberá:

a. Cumplir la descripción.
b. Respetar el precio.
c. Informar retrasos.
d. Conservar evidencia de entrega.
e. Atender problemas.
f. Aplicar la política de reembolso.
g. Cumplir la legislación correspondiente.

35. PAGOS PENDIENTES

Una transacción podrá aparecer como pendiente mientras:

a. Se confirma el banco.
b. Se valida el procesador.
c. Se revisa fraude.
d. Se confirma el organizador.
e. Se completa una transferencia.
f. Se concilian registros.
g. Se resuelve un error técnico.

Un estado pendiente no garantiza aprobación final.

36. PAGOS DUPLICADOS

Cuando se detecte un posible pago duplicado, MASS podrá:

a. Detener una segunda operación.
b. Revisar identificadores.
c. Comparar fecha e importe.
d. Consultar al procesador.
e. Corregir el saldo.
f. Reembolsar cuando corresponda.
g. Conservar evidencia.
h. Notificar al usuario.

37. TRANSACCIONES NO RECONOCIDAS

El usuario deberá reportar inmediatamente:

a. Cargos no reconocidos.
b. Uso de saldo no autorizado.
c. Recargas desconocidas.
d. Cambios en métodos de pago.
e. Acceso sospechoso.
f. Suscripciones no autorizadas.

También deberá contactar oportunamente a su banco, emisor o proveedor de pago cuando corresponda.

38. ERRORES

Un error podrá incluir:

a. Importe incorrecto.
b. Doble cargo.
c. Cargo después de cancelación.
d. Saldo incorrecto.
e. Pago aplicado al organizador equivocado.
f. Producto no entregado.
g. Estado inconsistente.
h. Reembolso no reflejado.
i. Movimiento no reconocido.

MASS podrá solicitar comprobantes para investigar.

39. DISPUTAS

Antes de presentar una disputa externa, el usuario podrá contactar el canal oficial de soporte para intentar resolverla.

La solicitud deberá incluir:

a. Identificador de transacción.
b. Fecha.
c. Importe.
d. Organizador.
e. Explicación.
f. Evidencia.
g. Solución solicitada.

Esto no limita derechos legales que requieran acudir directamente al proveedor financiero.

40. CONTRACARGOS

Un contracargo ocurre cuando un usuario disputa un pago mediante su banco o emisor.

MASS o el vendedor podrá presentar:

a. Confirmación de compra.
b. Autorización.
c. Comprobante de entrega.
d. Registros de acceso.
e. Comunicaciones.
f. Política aceptada.
g. Comprobante de cancelación.
h. Evidencia antifraude.

La decisión final podrá corresponder al banco, red o procesador.

41. CONTRACARGOS ABUSIVOS

La presentación deliberada de una disputa falsa podrá producir:

a. Investigación.
b. Suspensión.
c. Limitación de pagos.
d. Retención de evidencia.
e. Cancelación de beneficios.
f. Recuperación de importes.
g. Acción contractual.
h. Reporte a autoridades cuando corresponda.

Una disputa legítima no deberá generar represalias.

42. REEMBOLSOS

Los reembolsos estarán sujetos a:

a. MASS-LC-008.
b. Condiciones específicas del servicio.
c. Estado de entrega.
d. Método de pago.
e. Legislación aplicable.
f. Reglas del procesador.
g. Evidencia disponible.
h. Motivo de la solicitud.

La aprobación de un reembolso no garantiza que el banco lo refleje inmediatamente.

43. TIEMPO DE REEMBOLSO

El tiempo para recibir un reembolso podrá depender de:

a. Procesador.
b. Banco.
c. Método.
d. Moneda.
e. País.
f. Fines de semana.
g. Revisiones.
h. Conversión.
i. Estado de la cuenta.

44. DEVOLUCIÓN A MÉTODO ORIGINAL

Cuando sea posible, el reembolso se enviará al método original.

MASS podrá utilizar otro método cuando:

a. El método original esté cerrado.
b. El procesador lo requiera.
c. La ley lo exija.
d. Exista acuerdo documentado.
e. Se trate de crédito interno permitido.

45. SEGURIDAD DE PAGOS

MASS podrá aplicar:

a. Autenticación.
b. Verificación multifactor.
c. Confirmación de contraseña.
d. Códigos.
e. Límites.
f. Monitoreo.
g. Revisión manual.
h. Protección de sesiones.
i. Validación de identificadores.
j. Registros de auditoría.
k. Restricción por rol.
l. Cierre de sesiones sospechosas.

46. FRAUDE

Las señales de fraude podrán incluir:

a. Múltiples intentos fallidos.
b. Métodos robados.
c. Identidad inconsistente.
d. Recargas repetidas.
e. Contracargos excesivos.
f. Manipulación de saldo.
g. Cuentas relacionadas.
h. Ubicaciones incompatibles.
i. Dispositivos desconocidos.
j. Automatización.
k. Documentos falsos.
l. Colusión.

MASS podrá suspender temporalmente una operación mientras investiga.

47. VERIFICACIÓN DE IDENTIDAD

Una transacción de riesgo podrá requerir:

a. MASS ID verificado.
b. Correo verificado.
c. Teléfono verificado.
d. Autenticación multifactor.
e. Documento.
f. Confirmación bancaria.
g. Evidencia de titularidad.
h. Revisión administrativa.
i. Información fiscal.
j. Verificación adicional permitida.

48. MENORES

Los menores no deberán realizar pagos sin la autorización requerida.

Cuando un servicio admita menores, MASS podrá requerir:

a. Consentimiento parental.
b. Método controlado.
c. Límites.
d. Confirmación.
e. Reembolso conforme a la ley.
f. Restricciones de compra.
g. Protección contra cargos accidentales.

49. CONSERVACIÓN DE REGISTROS

MASS podrá conservar:

a. Transacciones.
b. Autorizaciones.
c. Recibos.
d. Reembolsos.
e. Disputas.
f. Contracargos.
g. Recargas.
h. Saldos.
i. Aprobaciones.
j. Impuestos.
k. Comunicaciones.
l. Evidencia antifraude.

La conservación estará sujeta al Aviso de privacidad y obligaciones aplicables.

50. PRIVACIDAD

Los datos de pago deberán tratarse conforme a MASS-LC-003.

MASS procurará:

a. Minimizar datos.
b. Limitar acceso.
c. Utilizar proveedores apropiados.
d. Proteger registros.
e. Evitar mostrar datos completos.
f. Eliminar información innecesaria.
g. Cumplir solicitudes válidas.
h. Mantener contratos con proveedores.

51. DISPONIBILIDAD

Una función de pago podrá suspenderse por:

a. Mantenimiento.
b. Fraude.
c. Fallos.
d. Procesador.
e. Banco.
f. Revisión.
g. Obligación legal.
h. Riesgo de seguridad.
i. Falta de disponibilidad regional.
j. Terminación de un proveedor.

52. CAMBIOS A ESTA POLÍTICA

Esta Política podrá actualizarse por:

a. Nuevos métodos.
b. Nuevos servicios.
c. Cambios de precios.
d. Nuevos procesadores.
e. Cambios legales.
f. Riesgos.
g. Fraude.
h. Cambios en MASS Cash.
i. Nuevas monedas.
j. Nuevas jurisdicciones.
k. Auditorías.
l. Correcciones.

53. RELACIÓN CON OTROS DOCUMENTOS

Esta Política deberá interpretarse junto con:

a. MASS-LC-000, Gobernanza del Centro Legal.
b. MASS-LC-001, Definiciones legales.
c. MASS-LC-002, Acuerdo de usuario MASS ID.
d. MASS-LC-003, Aviso de privacidad.
e. MASS-LC-004, Política de seguridad.
f. MASS-LC-006, Política de inteligencia artificial.
g. MASS-LC-008, Política de reembolsos.
h. MASS-LC-009, Política antifraude.
i. Condiciones específicas de cada servicio.
j. Condiciones mostradas antes del pago.

54. CONFLICTOS

En caso de conflicto se aplicará, salvo disposición legal distinta:

a. Legislación obligatoria.
b. Requisitos regulatorios.
c. Reglas del proveedor financiero aplicables.
d. Condiciones específicas mostradas al pagar.
e. Política específica del servicio.
f. Esta Política.
g. Política de reembolsos.
h. Acuerdo de usuario MASS ID.
i. Definiciones del MASS ID Legal Center.

55. CONTACTO

Antes de la publicación definitiva deberán incorporarse:

a. Correo oficial de pagos.
b. Canal de soporte.
c. Canal para transacciones no reconocidas.
d. Canal para disputas.
e. Canal para organizadores.
f. Dirección postal.
g. Proveedores de pago activos.
h. Plazos de respuesta.
i. Monedas admitidas.
j. Información legal adicional.

56. ADMINISTRACIÓN CONTINUA

MASS-LC-007 será administrado como un documento evolutivo del MASS ID Legal Center.

Su contenido deberá revisarse cuando cambien los métodos de pago, proveedores, saldos, comisiones, productos, suscripciones, prácticas reales, riesgos u obligaciones legales del ecosistema MASS.

FIN DEL DOCUMENTO MASS-LC-007
`
},
    {
  codigo: "MASS-LC-008",
  titulo: "Política de reembolsos",
  descripcion:
    "Define las condiciones, requisitos y procedimientos aplicables a reembolsos.",
  version: "1.0",
  vigencia: "Pendiente de publicación",
  estado: "En revisión",
  contenido: `
MASS-LC-008
POLÍTICA DE REEMBOLSOS DEL ECOSISTEMA MASS

Versión: 1.0
Estado: En revisión
Fecha de vigencia: Pendiente de publicación
Administrado por: TE-TO-KA SOLUTIONS® LLC

AVISO IMPORTANTE

Esta Política establece las reglas generales aplicables a solicitudes de reembolso, cancelaciones, devoluciones, créditos, pagos duplicados, servicios no prestados y otros ajustes económicos relacionados con MASS ID y el ecosistema MASS.

Las condiciones específicas mostradas antes de cada compra, suscripción, recarga o contratación formarán parte de esta Política.

Nada de esta Política limitará derechos obligatorios que correspondan al usuario conforme a la legislación aplicable.

1. PROPÓSITO

Esta Política tiene como propósito:

a. Explicar cuándo podrá solicitarse un reembolso.
b. Establecer procedimientos claros.
c. Identificar quién debe resolver la solicitud.
d. Evitar reembolsos duplicados.
e. Proteger a usuarios, organizadores y prestadores.
f. Prevenir fraude.
g. Mantener registros.
h. Coordinar reembolsos con procesadores financieros.
i. Diferenciar reembolsos de contracargos.
j. Regular créditos y saldos internos.
k. Cumplir obligaciones legales.
l. Proporcionar decisiones consistentes.

2. ALCANCE

Esta Política se aplica, según corresponda, a:

a. MASS ID.
b. TE-TO-KA MASS.
c. MASS Sorteos Pro.
d. MASS Ruta.
e. MASS Cash.
f. MASS VPN.
g. MASS Learn.
h. MASS TV.
i. MASS Contract.
j. MASS Points.
k. MASS Real Estate.
l. MASS Fit.
m. Central IA.
n. TOKAYO IA.
o. Membresías.
p. Suscripciones.
q. Recargas.
r. Productos.
s. Servicios.
t. Beneficios.
u. Compras futuras integradas con MASS ID.

3. RELACIÓN CON LA POLÍTICA DE PAGOS

Esta Política deberá interpretarse junto con MASS-LC-007, Política de pagos.

La Política de pagos regula principalmente:

a. Autorizaciones.
b. Precios.
c. Métodos de pago.
d. Suscripciones.
e. Procesamiento.
f. Saldos.
g. Disputas.
h. Contracargos.

Esta Política regula principalmente la devolución o ajuste de importes después de una transacción.

4. PARTES RESPONSABLES

Una solicitud podrá involucrar:

a. Usuario comprador.
b. Organizador.
c. Prestador de servicios.
d. Vendedor.
e. TE-TO-KA SOLUTIONS® LLC.
f. Procesador de pagos.
g. Banco.
h. Emisor de tarjeta.
i. Proveedor de billetera digital.
j. Proveedor externo.

La responsabilidad dependerá de quién vendió, cobró, entregó o administró el producto o servicio.

5. IDENTIFICACIÓN DEL VENDEDOR

Antes de decidir una solicitud deberá determinarse:

a. Quién ofreció el producto.
b. Quién recibió el pago.
c. Quién debía entregar.
d. Qué condiciones fueron aceptadas.
e. Qué servicio de MASS se utilizó.
f. Qué procesador intervino.
g. Si el organizador actuó independientemente.
h. Si MASS fue vendedor, intermediario o proveedor tecnológico.

6. DERECHO OBLIGATORIO

Cuando la legislación otorgue un derecho obligatorio de devolución, cancelación o reembolso, dicho derecho tendrá prioridad sobre cualquier condición incompatible.

La aplicación podrá depender de:

a. Jurisdicción.
b. Tipo de producto.
c. Tipo de servicio.
d. Lugar de la venta.
e. Forma de contratación.
f. Edad del consumidor.
g. Existencia de defecto.
h. Incumplimiento.
i. Plazo legal.
j. Otras circunstancias.

7. AUSENCIA DE DERECHO UNIVERSAL

No toda compra genera automáticamente un derecho general de cancelación o reembolso.

La elegibilidad dependerá de:

a. Legislación.
b. Condiciones mostradas antes del pago.
c. Naturaleza del producto.
d. Estado de entrega.
e. Uso realizado.
f. Motivo de la solicitud.
g. Evidencia.
h. Política específica del servicio.
i. Participación de terceros.

8. CONDICIONES ESPECÍFICAS

Antes de cada operación podrán mostrarse condiciones como:

a. Reembolsable.
b. Parcialmente reembolsable.
c. No reembolsable, salvo derechos obligatorios.
d. Cancelable antes de determinada fecha.
e. Crédito interno únicamente.
f. Reembolso sujeto a revisión.
g. Tarifa administrativa aplicable.
h. Reembolso proporcional.
i. Reembolso condicionado a devolución.
j. Reembolso administrado por el organizador.

9. MOTIVOS POSIBLES

Una solicitud podrá considerarse cuando exista:

a. Cobro duplicado.
b. Importe incorrecto.
c. Producto no entregado.
d. Servicio no prestado.
e. Cancelación válida.
f. Compra no autorizada.
g. Error técnico confirmado.
h. Saldo acreditado incorrectamente.
i. Producto sustancialmente distinto.
j. Servicio cancelado por el prestador.
k. Incumplimiento material.
l. Defecto.
m. Obligación legal.
n. Acuerdo documentado entre las partes.

10. PAGOS DUPLICADOS

Cuando exista un posible pago duplicado, MASS podrá:

a. Comparar identificadores.
b. Revisar fecha y hora.
c. Revisar importe.
d. Consultar al procesador.
e. Verificar si ambas operaciones fueron capturadas.
f. Anular una autorización pendiente.
g. Reembolsar el cargo duplicado confirmado.
h. Corregir saldo interno.
i. Conservar evidencia.
j. Notificar el resultado.

11. IMPORTE INCORRECTO

Si el importe cobrado difiere del autorizado, la revisión podrá considerar:

a. Precio mostrado.
b. Impuestos.
c. Tarifas.
d. Descuentos.
e. Saldo aplicado.
f. Moneda.
g. Cantidad.
h. Comprobante.
i. Registro del procesador.
j. Confirmación final del usuario.

12. PRODUCTO NO ENTREGADO

Una solicitud por producto no entregado podrá requerir:

a. Comprobante de compra.
b. Fecha esperada.
c. Dirección.
d. Seguimiento.
e. Comunicación con el vendedor.
f. Evidencia del transportista.
g. Confirmación del destinatario.
h. Resultado de investigación.
i. Plazo razonable adicional cuando corresponda.

13. PRODUCTO DEFECTUOSO

Cuando un producto sea defectuoso podrán ofrecerse, según corresponda:

a. Reparación.
b. Reemplazo.
c. Reenvío.
d. Crédito.
e. Reembolso parcial.
f. Reembolso total.
g. Garantía del fabricante.
h. Otra solución exigida por la ley.

Podrán solicitarse fotografías, videos, números de serie o devolución del producto.

14. PRODUCTO DISTINTO

Si el producto recibido es sustancialmente distinto del solicitado, el usuario deberá reportarlo con evidencia razonable.

La solución podrá incluir:

a. Sustitución.
b. Devolución.
c. Reembolso.
d. Ajuste de precio.
e. Crédito.
f. Reenvío.

15. DEVOLUCIÓN FÍSICA

Cuando se requiera devolver un producto deberán informarse:

a. Dirección.
b. Plazo.
c. Condición requerida.
d. Empaque.
e. Accesorios.
f. Etiqueta.
g. Costo del envío.
h. Número de autorización.
i. Método de seguimiento.
j. Consecuencias de una devolución incompleta.

16. CONDICIÓN DEL PRODUCTO

La elegibilidad podrá depender de que el producto se encuentre:

a. Sin uso.
b. En condición original.
c. Con empaque.
d. Con accesorios.
e. Sin alteraciones.
f. Sin daño causado por el usuario.
g. Dentro del plazo aplicable.

Esto no limitará derechos relacionados con productos defectuosos o no conformes.

17. COSTOS DE DEVOLUCIÓN

El costo de devolución podrá corresponder:

a. Al vendedor, cuando exista error o defecto atribuible.
b. Al comprador, cuando la devolución sea voluntaria y así se hubiera informado.
c. Al transportista, conforme a sus reglas.
d. A otra parte, conforme a la ley o acuerdo aplicable.

18. SERVICIO NO PRESTADO

Un servicio no prestado podrá generar:

a. Reprogramación.
b. Crédito.
c. Reembolso parcial.
d. Reembolso total.
e. Sustitución del prestador.
f. Otra solución acordada.

La decisión considerará si el usuario estuvo disponible y cumplió sus obligaciones.

19. SERVICIO PARCIALMENTE PRESTADO

Cuando un servicio haya comenzado o se haya prestado parcialmente, el ajuste podrá calcularse considerando:

a. Parte completada.
b. Costos incurridos.
c. Tiempo reservado.
d. Materiales utilizados.
e. Beneficio recibido.
f. Incumplimiento.
g. Condiciones específicas.
h. Legislación aplicable.

20. CANCELACIÓN POR EL USUARIO

Una cancelación solicitada por el usuario podrá estar sujeta a:

a. Plazo de cancelación.
b. Costos ya incurridos.
c. Trabajo realizado.
d. Reservación de personal.
e. Materiales.
f. Tarifas informadas.
g. Condiciones del prestador.
h. Derechos obligatorios.

21. CANCELACIÓN POR EL PRESTADOR

Cuando el vendedor, organizador u operador cancele, podrá ofrecerse:

a. Reprogramación.
b. Sustitución.
c. Crédito.
d. Reembolso.
e. Solución equivalente.

El usuario no deberá soportar cargos por un servicio que el prestador canceló sin entregar, salvo condiciones legales distintas.

22. CANCELACIÓN POR MASS

MASS podrá cancelar una operación por:

a. Error de precio.
b. Falta de disponibilidad.
c. Riesgo de fraude.
d. Incumplimiento.
e. Problema técnico.
f. Restricción legal.
g. Seguridad.
h. Error de inventario.
i. Terminación del proveedor.
j. Imposibilidad de prestación.

Cuando se haya capturado un pago sin entrega, deberá realizarse el ajuste correspondiente.

23. SUSCRIPCIONES

Cancelar una suscripción normalmente detendrá renovaciones futuras.

La cancelación no necesariamente genera devolución del periodo ya pagado cuando:

a. El acceso fue habilitado.
b. El usuario utilizó el servicio.
c. La condición fue informada.
d. No existe obligación legal de devolución.

Podrán aplicarse reembolsos proporcionales cuando así se publique o exija la ley.

24. RENOVACIONES NO DESEADAS

Una solicitud relacionada con renovación automática podrá evaluarse considerando:

a. Divulgación previa.
b. Autorización.
c. Avisos enviados.
d. Fecha de cancelación.
e. Uso posterior.
f. Cambio de precio.
g. Problemas técnicos.
h. Legislación aplicable.

25. PRUEBAS GRATUITAS

Cuando una prueba gratuita se convierta en una suscripción, la revisión considerará:

a. Si se informó el cargo.
b. Si se informó la fecha.
c. Si se informó cómo cancelar.
d. Si existió autorización.
e. Si el usuario canceló a tiempo.
f. Si hubo error técnico.
g. Si el servicio fue utilizado después del cobro.

26. CONTENIDO DIGITAL

El contenido digital podrá incluir:

a. Videos.
b. Cursos.
c. Descargas.
d. Documentos.
e. Acceso premium.
f. Software.
g. Suscripciones.
h. Licencias.
i. Contenido generado.
j. Servicios de inteligencia artificial.

La elegibilidad podrá limitarse después de iniciar descarga, reproducción, acceso o utilización, salvo derechos obligatorios.

27. SERVICIOS PERSONALIZADOS

Los productos o servicios personalizados podrán no ser reembolsables cuando:

a. El trabajo ya comenzó.
b. Se utilizaron datos proporcionados por el usuario.
c. Se creó contenido específico.
d. Se compraron materiales.
e. La condición fue informada.

Podrá existir ajuste si el resultado incumple materialmente lo acordado.

28. MASS VPN

Las solicitudes relacionadas con MASS VPN podrán considerar:

a. Activación.
b. Días utilizados.
c. Dispositivos.
d. Consumo.
e. Problemas técnicos.
f. Compatibilidad informada.
g. Restricciones de red externa.
h. Condiciones del proveedor.
i. Periodo promocional.
j. Plan contratado.

MASS no garantiza que todas las redes permitan todas las conexiones VPN.

29. MASS LEARN

Los reembolsos de cursos o membresías podrán depender de:

a. Inicio del curso.
b. Porcentaje completado.
c. Material descargado.
d. Certificados.
e. Sesiones utilizadas.
f. Condiciones del instructor.
g. Cancelación de la clase.
h. Acceso otorgado.

30. MASS TV

Las solicitudes relacionadas con MASS TV podrán considerar:

a. Periodo de acceso.
b. Contenido reproducido.
c. Evento cancelado.
d. Interrupción importante.
e. Restricciones territoriales.
f. Problemas del proveedor.
g. Compra individual.
h. Suscripción.

31. MASS RUTA

En MASS Ruta podrán considerarse:

a. Cancelación antes de asignación.
b. Cancelación después de asignación.
c. Distancia recorrida.
d. Recolección realizada.
e. Entrega fallida.
f. Información incorrecta.
g. Espera.
h. Costos del operador.
i. Daño o pérdida.
j. Condiciones específicas del envío.

32. MASS SORTEOS PRO

Las operaciones relacionadas con dinámicas o sorteos deberán cumplir la legislación y las reglas específicas del organizador.

Una compra podrá no ser reembolsable después de que:

a. El número haya sido asignado.
b. El boleto haya sido confirmado.
c. La dinámica haya comenzado.
d. El resultado haya sido determinado.
e. Se haya utilizado un beneficio relacionado.

Esto no limita ajustes por cobro duplicado, operación no autorizada, cancelación de la dinámica o incumplimiento obligatorio.

33. CANCELACIÓN DE UNA DINÁMICA

Si una dinámica se cancela definitivamente, el organizador deberá aplicar la solución anunciada, que podrá incluir:

a. Reembolso.
b. Crédito.
c. Sustitución autorizada.
d. Nueva fecha aceptada conforme a las reglas.
e. Otra solución legalmente permitida.

34. MASS CASH

Un reembolso podrá acreditarse como:

a. Devolución al método original.
b. Crédito MASS.
c. Saldo del organizador.
d. Crédito promocional.

El método deberá ser informado y cumplir la legislación aplicable.

35. SALDO POR ORGANIZADOR

Cuando una compra utilice saldo vinculado con un organizador:

a. El reembolso podrá regresar al mismo saldo.
b. No deberá acreditarse a otro organizador.
c. Deberá registrarse el movimiento.
d. Deberá evitarse una doble devolución.
e. El usuario deberá ver el saldo actualizado.
f. El organizador deberá identificarse.

36. RECARGAS

Una recarga aprobada podrá no ser reembolsable automáticamente cuando el saldo ya haya sido utilizado.

Una recarga no utilizada podrá revisarse considerando:

a. Método original.
b. Organizador.
c. Fraude.
d. Comisiones.
e. Condiciones mostradas.
f. Legislación aplicable.
g. Disponibilidad técnica.
h. Estado del saldo.

37. CRÉDITOS PROMOCIONALES

Los créditos promocionales:

a. Podrán no tener valor en efectivo.
b. Podrán vencer.
c. Podrán limitarse a un servicio.
d. Podrán limitarse a un organizador.
e. Podrán retirarse en caso de fraude.
f. No deberán generar reembolso monetario salvo obligación legal.

38. PREMIOS Y BENEFICIOS

Los premios y beneficios podrán estar sujetos a:

a. Verificación.
b. Disponibilidad.
c. Restricciones.
d. Vencimiento.
e. No transferencia.
f. Reglas del organizador.
g. Sustitución equivalente.
h. Legislación aplicable.

39. REEMBOLSO TOTAL

Un reembolso total podrá incluir:

a. Precio pagado.
b. Impuesto reembolsable.
c. Tarifa obligatoria reembolsable.
d. Crédito utilizado.
e. Otro importe exigido por la ley.

No necesariamente incluirá gastos independientes que no puedan recuperarse y que hayan sido informados, salvo obligación distinta.

40. REEMBOLSO PARCIAL

Un reembolso parcial podrá calcularse con base en:

a. Parte no entregada.
b. Tiempo restante.
c. Cantidad afectada.
d. Descuento aplicado.
e. Costos utilizados.
f. Valor recibido.
g. Daño.
h. Acuerdo.
i. Requisito legal.

La explicación deberá conservarse en el registro.

41. TARIFAS NO REEMBOLSABLES

Determinadas tarifas podrán no ser reembolsables cuando:

a. Fueron claramente informadas.
b. El servicio relacionado fue prestado.
c. El proveedor no las devuelve.
d. La ley lo permite.
e. No existe error atribuible a MASS o al vendedor.

No deberán ocultarse tarifas no reembolsables.

42. IMPUESTOS

Los impuestos se ajustarán conforme a:

a. Legislación.
b. Importe reembolsado.
c. Tipo de producto.
d. Jurisdicción.
e. Procesador.
f. Registros fiscales.

43. MONEDA Y CONVERSIÓN

Un reembolso podrá realizarse en la moneda original.

El importe recibido podrá variar por:

a. Tipo de cambio.
b. Banco.
c. Procesador.
d. Fecha.
e. Tarifa externa.
f. Método de pago.

MASS no controla cargos independientes del banco.

44. MÉTODO ORIGINAL

Cuando resulte posible, el reembolso se enviará al método original.

Podrá utilizarse otro método cuando:

a. La cuenta esté cerrada.
b. El procesador lo exija.
c. Exista acuerdo documentado.
d. La ley lo permita.
e. Se trate de crédito interno.
f. Exista imposibilidad técnica.

45. PLAZO DE SOLICITUD

Cada servicio podrá establecer un plazo razonable para solicitar revisión.

El plazo podrá depender de:

a. Producto.
b. Servicio.
c. Fecha de entrega.
d. Fecha de cargo.
e. Fecha de descubrimiento.
f. Garantía.
g. Legislación.
h. Procesador.

Una solicitud tardía podrá evaluarse cuando exista una causa justificada o un derecho obligatorio.

46. PRESENTACIÓN DE SOLICITUD

La solicitud deberá presentarse mediante el canal oficial e incluir, cuando corresponda:

a. Nombre.
b. MASS ID.
c. Correo.
d. Teléfono.
e. Número de transacción.
f. Fecha.
g. Importe.
h. Organizador.
i. Producto o servicio.
j. Motivo.
k. Evidencia.
l. Solución solicitada.

47. EVIDENCIA

MASS podrá solicitar:

a. Recibo.
b. Captura.
c. Fotografía.
d. Video.
e. Comunicación.
f. Seguimiento.
g. Estado bancario parcialmente oculto.
h. Confirmación del organizador.
i. Registro de acceso.
j. Número de serie.
k. Documento de identidad cuando resulte necesario.
l. Otra evidencia razonable.

No deberán solicitarse datos financieros completos innecesarios.

48. ACUSE DE RECIBO

Cuando sea posible, el sistema deberá confirmar:

a. Recepción.
b. Número de caso.
c. Fecha.
d. Canal de seguimiento.
e. Información faltante.
f. Tiempo estimado no vinculante.

49. REVISIÓN

La revisión podrá incluir:

a. Validación de cuenta.
b. Verificación de transacción.
c. Consulta al organizador.
d. Consulta al procesador.
e. Revisión de entrega.
f. Revisión de registros.
g. Evaluación antifraude.
h. Aplicación de la política.
i. Evaluación legal.
j. Solicitud de información adicional.

50. TIEMPO DE DECISIÓN

MASS procurará resolver solicitudes dentro de un periodo razonable.

El tiempo podrá variar por:

a. Complejidad.
b. Evidencia.
c. Procesador.
d. Organizador.
e. Banco.
f. Investigación.
g. Fraude.
h. Días no laborables.
i. Obligación legal.
j. País.

51. DECISIÓN

La respuesta podrá indicar:

a. Aprobado.
b. Aprobado parcialmente.
c. Reemplazo ofrecido.
d. Crédito ofrecido.
e. Información adicional requerida.
f. Rechazado.
g. Remitido al vendedor.
h. Remitido al procesador.
i. Bajo investigación.

52. EXPLICACIÓN

Cuando una solicitud sea rechazada o aprobada parcialmente, MASS procurará explicar:

a. Condición aplicable.
b. Evidencia considerada.
c. Importe.
d. Parte responsable.
e. Alternativas.
f. Método de apelación.
g. Derechos adicionales cuando corresponda.

53. APROBACIÓN

Al aprobarse un reembolso deberá registrarse:

a. Número de caso.
b. Transacción original.
c. Importe.
d. Moneda.
e. Motivo.
f. Método.
g. Responsable.
h. Fecha.
i. Estado.
j. Referencia del procesador.

54. TIEMPO DE REFLEJO

Después de emitirse, el tiempo para reflejar el reembolso dependerá de:

a. Banco.
b. Procesador.
c. Método.
d. Moneda.
e. País.
f. Días laborables.
g. Estado de la cuenta.
h. Sistemas externos.

La confirmación de emisión no significa que el banco ya lo haya mostrado.

55. REEMBOLSO PENDIENTE

Mientras esté pendiente, MASS podrá mostrar:

a. Solicitado.
b. En revisión.
c. Aprobado.
d. Enviado al procesador.
e. Procesando.
f. Completado.
g. Rechazado.
h. Cancelado.

56. REEMBOLSO FALLIDO

Si un reembolso falla, MASS podrá:

a. Reintentar.
b. Confirmar el método.
c. Consultar al procesador.
d. Solicitar un método alternativo permitido.
e. Emitir crédito con autorización.
f. Mantener el caso abierto.
g. Notificar al usuario.

57. REEMBOLSO DUPLICADO

Si un usuario recibe una devolución duplicada por error:

a. MASS podrá corregir registros.
b. Podrá solicitar devolución.
c. Podrá revertir crédito interno no utilizado.
d. Podrá compensar importes cuando sea legal.
e. Deberá documentar la corrección.

58. COMPENSACIÓN CON SALDOS

MASS no deberá retirar arbitrariamente fondos.

Una compensación podrá realizarse cuando:

a. Exista doble reembolso.
b. Exista error confirmado.
c. Exista fraude.
d. Exista autorización.
e. El contrato lo permita.
f. La ley lo permita.
g. Se proporcione explicación.

59. COMPRAS NO AUTORIZADAS

Una compra no autorizada deberá reportarse inmediatamente.

MASS podrá:

a. Proteger la cuenta.
b. Cerrar sesiones.
c. Solicitar cambio de contraseña.
d. Verificar MFA.
e. Revisar dispositivos.
f. Suspender transacciones.
g. Consultar al procesador.
h. Preservar evidencia.
i. Coordinar el ajuste.
j. Remitir al banco cuando corresponda.

60. DISPUTA BANCARIA

El usuario podrá tener derechos independientes frente a su banco o emisor.

Una solicitud ante MASS:

a. No sustituye los avisos requeridos por el banco.
b. No extiende plazos bancarios.
c. No garantiza un contracargo.
d. No limita derechos obligatorios.
e. Puede resolverse paralelamente cuando sea apropiado.

61. CONTRACARGOS

Cuando exista un contracargo abierto:

a. MASS podrá suspender el reembolso interno para evitar duplicidad.
b. Podrá proporcionar evidencia al procesador.
c. Podrá esperar la decisión.
d. Podrá corregir saldos.
e. Podrá cerrar el caso interno cuando el banco resuelva.

62. FRAUDE

MASS podrá negar, suspender o investigar una solicitud cuando existan señales de:

a. Evidencia alterada.
b. Declaración falsa.
c. Doble reclamación.
d. Contracargo y reembolso simultáneos.
e. Uso completo del servicio.
f. Devolución de producto distinto.
g. Cuenta relacionada con fraude.
h. Identidad inconsistente.
i. Manipulación de saldo.
j. Colusión.

63. RECLAMACIÓN LEGÍTIMA

Una reclamación legítima no deberá generar represalias.

El usuario podrá:

a. Solicitar revisión.
b. Proporcionar evidencia.
c. Apelar.
d. Ejercer derechos legales.
e. Contactar al proveedor financiero.
f. Presentar una queja ante una autoridad.

64. ORGANIZADORES

Los organizadores deberán:

a. Publicar condiciones claras.
b. Cumplir sus ofertas.
c. Responder solicitudes.
d. Mantener registros.
e. Evitar políticas engañosas.
f. Cooperar con MASS.
g. Proporcionar evidencia.
h. Financiar reembolsos que les correspondan.
i. Cumplir la ley.
j. No castigar reclamaciones legítimas.

65. INCUMPLIMIENTO DEL ORGANIZADOR

MASS podrá aplicar medidas cuando un organizador:

a. Ignore solicitudes.
b. Retenga fondos indebidamente.
c. No entregue.
d. Proporcione información falsa.
e. Acumule contracargos.
f. Incumpla políticas.
g. No mantenga reservas.
h. Se niegue a cooperar.

Las medidas podrán incluir limitación, retención, suspensión o terminación.

66. RESERVAS

MASS o el procesador podrá mantener reservas razonables para cubrir:

a. Reembolsos.
b. Contracargos.
c. Entregas pendientes.
d. Quejas.
e. Riesgo.
f. Fraude.
g. Obligaciones legales.

67. PROVEEDORES EXTERNOS

Cuando el producto sea prestado por un tercero:

a. Podrá aplicarse la política del tercero.
b. MASS podrá facilitar comunicación.
c. El tercero podrá decidir.
d. El procesador podrá imponer reglas.
e. Los derechos obligatorios permanecerán aplicables.
f. La identidad del responsable deberá comunicarse.

68. TIENDAS DE APLICACIONES

Las compras realizadas mediante una tienda de aplicaciones podrán estar sujetas al sistema de facturación y reembolso de esa tienda.

El usuario podrá tener que solicitar el reembolso directamente al proveedor de la tienda.

69. SERVICIOS EXTERNOS

Los pagos realizados fuera de MASS mediante:

a. Transferencia.
b. Efectivo.
c. Enlace externo.
d. Terminal independiente.
e. Acuerdo directo.

podrán requerir que la solicitud se presente ante quien recibió el pago.

70. PRIVACIDAD

La información de una solicitud deberá utilizarse para:

a. Verificar.
b. Investigar.
c. Resolver.
d. Prevenir fraude.
e. Cumplir obligaciones.
f. Mantener registros.
g. Defender derechos.

El tratamiento estará sujeto a MASS-LC-003.

71. SEGURIDAD

Las solicitudes podrán requerir:

a. Sesión activa.
b. Verificación de identidad.
c. Contraseña.
d. MFA.
e. Confirmación de correo.
f. Confirmación de teléfono.
g. Validación del método.
h. Revisión administrativa.

72. CONSERVACIÓN

MASS podrá conservar registros de:

a. Solicitudes.
b. Evidencia.
c. Decisiones.
d. Pagos.
e. Ajustes.
f. Comunicaciones.
g. Contracargos.
h. Fraude.
i. Apelaciones.
j. Obligaciones fiscales.

73. APELACIÓN

El usuario podrá solicitar una segunda revisión mediante el canal publicado.

La apelación deberá incluir:

a. Número de caso.
b. Motivo de desacuerdo.
c. Información nueva.
d. Evidencia.
e. Solución solicitada.

74. REVISIÓN HUMANA

Las decisiones importantes no deberán depender exclusivamente de un sistema automatizado cuando resulte necesaria una revisión humana.

La revisión podrá confirmar, modificar o revertir el resultado inicial.

75. ERRORES DEL SISTEMA

Si un error técnico impide solicitar o recibir un reembolso, MASS podrá:

a. Registrar manualmente el caso.
b. Extender un plazo razonablemente.
c. Corregir la transacción.
d. Proporcionar un canal alternativo.
e. Preservar evidencia.
f. Notificar la solución.

76. FUERZA MAYOR

Cuando una interrupción resulte de una circunstancia fuera del control razonable de las partes, la solución podrá considerar:

a. Reprogramación.
b. Crédito.
c. Reembolso.
d. Cumplimiento posterior.
e. Costos no recuperables.
f. Legislación aplicable.

77. CAMBIOS A ESTA POLÍTICA

Esta Política podrá actualizarse por:

a. Nuevos productos.
b. Nuevos métodos.
c. Nuevos proveedores.
d. Cambios legales.
e. Cambios de procesador.
f. Nuevos modelos de saldo.
g. Auditorías.
h. Fraude.
i. Quejas.
j. Correcciones.
k. Expansión territorial.

78. RELACIÓN CON OTROS DOCUMENTOS

Esta Política deberá interpretarse junto con:

a. MASS-LC-000, Gobernanza del Centro Legal.
b. MASS-LC-001, Definiciones legales.
c. MASS-LC-002, Acuerdo de usuario MASS ID.
d. MASS-LC-003, Aviso de privacidad.
e. MASS-LC-004, Política de seguridad.
f. MASS-LC-007, Política de pagos.
g. MASS-LC-009, Política antifraude.
h. MASS-LC-010, Normas de la comunidad.
i. Condiciones específicas de cada servicio.
j. Condiciones mostradas antes del pago.

79. CONFLICTOS

En caso de conflicto se aplicará, salvo disposición legal distinta:

a. Legislación obligatoria.
b. Requisitos regulatorios.
c. Reglas obligatorias del proveedor financiero.
d. Condiciones específicas mostradas al comprar.
e. Política específica del servicio.
f. Esta Política.
g. Política de pagos.
h. Acuerdo de usuario MASS ID.
i. Definiciones del MASS ID Legal Center.

80. CONTACTO

Antes de la publicación definitiva deberán incorporarse:

a. Correo oficial de reembolsos.
b. Formulario de solicitud.
c. Canal para transacciones no autorizadas.
d. Canal de apelaciones.
e. Canal para organizadores.
f. Dirección postal.
g. Plazos específicos.
h. Proveedores activos.
i. Procedimiento de seguimiento.
j. Información legal adicional.

81. ADMINISTRACIÓN CONTINUA

MASS-LC-008 será administrado como un documento evolutivo del MASS ID Legal Center.

Su contenido deberá revisarse cuando cambien los productos, servicios, organizadores, métodos de pago, proveedores, prácticas reales, derechos obligatorios o procedimientos del ecosistema MASS.

FIN DEL DOCUMENTO MASS-LC-008
`
},
    {
      codigo: "MASS-LC-009",
      titulo: "Política antifraude",
      descripcion:
        "Establece medidas para prevenir abuso, suplantación de identidad, fraude y actividades sospechosas.",
      version: "1.0",
      estado: "En revisión"
    },
    {
      codigo: "MASS-LC-010",
      titulo: "Normas de la comunidad",
      descripcion:
        "Define las conductas permitidas y prohibidas dentro de los servicios del ecosistema MASS.",
      version: "1.0",
      estado: "En revisión"
    }
  ]);  

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

/* Herramientas del panel Privacidad */
function normalizarPreferenciasPrivacidad(
  preferencias
) {
  const datos = preferencias || {};

  return {
    perfil_publico:
      datos.perfil_publico === true,

    mostrar_telefono:
      datos.mostrar_telefono === true,

    mostrar_correo:
      datos.mostrar_correo === true,

    promociones:
      datos.promociones === true,

    personalizacion:
      datos.personalizacion === true
  };
}


/* Colocar las preferencias en los controles */
function aplicarPreferenciasPrivacidad(
  preferencias
) {
  const datos =
    normalizarPreferenciasPrivacidad(
      preferencias
    );

  if (inputPrivacidadPerfilPublico) {
    inputPrivacidadPerfilPublico.checked =
      datos.perfil_publico;
  }

  if (inputPrivacidadMostrarTelefono) {
    inputPrivacidadMostrarTelefono.checked =
      datos.mostrar_telefono;
  }

  if (inputPrivacidadMostrarCorreo) {
    inputPrivacidadMostrarCorreo.checked =
      datos.mostrar_correo;
  }

  if (inputPrivacidadPromociones) {
    inputPrivacidadPromociones.checked =
      datos.promociones;
  }

  if (inputPrivacidadPersonalizacion) {
    inputPrivacidadPersonalizacion.checked =
      datos.personalizacion;
  }
}


/* Leer los valores actuales del formulario */
function leerPreferenciasPrivacidadFormulario() {
  return {
    perfil_publico:
      Boolean(
        inputPrivacidadPerfilPublico?.checked
      ),

    mostrar_telefono:
      Boolean(
        inputPrivacidadMostrarTelefono
          ?.checked
      ),

    mostrar_correo:
      Boolean(
        inputPrivacidadMostrarCorreo?.checked
      ),

    promociones:
      Boolean(
        inputPrivacidadPromociones?.checked
      ),

    personalizacion:
      Boolean(
        inputPrivacidadPersonalizacion
          ?.checked
      )
  };
}


/* Conservar una copia de las preferencias */
function establecerPreferenciasPrivacidadOriginales(
  preferencias
) {
  preferenciasPrivacidadOriginales =
    normalizarPreferenciasPrivacidad(
      preferencias
    );
}


/* Mostrar mensajes del panel Privacidad */
function mostrarMensajePrivacidad(
  texto,
  color
) {
  if (!mensajePrivacidad) {
    return;
  }

  mensajePrivacidad.textContent =
    texto;

  mensajePrivacidad.style.color =
    color;

  mensajePrivacidad.style.borderColor =
    color;

  mensajePrivacidad.style.display =
    "block";
}


/* Ocultar mensajes del panel Privacidad */
function ocultarMensajePrivacidad() {
  if (!mensajePrivacidad) {
    return;
  }

  mensajePrivacidad.textContent =
    "";

  mensajePrivacidad.style.display =
    "none";
}


/* Restaurar cambios que no fueron guardados */
function restaurarPreferenciasPrivacidad() {
  aplicarPreferenciasPrivacidad(
    preferenciasPrivacidadOriginales
  );

  ocultarMensajePrivacidad();
}


/* Regresar desde el panel Privacidad */
function regresarDesdePrivacidad() {
  restaurarPreferenciasPrivacidad();

  if (seccionPrivacidad) {
    seccionPrivacidad.style.display =
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

/* Cargar preferencias privadas desde Supabase */
async function cargarPreferenciasPrivacidad() {
  privacidadMassCargada = false;

  ocultarMensajePrivacidad();

  aplicarPreferenciasPrivacidad({
    perfil_publico: false,
    mostrar_telefono: false,
    mostrar_correo: false,
    promociones: false,
    personalizacion: false
  });

  if (!user?.id) {
    mostrarMensajePrivacidad(
      "❌ No fue posible identificar la cuenta activa.",
      "#ff5b5b"
    );

    return false;
  }

  if (btnGuardarPrivacidad) {
    btnGuardarPrivacidad.disabled =
      true;

    btnGuardarPrivacidad.textContent =
      "⏳ Cargando preferencias...";

    btnGuardarPrivacidad.style.cursor =
      "not-allowed";

    btnGuardarPrivacidad.style.opacity =
      ".7";
  }

  try {
    const {
      data: privacidadGuardada,
      error: errorCargarPrivacidad
    } =
      await supabaseClient
        .from("privacidad_mass")
        .select(`
          perfil_publico,
          mostrar_telefono,
          mostrar_correo,
          promociones,
          personalizacion
        `)
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (errorCargarPrivacidad) {
      throw errorCargarPrivacidad;
    }

    /*
      Si todavía no existe una fila,
      aplicamos privacidad máxima.
      La fila se creará al guardar.
    */
    if (!privacidadGuardada) {
      const preferenciasIniciales = {
        perfil_publico: false,
        mostrar_telefono: false,
        mostrar_correo: false,
        promociones: false,
        personalizacion: false
      };

      establecerPreferenciasPrivacidadOriginales(
        preferenciasIniciales
      );

      aplicarPreferenciasPrivacidad(
        preferenciasIniciales
      );

      privacidadMassCargada = true;

      mostrarMensajePrivacidad(
        "🛡️ Privacidad máxima aplicada. Todas las preferencias comienzan desactivadas.",
        "#39ff14"
      );

      return true;
    }

    const preferenciasNormalizadas =
      normalizarPreferenciasPrivacidad(
        privacidadGuardada
      );

    establecerPreferenciasPrivacidadOriginales(
      preferenciasNormalizadas
    );

    aplicarPreferenciasPrivacidad(
      preferenciasNormalizadas
    );

    privacidadMassCargada = true;

    mostrarMensajePrivacidad(
      "✅ Tus preferencias de privacidad fueron cargadas correctamente.",
      "#39ff14"
    );

    return true;
  } catch (error) {
    console.error(
      "ERROR CARGANDO PRIVACIDAD MASS:",
      error
    );

    privacidadMassCargada = false;

    mostrarMensajePrivacidad(
      "❌ No fue posible cargar tus preferencias de privacidad.",
      "#ff5b5b"
    );

    return false;
  } finally {
    if (btnGuardarPrivacidad) {
      btnGuardarPrivacidad.disabled =
        false;

      btnGuardarPrivacidad.textContent =
        "💾 Guardar preferencias";

      btnGuardarPrivacidad.style.cursor =
        "pointer";

      btnGuardarPrivacidad.style.opacity =
        "1";
    }
  }
}

/* Abrir el panel Privacidad */
if (
  btnPrivacidad &&
  menuPrincipal &&
  seccionPrivacidad
) {
  btnPrivacidad.onclick =
    async function () {
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

      if (seccionCambiarTelefono) {
        seccionCambiarTelefono.style.display =
          "none";
      }

      if (seccionCambiarContrasena) {
        seccionCambiarContrasena.style.display =
          "none";
      }

      seccionPrivacidad.style.display =
        "block";

      seccionPrivacidad.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      await cargarPreferenciasPrivacidad();
    };
}


/* Volver desde el panel Privacidad */
if (
  btnVolverPrivacidad &&
  menuPrincipal &&
  seccionPrivacidad
) {
  btnVolverPrivacidad.onclick =
    function () {
      regresarDesdePrivacidad();
    };
}


/* Cancelar cambios de Privacidad */
if (
  btnCancelarPrivacidad &&
  menuPrincipal &&
  seccionPrivacidad
) {
  btnCancelarPrivacidad.onclick =
    function () {
      regresarDesdePrivacidad();
    };
}

/* Guardar preferencias de Privacidad */
if (btnGuardarPrivacidad) {
  btnGuardarPrivacidad.onclick =
    async function () {
      if (!user?.id) {
        mostrarMensajePrivacidad(
          "❌ No fue posible identificar la cuenta activa.",
          "#ff5b5b"
        );

        return;
      }

      if (!privacidadMassCargada) {
        mostrarMensajePrivacidad(
          "❌ Las preferencias no terminaron de cargar. Cierra y vuelve a abrir Privacidad.",
          "#ff5b5b"
        );

        return;
      }

      const nuevasPreferencias =
        leerPreferenciasPrivacidadFormulario();

      const textoOriginalBotonPrivacidad =
        btnGuardarPrivacidad.textContent;

      btnGuardarPrivacidad.disabled =
        true;

      btnGuardarPrivacidad.textContent =
        "⏳ Guardando preferencias...";

      btnGuardarPrivacidad.style.cursor =
        "not-allowed";

      btnGuardarPrivacidad.style.opacity =
        ".7";

      mostrarMensajePrivacidad(
        "⏳ Guardando tus preferencias privadas...",
        "#ffffff"
      );

      try {
        const {
          data: privacidadActualizada,
          error: errorGuardarPrivacidad
        } =
          await supabaseClient
            .from("privacidad_mass")
            .upsert(
              {
                auth_user_id: user.id,

                perfil_publico:
                  nuevasPreferencias
                    .perfil_publico,

                mostrar_telefono:
                  nuevasPreferencias
                    .mostrar_telefono,

                mostrar_correo:
                  nuevasPreferencias
                    .mostrar_correo,

                promociones:
                  nuevasPreferencias
                    .promociones,

                personalizacion:
                  nuevasPreferencias
                    .personalizacion
              },
              {
                onConflict: "auth_user_id"
              }
            )
            .select(`
              perfil_publico,
              mostrar_telefono,
              mostrar_correo,
              promociones,
              personalizacion
            `)
            .maybeSingle();

        if (errorGuardarPrivacidad) {
          throw errorGuardarPrivacidad;
        }

        if (!privacidadActualizada) {
          throw new Error(
            "Supabase no devolvió las preferencias guardadas."
          );
        }

        const preferenciasConfirmadas =
          normalizarPreferenciasPrivacidad(
            privacidadActualizada
          );

        establecerPreferenciasPrivacidadOriginales(
          preferenciasConfirmadas
        );

        aplicarPreferenciasPrivacidad(
          preferenciasConfirmadas
        );

        privacidadMassCargada = true;

        mostrarMensajePrivacidad(
          "✅ Tus preferencias de privacidad fueron guardadas correctamente.",
          "#39ff14"
        );

        btnGuardarPrivacidad.textContent =
          "✅ Preferencias guardadas";

        btnGuardarPrivacidad.style.opacity =
          "1";

        setTimeout(function () {
          if (!btnGuardarPrivacidad) {
            return;
          }

          btnGuardarPrivacidad.textContent =
            textoOriginalBotonPrivacidad;
        }, 1500);
      } catch (error) {
        console.error(
          "ERROR GUARDANDO PRIVACIDAD MASS:",
          error
        );

        mostrarMensajePrivacidad(
          "❌ No fue posible guardar tus preferencias de privacidad.",
          "#ff5b5b"
        );
      } finally {
        btnGuardarPrivacidad.disabled =
          false;

        btnGuardarPrivacidad.style.cursor =
          "pointer";

        btnGuardarPrivacidad.style.opacity =
          "1";
      }
    };
}

/* Mostrar mensajes del panel Documentos legales */
function mostrarMensajeDocumentosLegales(
  texto,
  color
) {
  if (!mensajeDocumentosLegales) {
    return;
  }

  mensajeDocumentosLegales.textContent =
    texto;

  mensajeDocumentosLegales.style.color =
    color;

  mensajeDocumentosLegales.style.borderColor =
    color;

  mensajeDocumentosLegales.style.display =
    texto ? "block" : "none";
}

/* Ocultar mensajes del panel Documentos legales */
function ocultarMensajeDocumentosLegales() {
  if (!mensajeDocumentosLegales) {
    return;
  }

  mensajeDocumentosLegales.textContent = "";
  mensajeDocumentosLegales.style.display =
    "none";
}

/* Abrir un documento legal en el visor individual */
function abrirDocumentoLegalMassId(codigoDocumento) {
  const documentoLegal =
    catalogoDocumentosLegalesMassId.find(
      function (documento) {
        return documento.codigo === codigoDocumento;
      }
    );

  if (
    !documentoLegal ||
    !listaDocumentosLegales ||
    !detalleDocumentoLegal
  ) {
    mostrarMensajeDocumentosLegales(
      "❌ No fue posible abrir el documento seleccionado.",
      "#ff5b5b"
    );

    return;
  }

  const contenidoTemporal =
    documentoLegal.contenido ||
    (
      documentoLegal.descripcion +
      "\n\n" +
      "El contenido jurídico completo de este documento se encuentra actualmente en preparación dentro del MASS ID Legal Center."
    );

  listaDocumentosLegales.style.display = "none";
  detalleDocumentoLegal.style.display = "block";

  if (estadoDocumentoLegal) {
    estadoDocumentoLegal.textContent =
      documentoLegal.estado || "En preparación";
  }

  if (codigoDocumentoLegal) {
    codigoDocumentoLegal.textContent =
      documentoLegal.codigo || "";
  }

  if (tituloDocumentoLegal) {
    tituloDocumentoLegal.textContent =
      documentoLegal.titulo || "Documento legal";
  }

  if (versionDocumentoLegal) {
    versionDocumentoLegal.textContent =
      documentoLegal.version || "1.0";
  }

  if (vigenciaDocumentoLegal) {
    vigenciaDocumentoLegal.textContent =
      documentoLegal.vigencia || "Pendiente";
  }

  if (contenidoDocumentoLegal) {
    contenidoDocumentoLegal.textContent =
      contenidoTemporal;
  }

  detalleDocumentoLegal.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

/* Regresar del visor individual a la lista */
function regresarListaDocumentosLegalesMassId() {
  if (detalleDocumentoLegal) {
    detalleDocumentoLegal.style.display = "none";
  }

  if (listaDocumentosLegales) {
    listaDocumentosLegales.style.display = "grid";

    listaDocumentosLegales.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

/* Mostrar el catálogo de documentos legales */
function renderizarDocumentosLegalesMassId() {
  if (!listaDocumentosLegales) {
    return;
  }

  if (detalleDocumentoLegal) {
    detalleDocumentoLegal.style.display = "none";
  }

  listaDocumentosLegales.style.display = "grid";

  listaDocumentosLegales.innerHTML =
    catalogoDocumentosLegalesMassId
      .map(function (documentoLegal) {
        return `
          <article
            data-documento-legal="${documentoLegal.codigo}"
            role="button"
            tabindex="0"
            aria-label="Abrir ${documentoLegal.titulo}"
            style="
              padding:16px;
              border:1px solid #333;
              border-radius:12px;
              background:#141414;
              display:flex;
              flex-direction:column;
              gap:10px;
              min-height:210px;
              cursor:pointer;
              transition:
                border-color .2s ease,
                transform .2s ease,
                box-shadow .2s ease;
            "
          >
            <div
              style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:10px;
                flex-wrap:wrap;
              "
            >
              <strong
                style="
                  color:#39ff14;
                  font-size:13px;
                  letter-spacing:.5px;
                "
              >
                ${documentoLegal.codigo}
              </strong>

              <span
                style="
                  padding:5px 9px;
                  border:1px solid #666;
                  border-radius:999px;
                  color:#ddd;
                  font-size:11px;
                  font-weight:bold;
                "
              >
                ${documentoLegal.estado}
              </span>
            </div>

            <h4
              style="
                margin:0;
                color:#fff;
                font-size:17px;
                line-height:1.35;
              "
            >
              ${documentoLegal.titulo}
            </h4>

            <p
              style="
                margin:0;
                color:#bbb;
                font-size:13px;
                line-height:1.55;
                flex:1;
              "
            >
              ${documentoLegal.descripcion}
            </p>

            <div
              style="
                padding-top:10px;
                border-top:1px solid #2f2f2f;
                color:#999;
                font-size:12px;
                display:flex;
                justify-content:space-between;
                gap:10px;
                flex-wrap:wrap;
              "
            >
              <span>
                Versión ${documentoLegal.version}
              </span>

              <span style="color:#39ff14;">
                Consultar →
              </span>
            </div>
          </article>
        `;
      })
      .join("");

  const tarjetasDocumentos =
    listaDocumentosLegales.querySelectorAll(
      "[data-documento-legal]"
    );

  tarjetasDocumentos.forEach(
    function (tarjetaDocumento) {
      const codigoDocumento =
        tarjetaDocumento.getAttribute(
          "data-documento-legal"
        );

      tarjetaDocumento.onclick =
        function () {
          abrirDocumentoLegalMassId(
            codigoDocumento
          );
        };

      tarjetaDocumento.onkeydown =
        function (evento) {
          if (
            evento.key === "Enter" ||
            evento.key === " "
          ) {
            evento.preventDefault();

            abrirDocumentoLegalMassId(
              codigoDocumento
            );
          }
        };

      tarjetaDocumento.onmouseenter =
        function () {
          tarjetaDocumento.style.borderColor =
            "#39ff14";

          tarjetaDocumento.style.transform =
            "translateY(-2px)";

          tarjetaDocumento.style.boxShadow =
            "0 8px 22px rgba(57,255,20,.12)";
        };

      tarjetaDocumento.onmouseleave =
        function () {
          tarjetaDocumento.style.borderColor =
            "#333";

          tarjetaDocumento.style.transform =
            "translateY(0)";

          tarjetaDocumento.style.boxShadow =
            "none";
        };
    }
  );

  mostrarMensajeDocumentosLegales(
    `✅ ${catalogoDocumentosLegalesMassId.length} documentos oficiales cargados.`,
    "#39ff14"
  );
}

/* Botón para regresar del documento individual */
if (
  btnVolverListaDocumentosLegales &&
  listaDocumentosLegales &&
  detalleDocumentoLegal
) {
  btnVolverListaDocumentosLegales.onclick =
    function () {
      regresarListaDocumentosLegalesMassId();
    };
}

/* Regresar desde el panel Documentos legales */
function regresarDesdeDocumentosLegales() {
  ocultarMensajeDocumentosLegales();

  if (seccionDocumentosLegales) {
    seccionDocumentosLegales.style.display =
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

/* Abrir el panel Documentos legales */
if (
  btnDocumentosLegales &&
  menuPrincipal &&
  seccionDocumentosLegales
) {
  btnDocumentosLegales.onclick =
    function () {
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

if (seccionCambiarTelefono) {
  seccionCambiarTelefono.style.display =
    "none";
}

if (seccionCambiarContrasena) {
  seccionCambiarContrasena.style.display =
    "none";
}

if (seccionPrivacidad) {
  seccionPrivacidad.style.display =
    "none";
}

      seccionDocumentosLegales.style.display =
        "block";

      renderizarDocumentosLegalesMassId();

      seccionDocumentosLegales.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    };
}

/* Volver desde Documentos legales */
if (
  btnVolverDocumentosLegales &&
  menuPrincipal &&
  seccionDocumentosLegales
) {
  btnVolverDocumentosLegales.onclick =
    function () {
      regresarDesdeDocumentosLegales();
    };
}  

/* Limpiar formulario de Cambiar contraseña */
function limpiarFormularioCambioContrasena() {
  if (inputPasswordActualCambioContrasena) {
    inputPasswordActualCambioContrasena.value =
      "";
  }

  if (inputNuevaContrasena) {
    inputNuevaContrasena.value =
      "";
  }

  if (inputConfirmarNuevaContrasena) {
    inputConfirmarNuevaContrasena.value =
      "";
  }

  factorMfaCambioContrasenaId = null;
  nuevaContrasenaPendienteCambio = "";
  mfaCambioContrasenaAprobado = false;

  if (mensajeCambioContrasena) {
    mensajeCambioContrasena.textContent =
      "";

    mensajeCambioContrasena.style.display =
      "none";
  }

  if (panelMfaCambioContrasena) {
    panelMfaCambioContrasena.style.display =
      "none";
  }

  if (inputCodigoMfaCambioContrasena) {
    inputCodigoMfaCambioContrasena.value =
      "";
  }

  if (mensajeMfaCambioContrasena) {
    mensajeMfaCambioContrasena.textContent =
      "";

    mensajeMfaCambioContrasena.style.display =
      "none";
  }

  if (btnContinuarCambioContrasena) {
    btnContinuarCambioContrasena.disabled =
      false;

    btnContinuarCambioContrasena.style.display =
      "block";

    btnContinuarCambioContrasena.textContent =
      "🔐 Continuar y verificar identidad";

    btnContinuarCambioContrasena.style.cursor =
      "pointer";

    btnContinuarCambioContrasena.style.opacity =
      "1";
  }

  if (btnConfirmarMfaCambioContrasena) {
    btnConfirmarMfaCambioContrasena.disabled =
      false;

    btnConfirmarMfaCambioContrasena.textContent =
      "✅ Confirmar código y cambiar contraseña";

    btnConfirmarMfaCambioContrasena.style.cursor =
      "pointer";

    btnConfirmarMfaCambioContrasena.style.opacity =
      "1";
  }
}

/* Mostrar mensajes de Cambiar contraseña */
function mostrarMensajeCambioContrasena(
  texto,
  color
) {
  if (!mensajeCambioContrasena) {
    return;
  }

  mensajeCambioContrasena.textContent =
    texto;

  mensajeCambioContrasena.style.color =
    color;

  mensajeCambioContrasena.style.borderColor =
    color;

  mensajeCambioContrasena.style.display =
    "block";
}

/* Mostrar mensajes MFA de Cambiar contraseña */
function mostrarMensajeMfaCambioContrasena(
  texto,
  color
) {
  if (!mensajeMfaCambioContrasena) {
    return;
  }

  mensajeMfaCambioContrasena.textContent =
    texto;

  mensajeMfaCambioContrasena.style.color =
    color;

  mensajeMfaCambioContrasena.style.borderColor =
    color;

  mensajeMfaCambioContrasena.style.display =
    "block";
}

/* Regresar desde Cambiar contraseña */
function regresarDesdeCambioContrasena() {
  limpiarFormularioCambioContrasena();

  if (seccionCambiarContrasena) {
    seccionCambiarContrasena.style.display =
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

/* Abrir Cambiar contraseña */
if (
  btnCambiarContrasena &&
  menuPrincipal &&
  seccionCambiarContrasena
) {
  btnCambiarContrasena.onclick =
    function () {
      limpiarFormularioCambioContrasena();

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

      if (seccionCambiarTelefono) {
        seccionCambiarTelefono.style.display =
          "none";
      }

      seccionCambiarContrasena.style.display =
        "block";

      seccionCambiarContrasena.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      setTimeout(function () {
        inputPasswordActualCambioContrasena
          ?.focus();
      }, 150);
    };
}

/* Volver desde Cambiar contraseña */
if (
  btnVolverCambiarContrasena &&
  menuPrincipal &&
  seccionCambiarContrasena
) {
  btnVolverCambiarContrasena.onclick =
    function () {
      regresarDesdeCambioContrasena();
    };
}

/* Cancelar Cambiar contraseña */
if (
  btnCancelarCambioContrasena &&
  menuPrincipal &&
  seccionCambiarContrasena
) {
  btnCancelarCambioContrasena.onclick =
    function () {
      regresarDesdeCambioContrasena();
    };
} 

/* Validar datos de Cambiar contraseña */
if (
  btnContinuarCambioContrasena &&
  inputPasswordActualCambioContrasena &&
  inputNuevaContrasena &&
  inputConfirmarNuevaContrasena
) {
  btnContinuarCambioContrasena.onclick =
    async function () {
      const passwordActual =
        inputPasswordActualCambioContrasena
          .value;

      const nuevaContrasena =
        inputNuevaContrasena.value;

      const confirmarNuevaContrasena =
        inputConfirmarNuevaContrasena
          .value;

      if (!passwordActual) {
        mostrarMensajeCambioContrasena(
          "❌ Escribe tu contraseña actual.",
          "#ff5b5b"
        );

        inputPasswordActualCambioContrasena
          .focus();

        return;
      }

      if (!nuevaContrasena) {
        mostrarMensajeCambioContrasena(
          "❌ Escribe la nueva contraseña.",
          "#ff5b5b"
        );

        inputNuevaContrasena.focus();
        return;
      }

      if (nuevaContrasena.length < 8) {
        mostrarMensajeCambioContrasena(
          "❌ La nueva contraseña debe tener por lo menos 8 caracteres.",
          "#ff5b5b"
        );

        inputNuevaContrasena.focus();
        return;
      }

      if (nuevaContrasena === passwordActual) {
        mostrarMensajeCambioContrasena(
          "❌ La nueva contraseña debe ser diferente a la contraseña actual.",
          "#ff5b5b"
        );

        inputNuevaContrasena.focus();
        return;
      }

      if (!confirmarNuevaContrasena) {
        mostrarMensajeCambioContrasena(
          "❌ Confirma la nueva contraseña.",
          "#ff5b5b"
        );

        inputConfirmarNuevaContrasena.focus();
        return;
      }

      if (
        nuevaContrasena !==
        confirmarNuevaContrasena
      ) {
        mostrarMensajeCambioContrasena(
          "❌ Las nuevas contraseñas no coinciden.",
          "#ff5b5b"
        );

        inputConfirmarNuevaContrasena
          .focus();

        return;
      }

      const correoActual =
        (
          user.email ||
          perfil.email ||
          ""
        )
          .trim()
          .toLowerCase();

      if (!correoActual) {
        mostrarMensajeCambioContrasena(
          "❌ No fue posible identificar el correo de tu cuenta.",
          "#ff5b5b"
        );

        return;
      }

      const textoOriginalBotonContrasena =
        btnContinuarCambioContrasena
          .textContent;

      let clienteVerificacionPasswordContrasena =
        null;

      let esperandoMfaContrasena =
        false;

      btnContinuarCambioContrasena.disabled =
        true;

      btnContinuarCambioContrasena.textContent =
        "⏳ Confirmando contraseña...";

      btnContinuarCambioContrasena.style.cursor =
        "not-allowed";

      btnContinuarCambioContrasena.style.opacity =
        ".7";

      mostrarMensajeCambioContrasena(
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
        clienteVerificacionPasswordContrasena =
          window.supabase.createClient(
            supabaseClient.supabaseUrl,
            supabaseClient.supabaseKey,
            {
              auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
                storageKey:
                  "mass-password-change-check-" +
                  Date.now()
              }
            }
          );

        const {
          data: datosPasswordContrasena,
          error: errorPasswordContrasena
        } =
          await clienteVerificacionPasswordContrasena
            .auth
            .signInWithPassword({
              email: correoActual,
              password: passwordActual
            });

        if (
          errorPasswordContrasena ||
          !datosPasswordContrasena?.user
        ) {
          inputPasswordActualCambioContrasena
            .value = "";

          mostrarMensajeCambioContrasena(
            "❌ La contraseña actual es incorrecta.",
            "#ff5b5b"
          );

          inputPasswordActualCambioContrasena
            .focus();

          return;
        }

        if (
          datosPasswordContrasena.user.id !==
          user.id
        ) {
          throw new Error(
            "La identidad confirmada no coincide con la sesión activa."
          );
        }

        inputPasswordActualCambioContrasena
          .value = "";

        const {
          data: factoresCambioContrasena,
          error: errorFactoresCambioContrasena
        } =
          await supabaseClient.auth.mfa
            .listFactors();

        if (errorFactoresCambioContrasena) {
          throw errorFactoresCambioContrasena;
        }

        const listaFactoresCambioContrasena =
          Array.isArray(
            factoresCambioContrasena?.all
          )
            ? factoresCambioContrasena.all
            : [
                ...(
                  Array.isArray(
                    factoresCambioContrasena
                      ?.totp
                  )
                    ? factoresCambioContrasena
                        .totp
                    : []
                ),
                ...(
                  Array.isArray(
                    factoresCambioContrasena
                      ?.phone
                  )
                    ? factoresCambioContrasena
                        .phone
                    : []
                )
              ];

        const factorVerificadoCambioContrasena =
          listaFactoresCambioContrasena.find(
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

        nuevaContrasenaPendienteCambio =
          nuevaContrasena;

       if (
  !factorVerificadoCambioContrasena?.id
) {
  mfaCambioContrasenaAprobado =
    true;

  mostrarMensajeCambioContrasena(
    "⏳ Contraseña actual confirmada. Actualizando tu nueva contraseña...",
    "#ffffff"
  );

  btnContinuarCambioContrasena.textContent =
    "⏳ Actualizando contraseña...";

  const {
    data: datosContrasenaActualizada,
    error: errorActualizarContrasena
  } =
    await supabaseClient.auth.updateUser({
      password:
        nuevaContrasenaPendienteCambio
    });

  if (errorActualizarContrasena) {
    throw errorActualizarContrasena;
  }

  if (
    !datosContrasenaActualizada?.user ||
    datosContrasenaActualizada.user.id !==
      user.id
  ) {
    throw new Error(
      "La contraseña se actualizó en una cuenta diferente a la sesión activa."
    );
  }

  inputNuevaContrasena.value =
    "";

  inputConfirmarNuevaContrasena.value =
    "";

  mostrarMensajeCambioContrasena(
    "✅ Tu contraseña fue actualizada correctamente.",
    "#39ff14"
  );

  btnContinuarCambioContrasena.textContent =
    "✅ Contraseña actualizada";

  btnContinuarCambioContrasena.style.opacity =
    "1";

  alert(
    "✅ Tu contraseña fue actualizada correctamente."
  );

  regresarDesdeCambioContrasena();

  return;
} 

        factorMfaCambioContrasenaId =
          factorVerificadoCambioContrasena.id;

        mfaCambioContrasenaAprobado =
          false;

        esperandoMfaContrasena =
          true;

        if (inputCodigoMfaCambioContrasena) {
          inputCodigoMfaCambioContrasena
            .value = "";
        }

        if (mensajeMfaCambioContrasena) {
          mensajeMfaCambioContrasena
            .textContent = "";

          mensajeMfaCambioContrasena
            .style.display = "none";
        }

        if (panelMfaCambioContrasena) {
          panelMfaCambioContrasena
            .style.display = "block";

          panelMfaCambioContrasena
            .scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
        }

        btnContinuarCambioContrasena
          .style.display = "none";

        mostrarMensajeCambioContrasena(
          "✅ Contraseña actual confirmada. Escribe ahora el código de seguridad de tu aplicación.",
          "#39ff14"
        );

        setTimeout(function () {
          inputCodigoMfaCambioContrasena
            ?.focus();
        }, 150);
      } catch (error) {
        console.error(
          "ERROR CONFIRMANDO CONTRASEÑA ACTUAL:",
          error
        );

        inputPasswordActualCambioContrasena
          .value = "";

        mostrarMensajeCambioContrasena(
          "❌ No fue posible confirmar tu contraseña. Inténtalo nuevamente.",
          "#ff5b5b"
        );

        inputPasswordActualCambioContrasena
          .focus();
      } finally {
        if (
          clienteVerificacionPasswordContrasena
        ) {
          try {
            await clienteVerificacionPasswordContrasena
              .auth
              .signOut({
                scope: "local"
              });
          } catch (
            errorCerrarVerificacionContrasena
          ) {
            console.warn(
              "No fue posible cerrar el cliente temporal:",
              errorCerrarVerificacionContrasena
            );
          }

          if (
            typeof clienteVerificacionPasswordContrasena
              .auth.dispose === "function"
          ) {
            clienteVerificacionPasswordContrasena
              .auth.dispose();
          }
        }

        if (!esperandoMfaContrasena) {
          btnContinuarCambioContrasena
            .disabled = false;

          btnContinuarCambioContrasena
            .textContent =
              textoOriginalBotonContrasena;

          btnContinuarCambioContrasena
            .style.cursor = "pointer";

          btnContinuarCambioContrasena
            .style.opacity = "1";
        }
      }
    };
} 

/* Permitir solamente seis números en MFA */
if (inputCodigoMfaCambioContrasena) {
  inputCodigoMfaCambioContrasena.oninput =
    function () {
      this.value = this.value
        .replace(/\D/g, "")
        .slice(0, 6);
    };
}

/* Confirmar MFA y cambiar contraseña */
if (
  btnConfirmarMfaCambioContrasena &&
  inputCodigoMfaCambioContrasena
) {
  btnConfirmarMfaCambioContrasena.onclick =
    async function () {
      const codigoMfaContrasena =
        inputCodigoMfaCambioContrasena.value
          .replace(/\D/g, "");

      if (
        !factorMfaCambioContrasenaId ||
        !nuevaContrasenaPendienteCambio
      ) {
        mostrarMensajeMfaCambioContrasena(
          "❌ La solicitud de cambio venció. Vuelve a comenzar el proceso.",
          "#ff5b5b"
        );

        return;
      }

      if (
        !/^\d{6}$/.test(
          codigoMfaContrasena
        )
      ) {
        mostrarMensajeMfaCambioContrasena(
          "❌ Escribe el código completo de seis dígitos.",
          "#ff5b5b"
        );

        inputCodigoMfaCambioContrasena
          .focus();

        return;
      }

      const textoOriginalBotonMfaContrasena =
        btnConfirmarMfaCambioContrasena
          .textContent;

      let procesoContrasenaCompletado =
        false;

      btnConfirmarMfaCambioContrasena.disabled =
        true;

      btnConfirmarMfaCambioContrasena.textContent =
        "⏳ Confirmando código...";

      btnConfirmarMfaCambioContrasena.style.cursor =
        "not-allowed";

      btnConfirmarMfaCambioContrasena.style.opacity =
        ".7";

      mostrarMensajeMfaCambioContrasena(
        "⏳ Confirmando tu identidad...",
        "#ffffff"
      );

      try {
        const {
          error: errorConfirmarMfaContrasena
        } =
          await supabaseClient.auth.mfa
            .challengeAndVerify({
              factorId:
                factorMfaCambioContrasenaId,
              code:
                codigoMfaContrasena
            });

        if (errorConfirmarMfaContrasena) {
          inputCodigoMfaCambioContrasena
            .value = "";

          mostrarMensajeMfaCambioContrasena(
            "❌ El código es incorrecto o venció. Escribe el código actual de tu aplicación.",
            "#ff5b5b"
          );

          inputCodigoMfaCambioContrasena
            .focus();

          return;
        }

        mfaCambioContrasenaAprobado =
          true;

        inputCodigoMfaCambioContrasena
          .value = "";

        btnConfirmarMfaCambioContrasena
          .textContent =
            "⏳ Actualizando contraseña...";

        mostrarMensajeMfaCambioContrasena(
          "⏳ Identidad confirmada. Actualizando tu contraseña...",
          "#ffffff"
        );

        const {
          data: datosContrasenaActualizadaMfa,
          error: errorActualizarContrasenaMfa
        } =
          await supabaseClient.auth.updateUser({
            password:
              nuevaContrasenaPendienteCambio
          });

        if (errorActualizarContrasenaMfa) {
          throw errorActualizarContrasenaMfa;
        }

        if (
          !datosContrasenaActualizadaMfa?.user ||
          datosContrasenaActualizadaMfa
            .user.id !== user.id
        ) {
          throw new Error(
            "La contraseña se actualizó en una cuenta diferente a la sesión activa."
          );
        }

        procesoContrasenaCompletado =
          true;

        if (inputNuevaContrasena) {
          inputNuevaContrasena.value =
            "";
        }

        if (inputConfirmarNuevaContrasena) {
          inputConfirmarNuevaContrasena
            .value = "";
        }

        mostrarMensajeMfaCambioContrasena(
          "✅ Tu identidad fue confirmada y la contraseña fue actualizada correctamente.",
          "#39ff14"
        );

        btnConfirmarMfaCambioContrasena
          .textContent =
            "✅ Contraseña actualizada";

        btnConfirmarMfaCambioContrasena
          .style.opacity = "1";

        alert(
          "✅ Tu contraseña fue actualizada correctamente."
        );

        regresarDesdeCambioContrasena();
      } catch (error) {
        console.error(
          "ERROR CAMBIANDO CONTRASEÑA CON MFA:",
          error
        );

        inputCodigoMfaCambioContrasena
          .value = "";

        mostrarMensajeMfaCambioContrasena(
          "❌ No fue posible actualizar la contraseña. Inténtalo nuevamente.",
          "#ff5b5b"
        );

        inputCodigoMfaCambioContrasena
          .focus();
      } finally {
        if (!procesoContrasenaCompletado) {
          btnConfirmarMfaCambioContrasena
            .disabled = false;

          btnConfirmarMfaCambioContrasena
            .textContent =
              textoOriginalBotonMfaContrasena;

          btnConfirmarMfaCambioContrasena
            .style.cursor = "pointer";

          btnConfirmarMfaCambioContrasena
            .style.opacity = "1";
        }
      }
    };
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

factorMfaCambioTelefonoId = null;
nuevoTelefonoPendienteCambio = "";
telefonoE164PendienteCambio = "";
mfaCambioTelefonoAprobado = false;
smsCambioTelefonoEnviado = false;
smsCambioTelefonoConfirmado = false;

if (temporizadorReenvioSmsCambioTelefono) {
  clearInterval(
    temporizadorReenvioSmsCambioTelefono
  );

  temporizadorReenvioSmsCambioTelefono =
    null;
}  

if (panelMfaCambioTelefono) {
  panelMfaCambioTelefono.style.display =
    "none";
}

if (inputCodigoMfaCambioTelefono) {
  inputCodigoMfaCambioTelefono.value = "";
}

if (mensajeMfaCambioTelefono) {
  mensajeMfaCambioTelefono.textContent = "";
  mensajeMfaCambioTelefono.style.display =
    "none";
}

if (btnConfirmarMfaCambioTelefono) {
  btnConfirmarMfaCambioTelefono.disabled =
    false;

  btnConfirmarMfaCambioTelefono.textContent =
    "✅ Confirmar identidad y enviar SMS";

  btnConfirmarMfaCambioTelefono.style.cursor =
    "pointer";

  btnConfirmarMfaCambioTelefono.style.opacity =
    "1";
}

/* Limpiar el panel SMS */
if (panelSmsCambioTelefono) {
  panelSmsCambioTelefono.style.display =
    "none";
}

if (telefonoSmsDestino) {
  telefonoSmsDestino.textContent =
    "Nuevo teléfono";
}

if (inputCodigoSmsCambioTelefono) {
  inputCodigoSmsCambioTelefono.value =
    "";
}

if (mensajeSmsCambioTelefono) {
  mensajeSmsCambioTelefono.textContent =
    "";

  mensajeSmsCambioTelefono.style.display =
    "none";
}

if (btnConfirmarSmsCambioTelefono) {
  btnConfirmarSmsCambioTelefono.disabled =
    false;

  btnConfirmarSmsCambioTelefono.textContent =
    "✅ Confirmar código SMS y cambiar teléfono";

  btnConfirmarSmsCambioTelefono.style.cursor =
    "pointer";

  btnConfirmarSmsCambioTelefono.style.opacity =
    "1";
}

if (btnReenviarSmsCambioTelefono) {
  btnReenviarSmsCambioTelefono.disabled =
    false;

  btnReenviarSmsCambioTelefono.textContent =
    "🔄 Reenviar código SMS";

  btnReenviarSmsCambioTelefono.style.cursor =
    "pointer";

  btnReenviarSmsCambioTelefono.style.opacity =
    "1";
}

if (btnContinuarCambioTelefono) {
  btnContinuarCambioTelefono.style.display =
    "block";
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
   async function () {
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

    const correoActual =
  (
    user.email ||
    perfil.email ||
    ""
  )
    .trim()
    .toLowerCase();

if (!correoActual) {
  mostrarMensajeCambioTelefono(
    "❌ No fue posible identificar el correo de tu cuenta.",
    "#ff5b5b"
  );

  return;
}

const textoOriginalBotonTelefono =
  btnContinuarCambioTelefono.textContent;

let clienteVerificacionPasswordTelefono =
  null;

btnContinuarCambioTelefono.disabled =
  true;

btnContinuarCambioTelefono.textContent =
  "⏳ Confirmando contraseña...";

btnContinuarCambioTelefono.style.cursor =
  "not-allowed";

btnContinuarCambioTelefono.style.opacity =
  ".7";

mostrarMensajeCambioTelefono(
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
  clienteVerificacionPasswordTelefono =
    window.supabase.createClient(
      supabaseClient.supabaseUrl,
      supabaseClient.supabaseKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
          storageKey:
            "mass-phone-password-check-" +
            Date.now()
        }
      }
    );

  const {
    data: datosPasswordTelefono,
    error: errorPasswordTelefono
  } =
    await clienteVerificacionPasswordTelefono
      .auth
      .signInWithPassword({
        email: correoActual,
        password: passwordActual
      });

  if (
    errorPasswordTelefono ||
    !datosPasswordTelefono?.user
  ) {
    inputPasswordActualCambioTelefono
      .value = "";

    mostrarMensajeCambioTelefono(
      "❌ La contraseña actual es incorrecta.",
      "#ff5b5b"
    );

    inputPasswordActualCambioTelefono
      .focus();

    return;
  }

  if (
    datosPasswordTelefono.user.id !==
    user.id
  ) {
    throw new Error(
      "La identidad confirmada no coincide con la sesión activa."
    );
  }

  inputPasswordActualCambioTelefono
    .value = "";

  const {
  data: factoresCambioTelefono,
  error: errorFactoresCambioTelefono
} =
  await supabaseClient.auth.mfa
    .listFactors();

if (errorFactoresCambioTelefono) {
  throw errorFactoresCambioTelefono;
}

const listaFactoresCambioTelefono =
  Array.isArray(
    factoresCambioTelefono?.all
  )
    ? factoresCambioTelefono.all
    : [
        ...(
          Array.isArray(
            factoresCambioTelefono?.totp
          )
            ? factoresCambioTelefono.totp
            : []
        ),
        ...(
          Array.isArray(
            factoresCambioTelefono?.phone
          )
            ? factoresCambioTelefono.phone
            : []
        )
      ];

const factorVerificadoCambioTelefono =
  listaFactoresCambioTelefono.find(
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

nuevoTelefonoPendienteCambio =
  nuevoTelefono;

if (
  !factorVerificadoCambioTelefono?.id
) {
  mostrarMensajeCambioTelefono(
    "✅ Contraseña confirmada. Esta cuenta no tiene verificación en dos pasos activa.",
    "#39ff14"
  );

  return;
}

factorMfaCambioTelefonoId =
  factorVerificadoCambioTelefono.id;

mfaCambioTelefonoAprobado = false;

if (inputCodigoMfaCambioTelefono) {
  inputCodigoMfaCambioTelefono.value =
    "";
}

if (mensajeMfaCambioTelefono) {
  mensajeMfaCambioTelefono.textContent =
    "";

  mensajeMfaCambioTelefono.style.display =
    "none";
}

if (panelMfaCambioTelefono) {
  panelMfaCambioTelefono.style.display =
    "block";

  panelMfaCambioTelefono.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

btnContinuarCambioTelefono.style.display =
  "none";

mostrarMensajeCambioTelefono(
  "✅ Contraseña confirmada. Escribe ahora el código de seguridad de tu aplicación.",
  "#39ff14"
);

setTimeout(function () {
  inputCodigoMfaCambioTelefono?.focus();
}, 150);
  
} catch (error) {
  console.error(
    "ERROR CONFIRMANDO CONTRASEÑA PARA CAMBIO DE TELÉFONO:",
    error
  );

  inputPasswordActualCambioTelefono
    .value = "";

  mostrarMensajeCambioTelefono(
    "❌ No fue posible confirmar tu contraseña. Inténtalo nuevamente.",
    "#ff5b5b"
  );

  inputPasswordActualCambioTelefono
    .focus();
} finally {
  if (clienteVerificacionPasswordTelefono) {
    try {
      await clienteVerificacionPasswordTelefono
        .auth
        .signOut({
          scope: "local"
        });
    } catch (
      errorCerrarVerificacionTelefono
    ) {
      console.warn(
        "No fue posible cerrar el cliente temporal:",
        errorCerrarVerificacionTelefono
      );
    }

    if (
      typeof clienteVerificacionPasswordTelefono
        .auth.dispose === "function"
    ) {
      clienteVerificacionPasswordTelefono
        .auth.dispose();
    }
  }

  btnContinuarCambioTelefono.disabled =
    false;

  btnContinuarCambioTelefono.textContent =
    textoOriginalBotonTelefono;

  btnContinuarCambioTelefono.style.cursor =
    "pointer";

  btnContinuarCambioTelefono.style.opacity =
    "1";
}  
    };
}

/* Mostrar mensajes del código MFA de teléfono */
function mostrarMensajeMfaCambioTelefono(
  texto,
  color
) {
  if (!mensajeMfaCambioTelefono) {
    return;
  }

  mensajeMfaCambioTelefono.textContent =
    texto;

  mensajeMfaCambioTelefono.style.color =
    color;

  mensajeMfaCambioTelefono.style.borderColor =
    color;

  mensajeMfaCambioTelefono.style.display =
    "block";
}

/* Permitir solamente seis números */
if (inputCodigoMfaCambioTelefono) {
  inputCodigoMfaCambioTelefono.oninput =
    function () {
      this.value = this.value
        .replace(/\D/g, "")
        .slice(0, 6);
    };
}

/* Mostrar mensajes de verificación SMS */
function mostrarMensajeSmsCambioTelefono(
  texto,
  color
) {
  if (!mensajeSmsCambioTelefono) {
    return;
  }

  mensajeSmsCambioTelefono.textContent =
    texto;

  mensajeSmsCambioTelefono.style.color =
    color;

  mensajeSmsCambioTelefono.style.borderColor =
    color;

  mensajeSmsCambioTelefono.style.display =
    "block";
}

/*
  Convertir el nuevo teléfono al formato
  internacional E.164 requerido por Supabase
  y Twilio Verify.

  Ejemplo:
  9563724892 → +19563724892
*/
function convertirTelefonoCambioAE164(
  telefono
) {
  const digitos =
    String(telefono || "")
      .replace(/\D/g, "");

  /* Estados Unidos: diez dígitos */
  if (/^\d{10}$/.test(digitos)) {
    return "+1" + digitos;
  }

  /*
    Estados Unidos cuando ya incluye
    el número 1 al principio.
  */
  if (/^1\d{10}$/.test(digitos)) {
    return "+" + digitos;
  }

  /*
    Otros números que ya incluyen
    código internacional.
  */
  if (/^\d{11,15}$/.test(digitos)) {
    return "+" + digitos;
  }

  return "";
}

/* Permitir solamente seis números en el SMS */
if (inputCodigoSmsCambioTelefono) {
  inputCodigoSmsCambioTelefono.oninput =
    function () {
      this.value = this.value
        .replace(/\D/g, "")
        .slice(0, 6);
    };
}  

/* Confirmar código MFA del cambio de teléfono */
if (
  btnConfirmarMfaCambioTelefono &&
  inputCodigoMfaCambioTelefono
) {
  btnConfirmarMfaCambioTelefono.onclick =
    async function () {
      const codigoMfa =
        inputCodigoMfaCambioTelefono.value
          .replace(/\D/g, "");

      if (
        !factorMfaCambioTelefonoId ||
        !nuevoTelefonoPendienteCambio
      ) {
        mostrarMensajeMfaCambioTelefono(
          "❌ La confirmación anterior venció. Vuelve a confirmar tu contraseña.",
          "#ff5b5b"
        );

        return;
      }

      if (!/^\d{6}$/.test(codigoMfa)) {
        mostrarMensajeMfaCambioTelefono(
          "❌ Escribe el código completo de seis dígitos.",
          "#ff5b5b"
        );

        inputCodigoMfaCambioTelefono.focus();
        return;
      }

      const textoOriginalBotonMfaTelefono =
        btnConfirmarMfaCambioTelefono
          .textContent;

      let codigoMfaTelefonoConfirmado =
        false;

      mfaCambioTelefonoAprobado = false;

      btnConfirmarMfaCambioTelefono.disabled =
        true;

      btnConfirmarMfaCambioTelefono.textContent =
        "⏳ Confirmando código...";

      btnConfirmarMfaCambioTelefono.style.cursor =
        "not-allowed";

      btnConfirmarMfaCambioTelefono.style.opacity =
        ".7";

      mostrarMensajeMfaCambioTelefono(
        "⏳ Verificando tu código de seguridad...",
        "#ffffff"
      );

      try {
        const {
          error: errorConfirmarMfaTelefono
        } =
          await supabaseClient.auth.mfa
            .challengeAndVerify({
              factorId:
                factorMfaCambioTelefonoId,
              code: codigoMfa
            });

        if (errorConfirmarMfaTelefono) {
          inputCodigoMfaCambioTelefono.value =
            "";

          mostrarMensajeMfaCambioTelefono(
            "❌ El código es incorrecto o venció. Escribe el código nuevo de tu aplicación.",
            "#ff5b5b"
          );

          inputCodigoMfaCambioTelefono.focus();
          return;
        }

      mfaCambioTelefonoAprobado = true;

inputCodigoMfaCambioTelefono.value =
  "";

telefonoE164PendienteCambio =
  convertirTelefonoCambioAE164(
    nuevoTelefonoPendienteCambio
  );

if (!telefonoE164PendienteCambio) {
  mostrarMensajeMfaCambioTelefono(
    "❌ El nuevo teléfono no tiene un formato válido para recibir el SMS.",
    "#ff5b5b"
  );

  return;
}

btnConfirmarMfaCambioTelefono.textContent =
  "⏳ Enviando código SMS...";

mostrarMensajeMfaCambioTelefono(
  "⏳ Identidad confirmada. Enviando el código al nuevo teléfono...",
  "#ffffff"
);

/*
  Iniciar el cambio en Supabase Auth.
  Como Phone Confirmations está activado,
  esto enviará el código mediante Twilio Verify.
*/
const {
  error: errorEnviarSmsCambioTelefono
} =
  await supabaseClient.auth.updateUser({
    phone: telefonoE164PendienteCambio
  });

if (errorEnviarSmsCambioTelefono) {
  console.error(
    "ERROR ENVIANDO SMS PARA CAMBIO DE TELÉFONO:",
    errorEnviarSmsCambioTelefono
  );

  smsCambioTelefonoEnviado = false;

  mostrarMensajeMfaCambioTelefono(
    "❌ No fue posible enviar el código SMS. Revisa el número e inténtalo nuevamente.",
    "#ff5b5b"
  );

  return;
}

smsCambioTelefonoEnviado = true;
smsCambioTelefonoConfirmado = false;
codigoMfaTelefonoConfirmado = true;

if (telefonoSmsDestino) {
  const ultimosCuatroTelefono =
    nuevoTelefonoPendienteCambio.slice(-4);

  telefonoSmsDestino.textContent =
    "••• ••• " + ultimosCuatroTelefono;
}

if (inputCodigoSmsCambioTelefono) {
  inputCodigoSmsCambioTelefono.value =
    "";
}

if (mensajeSmsCambioTelefono) {
  mensajeSmsCambioTelefono.textContent =
    "";

  mensajeSmsCambioTelefono.style.display =
    "none";
}

if (panelMfaCambioTelefono) {
  panelMfaCambioTelefono.style.display =
    "none";
}

if (panelSmsCambioTelefono) {
  panelSmsCambioTelefono.style.display =
    "block";

  panelSmsCambioTelefono.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

btnConfirmarMfaCambioTelefono.textContent =
  "✅ SMS enviado";

btnConfirmarMfaCambioTelefono.style.opacity =
  "1";

mostrarMensajeCambioTelefono(
  "✅ Identidad confirmada. Enviamos un código SMS al nuevo teléfono.",
  "#39ff14"
);

setTimeout(function () {
  inputCodigoSmsCambioTelefono?.focus();
}, 150);
        
      } catch (error) {
        console.error(
          "ERROR CONFIRMANDO MFA PARA CAMBIO DE TELÉFONO:",
          error
        );

        inputCodigoMfaCambioTelefono.value =
          "";

        mostrarMensajeMfaCambioTelefono(
          "❌ No fue posible confirmar el código. Inténtalo nuevamente.",
          "#ff5b5b"
        );

        inputCodigoMfaCambioTelefono.focus();
      } finally {
        if (!codigoMfaTelefonoConfirmado) {
          btnConfirmarMfaCambioTelefono.disabled =
            false;

          btnConfirmarMfaCambioTelefono.textContent =
            textoOriginalBotonMfaTelefono;

          btnConfirmarMfaCambioTelefono.style.cursor =
            "pointer";

          btnConfirmarMfaCambioTelefono.style.opacity =
            "1";
        }
      }
    };
}

/* Confirmar código SMS del nuevo teléfono */
if (
  btnConfirmarSmsCambioTelefono &&
  inputCodigoSmsCambioTelefono
) {
  btnConfirmarSmsCambioTelefono.onclick =
    async function () {
      const codigoSms =
        inputCodigoSmsCambioTelefono.value
          .replace(/\D/g, "");

      if (
        !mfaCambioTelefonoAprobado ||
        !smsCambioTelefonoEnviado ||
        !telefonoE164PendienteCambio ||
        !nuevoTelefonoPendienteCambio
      ) {
        mostrarMensajeSmsCambioTelefono(
          "❌ La solicitud de cambio venció. Vuelve a comenzar el proceso.",
          "#ff5b5b"
        );

        return;
      }

      if (!/^\d{6}$/.test(codigoSms)) {
        mostrarMensajeSmsCambioTelefono(
          "❌ Escribe el código SMS completo de seis dígitos.",
          "#ff5b5b"
        );

        inputCodigoSmsCambioTelefono.focus();
        return;
      }

      const textoOriginalBotonSms =
        btnConfirmarSmsCambioTelefono
          .textContent;

      let procesoTelefonoCompletado =
        false;

      btnConfirmarSmsCambioTelefono.disabled =
        true;

      btnConfirmarSmsCambioTelefono.textContent =
        "⏳ Confirmando código SMS...";

      btnConfirmarSmsCambioTelefono.style.cursor =
        "not-allowed";

      btnConfirmarSmsCambioTelefono.style.opacity =
        ".7";

      mostrarMensajeSmsCambioTelefono(
        "⏳ Verificando que el nuevo teléfono te pertenece...",
        "#ffffff"
      );

      try {
        /*
          Revisar primero si el código ya fue
          confirmado anteriormente. Esto permite
          recuperar una sincronización interrumpida.
        */
        const {
          data: datosUsuarioAntesSms,
          error: errorUsuarioAntesSms
        } =
          await supabaseClient.auth.getUser();

        const usuarioAntesSms =
          datosUsuarioAntesSms?.user;

        if (
          errorUsuarioAntesSms ||
          !usuarioAntesSms ||
          usuarioAntesSms.id !== user.id
        ) {
          throw (
            errorUsuarioAntesSms ||
            new Error(
              "La sesión activa no coincide con la cuenta."
            )
          );
        }

        const telefonoAuthAntesSms =
          (
            usuarioAntesSms.phone ||
            ""
          )
            .replace(/\D/g, "");

        const telefonoPendienteDigitos =
          telefonoE164PendienteCambio
            .replace(/\D/g, "");

        const telefonoYaConfirmadoEnAuth =
          telefonoAuthAntesSms ===
          telefonoPendienteDigitos;

        if (!telefonoYaConfirmadoEnAuth) {
          const {
            error: errorConfirmarSmsTelefono
          } =
            await supabaseClient.auth.verifyOtp({
              phone:
                telefonoE164PendienteCambio,
              token: codigoSms,
              type: "phone_change"
            });

          if (errorConfirmarSmsTelefono) {
            inputCodigoSmsCambioTelefono.value =
              "";

            mostrarMensajeSmsCambioTelefono(
              "❌ El código SMS es incorrecto o venció. Escribe el código más reciente.",
              "#ff5b5b"
            );

            inputCodigoSmsCambioTelefono.focus();
            return;
          }
        }

        /*
          Confirmar que Supabase Auth realmente
          guardó el teléfono en esta misma cuenta.
        */
        const {
          data: datosUsuarioConfirmado,
          error: errorUsuarioConfirmado
        } =
          await supabaseClient.auth.getUser();

        const usuarioConfirmado =
          datosUsuarioConfirmado?.user;

        if (
          errorUsuarioConfirmado ||
          !usuarioConfirmado ||
          usuarioConfirmado.id !== user.id
        ) {
          throw (
            errorUsuarioConfirmado ||
            new Error(
              "No fue posible confirmar la identidad después del SMS."
            )
          );
        }

        const telefonoAuthConfirmado =
          (
            usuarioConfirmado.phone ||
            ""
          )
            .replace(/\D/g, "");

        if (
          telefonoAuthConfirmado !==
          telefonoPendienteDigitos
        ) {
          throw new Error(
            "El teléfono confirmado no coincide con el teléfono solicitado."
          );
        }

        smsCambioTelefonoConfirmado = true;

        const telefonoNuevoConfirmado =
          nuevoTelefonoPendienteCambio;

        const telefonoAnterior =
          (
            perfil.telefono ||
            ""
          )
            .replace(/\D/g, "");

        btnConfirmarSmsCambioTelefono.textContent =
          "⏳ Sincronizando teléfono...";

        mostrarMensajeSmsCambioTelefono(
          "⏳ Teléfono verificado. Sincronizando tu cuenta MASS...",
          "#ffffff"
        );

        /*
          Actualizar permisos relacionados con
          el mismo auth_user_id.
        */
        const {
          data: filasAdminTelefono,
          error: errorActualizarAdminTelefono
        } =
          await supabaseClient
            .from("admin_organizadores")
            .update({
              telefono:
                telefonoNuevoConfirmado
            })
            .eq(
              "auth_user_id",
              user.id
            )
            .select("id");

        if (errorActualizarAdminTelefono) {
          throw errorActualizarAdminTelefono;
        }

        /*
          Actualizar el perfil principal
          privado de Mi MASS ID.
        */
        const {
          data: perfilTelefonoActualizado,
          error: errorActualizarPerfilTelefono
        } =
          await supabaseClient
            .from("usuarios_mass")
            .update({
              telefono:
                telefonoNuevoConfirmado
            })
            .eq(
              "auth_user_id",
              user.id
            )
            .select("telefono")
            .maybeSingle();

        if (
          errorActualizarPerfilTelefono ||
          !perfilTelefonoActualizado
        ) {
          /*
            Si falla el perfil principal,
            restaurar admin_organizadores.
          */
          if (
            Array.isArray(filasAdminTelefono) &&
            filasAdminTelefono.length > 0
          ) {
            const {
              error:
                errorRestaurarAdminTelefono
            } =
              await supabaseClient
                .from("admin_organizadores")
                .update({
                  telefono:
                    telefonoAnterior || null
                })
                .eq(
                  "auth_user_id",
                  user.id
                );

            if (errorRestaurarAdminTelefono) {
              console.error(
                "ERROR RESTAURANDO TELÉFONO ADMIN:",
                errorRestaurarAdminTelefono
              );
            }
          }

          throw (
            errorActualizarPerfilTelefono ||
            new Error(
              "No se encontró el perfil MASS ID para actualizar."
            )
          );
        }

        /* Actualizar los datos activos */
        perfil.telefono =
          telefonoNuevoConfirmado;

        localStorage.setItem(
          "mass_telefono",
          telefonoNuevoConfirmado
        );

        localStorage.setItem(
          "mass_user",
          telefonoNuevoConfirmado
        );

        try {
          if (
            typeof userActual !==
            "undefined"
          ) {
            userActual =
              telefonoNuevoConfirmado;
          }
        } catch (
          errorActualizarUsuarioLocal
        ) {
          console.warn(
            "No fue posible actualizar userActual:",
            errorActualizarUsuarioLocal
          );
        }

        procesoTelefonoCompletado = true;

        mostrarMensajeSmsCambioTelefono(
          "✅ El nuevo teléfono fue verificado y actualizado correctamente.",
          "#39ff14"
        );

        btnConfirmarSmsCambioTelefono.textContent =
          "✅ Teléfono actualizado";

        btnConfirmarSmsCambioTelefono.style.opacity =
          "1";

        regresarDesdeCambioTelefono();

        await abrirMiMassId();

        alert(
          "✅ Tu nuevo teléfono fue verificado por SMS y actualizado correctamente."
        );
      } catch (error) {
        console.error(
          "ERROR CONFIRMANDO SMS PARA CAMBIO DE TELÉFONO:",
          error
        );

        inputCodigoSmsCambioTelefono.value =
          "";

        const mensajeErrorTelefono =
          error?.code === "23505"
            ? "❌ Ese teléfono ya está registrado en otra cuenta MASS."
            : "❌ No fue posible completar el cambio de teléfono. Inténtalo nuevamente.";

        mostrarMensajeSmsCambioTelefono(
          mensajeErrorTelefono,
          "#ff5b5b"
        );

        inputCodigoSmsCambioTelefono.focus();
      } finally {
        if (!procesoTelefonoCompletado) {
          btnConfirmarSmsCambioTelefono.disabled =
            false;

          btnConfirmarSmsCambioTelefono.textContent =
            textoOriginalBotonSms;

          btnConfirmarSmsCambioTelefono.style.cursor =
            "pointer";

          btnConfirmarSmsCambioTelefono.style.opacity =
            "1";
        }
      }
    };
}

/* Reenviar código SMS del nuevo teléfono */
if (btnReenviarSmsCambioTelefono) {
  btnReenviarSmsCambioTelefono.onclick =
    async function () {
      if (
        !mfaCambioTelefonoAprobado ||
        !smsCambioTelefonoEnviado ||
        !telefonoE164PendienteCambio ||
        !nuevoTelefonoPendienteCambio
      ) {
        mostrarMensajeSmsCambioTelefono(
          "❌ La solicitud de cambio venció. Vuelve a comenzar el proceso.",
          "#ff5b5b"
        );

        return;
      }

      const textoOriginalBotonReenvio =
        "🔄 Reenviar código SMS";

      btnReenviarSmsCambioTelefono.disabled =
        true;

      btnReenviarSmsCambioTelefono.textContent =
        "⏳ Reenviando código...";

      btnReenviarSmsCambioTelefono.style.cursor =
        "not-allowed";

      btnReenviarSmsCambioTelefono.style.opacity =
        ".7";

      mostrarMensajeSmsCambioTelefono(
        "⏳ Solicitando un nuevo código SMS...",
        "#ffffff"
      );

      try {
        const {
          error: errorReenviarSmsTelefono
        } =
          await supabaseClient.auth.resend({
            type: "phone_change",
            phone:
              telefonoE164PendienteCambio
          });

        if (errorReenviarSmsTelefono) {
          throw errorReenviarSmsTelefono;
        }

        smsCambioTelefonoEnviado = true;
        smsCambioTelefonoConfirmado = false;

        if (inputCodigoSmsCambioTelefono) {
          inputCodigoSmsCambioTelefono.value =
            "";

          inputCodigoSmsCambioTelefono.focus();
        }

        mostrarMensajeSmsCambioTelefono(
          "✅ Enviamos un código SMS nuevo. Utiliza únicamente el código más reciente.",
          "#39ff14"
        );

        let segundosRestantes = 60;

        btnReenviarSmsCambioTelefono.textContent =
          "⏳ Reenviar en " +
          segundosRestantes +
          " s";

        if (
          temporizadorReenvioSmsCambioTelefono
        ) {
          clearInterval(
            temporizadorReenvioSmsCambioTelefono
          );
        }

        temporizadorReenvioSmsCambioTelefono =
          setInterval(function () {
            segundosRestantes -= 1;

            if (segundosRestantes <= 0) {
              clearInterval(
                temporizadorReenvioSmsCambioTelefono
              );

              temporizadorReenvioSmsCambioTelefono =
                null;

              btnReenviarSmsCambioTelefono.disabled =
                false;

              btnReenviarSmsCambioTelefono.textContent =
                textoOriginalBotonReenvio;

              btnReenviarSmsCambioTelefono.style.cursor =
                "pointer";

              btnReenviarSmsCambioTelefono.style.opacity =
                "1";

              return;
            }

            btnReenviarSmsCambioTelefono.textContent =
              "⏳ Reenviar en " +
              segundosRestantes +
              " s";
          }, 1000);
      } catch (error) {
        console.error(
          "ERROR REENVIANDO SMS PARA CAMBIO DE TELÉFONO:",
          error
        );

        mostrarMensajeSmsCambioTelefono(
          "❌ No fue posible reenviar el código SMS. Espera un momento e inténtalo nuevamente.",
          "#ff5b5b"
        );

        btnReenviarSmsCambioTelefono.disabled =
          false;

        btnReenviarSmsCambioTelefono.textContent =
          textoOriginalBotonReenvio;

        btnReenviarSmsCambioTelefono.style.cursor =
          "pointer";

        btnReenviarSmsCambioTelefono.style.opacity =
          "1";
      }
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
