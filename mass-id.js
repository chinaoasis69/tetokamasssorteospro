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
      estado: "En revisión"
    },
    {
      codigo: "MASS-LC-006",
      titulo: "Política de inteligencia artificial",
      descripcion:
        "Regula el uso responsable, transparente y seguro de inteligencia artificial dentro de MASS.",
      version: "1.0",
      estado: "En revisión"
    },
    {
      codigo: "MASS-LC-007",
      titulo: "Política de pagos",
      descripcion:
        "Establece las reglas relacionadas con cargos, autorizaciones y procesamiento de pagos.",
      version: "1.0",
      estado: "En revisión"
    },
    {
      codigo: "MASS-LC-008",
      titulo: "Política de reembolsos",
      descripcion:
        "Define las condiciones, requisitos y procedimientos aplicables a reembolsos.",
      version: "1.0",
      estado: "En revisión"
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
      estado: "En preparación"
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
