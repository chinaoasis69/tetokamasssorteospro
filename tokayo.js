(() => {
  "use strict";

  const dialogo = document.getElementById("tokayoMass");
  const guia = document.getElementById("tokayoGuia");
  const pregunta = document.getElementById("tokayoPregunta");
  const estado = document.getElementById("tokayoEstado");
  const respuesta = document.getElementById("tokayoRespuesta");
  const opciones = document.getElementById("tokayoOpciones");
  let temas = [];

  const omitir = new Set(("a al algo alguna algun algunos algunas ante con cual cuales cuando cuanto cuantos de del desde " +
    "donde el ella en es esa ese eso esta estan este esto hacer hago hay hola la las le lo los me mi mis muy " +
    "necesito o oye para por porque puedo que quien quiero quisiera se si soy sobre son su sus te tengo " +
    "tiene tienen tu tus un una unas uno unos y ya yo como tokayo mass").split(" "));

  // Unificar el vocabulario que cambia entre la pregunta escrita y el texto de las guías.
  const familias = [
    "crear crea creo creacion crearla", "agregar agrego agrega anadir anado poner pongo",
    "registrar registro registrarme registrarlo", "configurar configuro configuracion",
    "participar participo participacion", "rifa rifas sorteo sorteos dinamica dinamicas",
    "comprar compre compro compra compras comprado comprados", "boleto boletos ticket tickets",
    "numero numeros", "reservar reservo reserva reservas reservarlos apartar aparto apartado apartados",
    "recarga recargas recargar recargo", "ganar gane ganado ganados", "giro giros girar ruleta",
    "gratis gratuito gratuita gratuitos gratuitas", "premio premios", "patrocinador patrocinadores",
    "plan planes", "divisa divisas moneda monedas", "comenzar empezar empiezo empieza comienzo",
    "pagar pago pague pagado pagados", "contacto contactar contactarme comunicarme",
    "contrasena clave password", "publicar publico", "activar activo activacion",
    "vence vencen vencimiento caduca caducan", "reembolso reembolsos devolver devolucion"
  ];
  const equivalencias = new Map();
  for (const familia of familias) {
    const [base, ...variantes] = familia.split(" ");
    for (const variante of variantes) equivalencias.set(variante, base);
  }

  function normalizar(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      .replace(/[^a-z0-9]+/g, " ").trim();
  }

  function palabras(texto) {
    return new Set(normalizar(texto).split(" ").filter(p => p && !omitir.has(p))
      .map(p => equivalencias.get(p) || p));
  }

  function leerTemas() {
    const origen = guia.value === "organizador"
      ? document.getElementById("plantillaGuiaOrganizadorMass").content
      : document.getElementById("guiaUsuarioMass");
    return Array.from(origen.querySelectorAll(".guia-mass-contenido > section > details"), detalle => {
      const titulo = detalle.querySelector("summary");
      // Las respuestas proceden de las FAQ estáticas, incluso si el usuario filtró su guía.
      const bloques = Array.from(detalle.children).filter(n => ["P", "OL", "UL"].includes(n.tagName));
      return {
        titulo: titulo.textContent.trim(),
        seccion: detalle.parentElement.querySelector("h3").textContent,
        inicio: titulo.hasAttribute("data-tokayo-inicio"),
        palabrasTitulo: palabras(titulo.textContent),
        claves: palabras(titulo.dataset.tokayoClaves || ""),
        cuerpo: palabras(bloques.map(n => n.textContent).join(" ")),
        bloques
      };
    });
  }

  function buscar(consulta) {
    const terminos = [...palabras(consulta)];
    const exacto = temas.find(t => normalizar(t.titulo) === normalizar(consulta));
    if (exacto) return { directo: exacto, opciones: [] };
    if (!terminos.length) return { opciones: [] };

    // Los términos presentes en pocos títulos distinguen mejor temas cercanos.
    const pesos = terminos.map(p => {
      const frecuencia = temas.filter(t => t.palabrasTitulo.has(p) || t.claves.has(p)).length;
      return 1 + Math.log((temas.length + 1) / (frecuencia + 1));
    });
    const candidatos = [];
    for (const tema of temas) {
      let puntos = 0;
      let fuertes = 0;
      let enTitulo = 0;
      for (const [i, p] of terminos.entries()) {
        if (tema.palabrasTitulo.has(p) || tema.claves.has(p)) {
          fuertes++;
          if (tema.palabrasTitulo.has(p)) enTitulo++;
          puntos += pesos[i] * (tema.palabrasTitulo.has(p) ? 1.15 : 1);
        } else if (tema.cuerpo.has(p)) {
          puntos += pesos[i] * 0.18;
        }
      }
      if (fuertes && fuertes >= Math.ceil(terminos.length * 0.35)) {
        const proporcionTitulo = enTitulo / Math.max(1, tema.palabrasTitulo.size);
        candidatos.push({ tema, puntos: puntos * (1 + proporcionTitulo), fuertes });
      }
    }
    candidatos.sort((a, b) => b.puntos - a.puntos);
    const [mejor, segundo] = candidatos;
    if (!mejor) return { opciones: [] };
    const suficiente = mejor.fuertes >= Math.ceil(terminos.length * 0.6);
    const claro = !segundo || (mejor.fuertes >= 2 && mejor.puntos >= segundo.puntos * 1.2);
    return {
      directo: suficiente && claro ? mejor.tema : null,
      opciones: candidatos.filter(x => x.puntos >= mejor.puntos * 0.45).slice(0, 4).map(x => x.tema)
    };
  }

  function sugerir(lista) {
    opciones.replaceChildren();
    for (const tema of lista) {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "tokayo-secundario";
      boton.textContent = tema.titulo;
      boton.addEventListener("click", () => {
        pregunta.value = tema.titulo;
        mostrarRespuesta(tema);
      });
      opciones.append(boton);
    }
  }

  function mostrarRespuesta(tema) {
    estado.textContent = "Guía del " + guia.value + " · " + tema.seccion;
    const titulo = document.createElement("h3");
    titulo.textContent = tema.titulo;
    titulo.tabIndex = -1;
    respuesta.replaceChildren(titulo, ...tema.bloques.map(n => n.cloneNode(true)));
    opciones.replaceChildren();
    titulo.focus();
  }

  function iniciarGuia() {
    temas = leerTemas();
    pregunta.value = "";
    pregunta.placeholder = guia.value === "organizador" ? "¿Cómo creo mi primera rifa?" : "¿Cómo aparto boletos?";
    respuesta.replaceChildren();
    estado.textContent = "También puedes elegir una pregunta.";
    sugerir(temas.filter(t => t.inicio));
  }

  document.addEventListener("click", evento => {
    const boton = evento.target.closest("button[data-tokayo]");
    if (!boton) return;
    guia.value = boton.dataset.tokayo;
    iniciarGuia();
    if (!dialogo.open) dialogo.showModal();
  });
  guia.addEventListener("change", iniciarGuia);
  document.getElementById("tokayoConsulta").addEventListener("submit", evento => {
    evento.preventDefault();
    const consulta = pregunta.value.trim();
    if (!consulta) {
      estado.textContent = "Escribe una pregunta o elige una de las sugerencias.";
      respuesta.replaceChildren();
      sugerir(temas.filter(t => t.inicio));
      pregunta.focus();
      return;
    }
    const resultado = buscar(consulta);
    if (resultado.directo) {
      mostrarRespuesta(resultado.directo);
      return;
    }
    respuesta.replaceChildren();
    if (resultado.opciones.length) {
      estado.textContent = "¿Cuál de estas preguntas se acerca más a tu duda?";
      sugerir(resultado.opciones);
    } else {
      estado.textContent = "No encontré una respuesta en esta guía. Prueba con otras palabras o elige una pregunta.";
      sugerir(temas.filter(t => t.inicio));
    }
  });
  dialogo.addEventListener("close", () => {
    pregunta.value = "";
    respuesta.replaceChildren();
    opciones.replaceChildren();
  });
})();
