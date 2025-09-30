/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import express from "express";
import axios from "axios";
import "dotenv/config";
import { MongoClient } from "mongodb";

const app = express();
app.use(express.json());

// Servir archivos estáticos (videos e imágenes)
app.use(express.static("."));

const {
  WEBHOOK_VERIFY_TOKEN,
  API_TOKEN,
  BUSINESS_PHONE,
  API_VERSION,
  PORT,
  MOSTRAR_TIP_PRUEBA,
  DATABASE_URI,
} = process.env;

// Controlar si se muestran tips que mencionan el comando 'prueba'
const showPruebaTips = MOSTRAR_TIP_PRUEBA !== "false"; // por defecto true

// Configuración de MongoDB
let db;
let mongoClient;

// Conectar a MongoDB
async function connectToDatabase() {
  if (!DATABASE_URI) {
    console.warn("⚠️ DATABASE_URI no configurada. Funcionando sin base de datos.");
    return;
  }

  try {
    mongoClient = new MongoClient(DATABASE_URI);
    await mongoClient.connect();
    db = mongoClient.db("niblion_analytics");
    console.log("✅ Conectado a MongoDB exitosamente");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    db = null;
  }
}

// Función para guardar datos de usuario
async function guardarDatosUsuario(datosUsuario) {
  if (!db) return;
  
  try {
    const collection = db.collection("user_sessions");
    await collection.insertOne({
      ...datosUsuario,
      timestamp: new Date(),
      fecha_inicio: new Date(datosUsuario.iniciadoEn || new Date()),
    });
    console.log(`📊 Datos guardados para usuario: ${datosUsuario.numeroUsuario}`);
  } catch (error) {
    console.error("Error guardando datos de usuario:", error);
  }
}

// Función para guardar respuestas del formulario
async function guardarRespuestasFormulario(numeroUsuario, modulo, respuestas) {
  if (!db) return;
  
  try {
    const collection = db.collection("quiz_responses");
    await collection.insertOne({
      numeroUsuario,
      modulo,
      respuestas,
      timestamp: new Date(),
    });
    console.log(`📊 Respuestas guardadas - Usuario: ${numeroUsuario}, Módulo: ${modulo}`);
  } catch (error) {
    console.error("Error guardando respuestas:", error);
  }
}

// Función para guardar respuestas de encuesta
async function guardarRespuestasEncuesta(numeroUsuario, respuestasEncuesta, resultadosModulos) {
  if (!db) return;
  
  try {
    const collection = db.collection("survey_responses");
    await collection.insertOne({
      numeroUsuario,
      respuestasEncuesta,
      resultadosModulos,
      timestamp: new Date(),
      fecha_completado: new Date(),
    });
    console.log(`📊 Encuesta guardada para usuario: ${numeroUsuario}`);
  } catch (error) {
    console.error("Error guardando encuesta:", error);
  }
}

// Inicializar conexión a la base de datos
connectToDatabase();

// Sistema de estado para rastrear el progreso del formulario de cada usuario
const userSessions = new Map();

// URLs de los videos tutoriales por módulo (desde DigitalOcean CDN)
const VIDEOS_MODULOS = {
  1: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo1.mp4",
  2: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo2.mp4",
  3: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo3.mp4",
  4: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo4.mp4",
  5: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo5.mp4",
  6: "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo6.mp4",
};

// Sistema de módulos educativos (6 módulos)
const modulos = {
  1: {
    titulo: "✅ Módulo 1 – Contraseñas Seguras: Tu Primera Línea de Defensa",
    preguntas: [
      {
        numero: 1,
        pregunta: "¿Cuál de estas contraseñas es la más segura?",
        opciones: ["a) 123456", "b) MiNombre2024", "c) Tr3nSegura!2025"],
        respuesta_correcta: "C",
        retroalimentacion: {
          A: "❌ Muy fácil de adivinar. Es como dejar la puerta abierta.",
          B: "❌ Aunque tiene letras y números, es predecible si alguien conoce tu nombre.",
          C: "✅ ¡Muy bien! Una buena contraseña mezcla mayúsculas, minúsculas, números y símbolos.",
        },
      },
      {
        numero: 2,
        pregunta:
          "Tu hermana te pide tu contraseña para ayudarte a revisar tu correo. ¿Qué deberías hacer?",
        opciones: [
          "a) Se la doy, solo por esta vez",
          "b) Le digo que no la puedo compartir",
          "c) La cambio después de que ella la use",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ No importa quién lo pida: las contraseñas son personales.",
          B: "✅ Correcto. Ni familiares ni amigos deben conocer tu contraseña.",
          C: "❌ Cambiarla después no evita que otro la use mal mientras la tiene.",
        },
      },
      {
        numero: 3,
        pregunta: "¿Para qué sirve activar la verificación en dos pasos?",
        opciones: [
          "a) Para que me envíen publicidad",
          "b) Para tener un segundo nivel de seguridad",
          "c) Para cambiar mi contraseña más rápido",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ No tiene nada que ver con publicidad.",
          B: "✅ ¡Muy bien! La verificación en dos pasos funciona así:\n• Además de poner tu contraseña, también recibes un código único en tu teléfono.\n• Solo tú puedes verlo.\n• Aunque alguien adivine tu contraseña, no podrá entrar sin ese segundo paso.",
          C: "❌ No es para cambiar contraseñas, sino para proteger tu cuenta.",
        },
      },
    ],
  },
  2: {
    titulo: "✅ Módulo 2 – ¿Este Correo es Real o es una Estafa?",
    preguntas: [
      {
        numero: 1,
        pregunta:
          "¿Qué detalle te puede ayudar a descubrir que un correo/link es falso?",
        opciones: [
          "a) Tiene errores de ortografía y frases mal escritas",
          "b) Usa un logotipo bonito y colores oficiales",
          "c) Empieza con un saludo amigable",
        ],
        respuesta_correcta: "A",
        retroalimentacion: {
          A: "✅ ¡Correcto! Los errores de redacción son una señal clara de que puede ser una estafa.",
          B: "❌ Los estafadores copian logos y colores para parecer reales.",
          C: "❌ Un saludo amistoso no garantiza que sea seguro.",
        },
      },
      {
        numero: 2,
        pregunta:
          "¿Qué deberías hacer si recibes un correo que te pide datos personales, como tu contraseña o número de cédula?",
        opciones: [
          "a) Responder rápido, por si es urgente",
          "b) Ignorarlo completamente",
          "c) No responder y avisar a tecnología o seguridad",
        ],
        respuesta_correcta: "C",
        retroalimentacion: {
          A: "❌ Nunca compartas datos personales por correo.",
          B: "❌ Ignorarlo no es suficiente: es importante reportarlo.",
          C: "✅ ¡Muy bien! Así ayudas a prevenir que otros caigan.",
        },
      },
      {
        numero: 3,
        pregunta:
          'Recibes un correo que dice: "Aquí está la información que pediste", pero tú no pediste nada. ¿Qué deberías hacer?',
        opciones: [
          "a) Lo abro igual, por curiosidad",
          "b) Lo reviso con calma y, si no lo esperaba, no lo abro ni respondo",
          "c) Se lo reenvío a alguien para que me diga si es seguro",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ La curiosidad puede jugarte en contra. Si no lo esperabas, es mejor no abrirlo.",
          B: "✅ ¡Muy bien! Si no pediste nada, mejor no interactuar. Así te proteges.",
          C: "❌ Reenviar un correo sospechoso puede poner en riesgo a otras personas.",
        },
      },
    ],
  },
  3: {
    titulo: "✅ Módulo 3 – ¿Qué es un Deepfake y Cómo Protegerte?",
    preguntas: [
      {
        numero: 1,
        pregunta: "¿Qué es un deepfake?",
        opciones: [
          "a) Un video o audio manipulado para parecer real, pero que es falso",
          "b) Un video que solo se puede ver con gafas 3D",
          "c) Un tipo de programa para editar fotos",
        ],
        respuesta_correcta: "A",
        retroalimentacion: {
          A: "✅ ¡Exacto! Los deepfakes usan tecnología para crear videos o audios falsos que parecen reales.",
          B: "❌ No tiene que ver con gafas 3D, es más sobre manipulación digital.",
          C: "❌ Aunque se puede editar fotos, los deepfakes afectan video y audio, no solo imágenes.",
        },
      },
      {
        numero: 2,
        pregunta: "¿Cómo se crean los deepfakes?",
        opciones: [
          "a) Solo con videos grabados, sin usar ninguna tecnología",
          "b) Usando inteligencia artificial para imitar la voz y los gestos de una persona",
          "c) Usando cámaras especiales que graban desde ángulos extraños",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ No solo se graban videos. Los deepfakes usan IA para crear contenido falso.",
          B: "✅ ¡Correcto! Se utiliza inteligencia artificial para imitar voces, gestos, y comportamientos de una persona.",
          C: "❌ Las cámaras especiales no son necesarias para crear deepfakes, lo que se usa es la IA.",
        },
      },
      {
        numero: 3,
        pregunta:
          "Si recibes una llamada de tu jefe pidiéndote algo urgente, ¿qué deberías hacer?",
        opciones: [
          "a) Actuar rápidamente, ya que la llamada parece real",
          "b) Ignorar la llamada, no importa si parece importante",
          "c) Verificar la solicitud de la llamada usando otro medio, como un correo o mensaje directo",
        ],
        respuesta_correcta: "C",
        retroalimentacion: {
          A: "❌ No actúes rápidamente si no estás seguro, los deepfakes pueden engañarte.",
          B: "❌ Ignorar la llamada puede no ser la mejor opción si es realmente urgente. Mejor verifica.",
          C: "✅ ¡Bien hecho! Siempre verifica las solicitudes, especialmente si no esperabas esa llamada.",
        },
      },
    ],
  },
  4: {
    titulo: "✅ Módulo 4 – Tu Teléfono También Necesita Protección",
    preguntas: [
      {
        numero: 1,
        pregunta: "¿Cuál es la forma más segura de bloquear tu teléfono?",
        opciones: [
          "a) Usar solo una contraseña simple",
          "b) Usar huella digital o Face ID",
          "c) No bloquearlo, ya que es innecesario",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ Las contraseñas simples pueden ser fáciles de adivinar.",
          B: "✅ ¡Correcto! La huella digital y Face ID son más seguros y rápidos que una contraseña.",
          C: "❌ No bloquear tu teléfono pone en riesgo toda tu información.",
        },
      },
      {
        numero: 2,
        pregunta: "¿Por qué es importante mantener tu teléfono actualizado?",
        opciones: [
          "a) Para que se vean bien las aplicaciones",
          "b) Porque las actualizaciones corrigen errores que los atacantes pueden usar para acceder a tu teléfono",
          "c) Para tener más espacio en la memoria",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ Las actualizaciones no solo son para mejorar la apariencia, también protegen la seguridad.",
          B: "✅ ¡Exacto! Las actualizaciones cierran las vulnerabilidades que los atacantes podrían aprovechar.",
          C: "❌ El espacio en la memoria no es la razón principal de las actualizaciones.",
        },
      },
      {
        numero: 3,
        pregunta:
          "¿Qué debes hacer antes de conectarte a una red Wi-Fi pública?",
        opciones: [
          "a) Conectarte sin problemas, ya que es seguro",
          "b) Usar una VPN para proteger tu conexión",
          "c) No conectarte nunca, ya que es innecesario",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ Las redes públicas pueden ser peligrosas y no siempre son seguras.",
          B: "✅ ¡Muy bien! Usar una VPN es la forma más segura de conectarse a redes públicas.",
          C: "❌ No conectarte puede limitar tus opciones, pero siempre usa una VPN para mayor seguridad.",
        },
      },
    ],
  },
  5: {
    titulo:
      "✅ Módulo 5 – ¿Es Este Enlace o Archivo Seguro? Cómo Verificarlo con VirusTotal",
    preguntas: [
      {
        numero: 1,
        pregunta:
          "¿Qué debes hacer si tienes dudas sobre un enlace antes de hacer clic?",
        opciones: [
          "a) Hacer clic de todos modos, porque parece seguro",
          "b) Revisar el enlace en VirusTotal para verificar si es seguro",
          "c) Ignorar el enlace y seguir navegando sin hacer nada",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ No hagas clic sin estar seguro, ya que podrías poner en riesgo tu información.",
          B: "✅ ¡Exacto! Usar VirusTotal es la mejor forma de verificar un enlace antes de hacer clic.",
          C: "❌ Ignorar el enlace no te protege. Es mejor verificarlo para estar seguro.",
        },
      },
      {
        numero: 2,
        pregunta:
          "¿Cómo funciona VirusTotal cuando verificas un enlace o archivo?",
        opciones: [
          "a) Compara el enlace con otros sitios web populares",
          "b) Usa varios motores de antivirus para analizar el enlace o archivo",
          "c) Solo revisa la dirección web sin analizar el contenido",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ VirusTotal no solo compara con sitios populares, utiliza múltiples antivirus para comprobar la seguridad.",
          B: "✅ ¡Correcto! VirusTotal escanea el archivo o enlace con varios motores de antivirus para verificar si contiene amenazas.",
          C: "❌ VirusTotal no solo revisa la dirección web; también analiza el contenido en busca de riesgos.",
        },
      },
      {
        numero: 3,
        pregunta:
          "Si VirusTotal muestra que un enlace o archivo tiene una amenaza, ¿qué deberías hacer?",
        opciones: [
          "a) Abrirlo de todos modos, ya que podría ser un error",
          "b) Ignorarlo y seguir con lo que estabas haciendo",
          "c) Evitar hacer clic y eliminar el archivo o enlace",
        ],
        respuesta_correcta: "C",
        retroalimentacion: {
          A: "❌ No es recomendable abrir un archivo o enlace marcado como peligroso.",
          B: "❌ Ignorar la alerta puede poner en riesgo tu dispositivo e información.",
          C: "✅ ¡Exacto! Si VirusTotal alerta de una amenaza, es mejor evitarlo completamente y eliminarlo.",
        },
      },
    ],
  },
  6: {
    titulo:
      "✅ Módulo 6 – Protección Avanzada – No Pongas Datos Personales en Tus Contraseñas y Cómo Reportar un Incidente",
    preguntas: [
      {
        numero: 1,
        pregunta:
          "¿Por qué es peligroso usar tu nombre o fecha de nacimiento en las contraseñas?",
        opciones: [
          "a) Porque son fáciles de recordar",
          "b) Porque los hackers pueden adivinarlas usando la ingeniería social",
          "c) Porque los sitios web no permiten usar esa información",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ Aunque sean fáciles de recordar, son extremadamente fáciles de adivinar.",
          B: "✅ ¡Correcto! Los hackers pueden usar tu información pública para adivinar contraseñas fácilmente.",
          C: "❌ Los sitios web pueden permitirlas, pero esto aumenta el riesgo de ataques.",
        },
      },
      {
        numero: 2,
        pregunta:
          "¿Qué debes hacer si crees que alguien ha accedido a tu cuenta sin permiso?",
        opciones: [
          "a) Ignorar el incidente, ya que no es tan grave",
          "b) Cambiar tus contraseñas inmediatamente y reportar el incidente",
          "c) Esperar y ver si el hacker hace algo con tu cuenta",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ Ignorar el incidente no ayudará a proteger tu información.",
          B: "✅ ¡Exacto! Cambiar las contraseñas rápidamente puede prevenir daños mayores y reportar ayuda a que otros también estén protegidos.",
          C: "❌ Esperar solo aumenta el riesgo. Es mejor actuar lo antes posible.",
        },
      },
      {
        numero: 3,
        pregunta:
          "¿Qué puede hacer un hacker con la información que publicas en tus redes sociales?",
        opciones: [
          "a) Ayudarles a enviarte publicidad relevante",
          "b) Utilizarla para adivinar contraseñas y acceder a tus cuentas",
          "c) Mejorar tu perfil en línea",
        ],
        respuesta_correcta: "B",
        retroalimentacion: {
          A: "❌ Aunque la información personal podría ser utilizada para publicidad, el riesgo real es que los hackers adivinen tus contraseñas.",
          B: "✅ ¡Correcto! Los hackers usan información personal publicada en redes sociales para manipularte o acceder a tus cuentas.",
          C: "❌ Mejorar tu perfil no es el objetivo de los hackers, lo que quieren es robar información.",
        },
      },
    ],
  },
};

// Módulo actual (se actualiza automáticamente)
let MODULO_ACTUAL = 1;

// Función para enviar mensaje con manejo de errores mejorado
async function enviarMensaje(numeroDestino, texto) {
  try {
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: numeroDestino,
        text: { body: texto },
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error enviando mensaje:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Función para enviar mensaje con plantilla (para mensajes fuera de las 24 horas)
async function enviarMensajePlantilla(
  numeroDestino,
  nombrePlantilla = "hello_world",
  idioma = "es",
  parametros = []
) {
  try {
    const data = {
      messaging_product: "whatsapp",
      to: numeroDestino,
      type: "template",
      template: {
        name: nombrePlantilla,
        language: {
          code: idioma,
        },
      },
    };

    // Agregar parámetros si existen
    if (parametros.length > 0) {
      data.template.components = [
        {
          type: "body",
          parameters: parametros.map((param) => ({
            type: "text",
            text: param,
          })),
        },
      ];
    }

    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: data,
    });

    console.log(
      `Plantilla ${nombrePlantilla} enviada exitosamente a ${numeroDestino}`
    );
    return response.data;
  } catch (error) {
    console.error("Error enviando plantilla:", error.response?.data || error);
    throw error;
  }
}

// Función para enviar video con manejo de errores mejorado
async function enviarVideo(numeroDestino, videoUrl, caption = "") {
  try {
    const response = await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: numeroDestino,
        type: "video",
        video: {
          link: videoUrl,
          caption: caption,
        },
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error enviando video:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Función para enviar imagen (certificado)
async function enviarImagen(numeroDestino, imagenPath, caption = "") {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: numeroDestino,
        type: "image",
        image: {
          link: imagenPath,
          caption: caption,
        },
      },
    });
  } catch (error) {
    console.error("Error enviando imagen:", error);
  }
}

// Función para marcar mensaje como leído
async function marcarComoLeido(messageId) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      },
    });
  } catch (error) {
    console.error("Error marcando como leído:", error);
  }
}

// Función para enviar mensaje con botones simples (solo 2 botones máximo)
async function enviarBotonesSimples(numeroDestino, texto, botones) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: numeroDestino,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: texto,
          },
          action: {
            buttons: botones,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error enviando botones simples:", error);
  }
}

// Función para enviar mensaje con botones de opciones (a, b, c)
async function enviarBotonesOpciones(numeroDestino, texto, botones) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: numeroDestino,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: texto,
          },
          action: {
            buttons: botones,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "Error enviando botones de opciones:",
      error.response?.data || error.message
    );
    // Fallback: enviar como texto si los botones fallan
    try {
      const textoFallback = texto + "\n\n💡 Responde con: A, B o C";
      await enviarMensaje(numeroDestino, textoFallback);
    } catch (fallbackError) {
      console.error("Error en fallback de texto:", fallbackError);
    }
  }
}

// Función para enviar video tutorial con sistema de fallback - NO BLOQUEA EL PROGRESO
async function enviarVideoTutorial(
  numeroUsuario,
  moduloActual = MODULO_ACTUAL
) {
  const caption =
    `🎬 Video Tutorial - Módulo ${moduloActual}\n\n` +
    `📹 Te recomendamos ver este video para aprender sobre el tema.\n\n` +
    `💡 Puedes continuar con las preguntas cuando quieras.`;

  try {
    // Intentar enviar el video
    await enviarVideo(numeroUsuario, VIDEOS_MODULOS[moduloActual], caption);
    console.log(`Video del módulo ${moduloActual} enviado exitosamente`);
  } catch (error) {
    console.error("Error enviando video, usando fallback:", error);
    // Fallback: enviar mensaje de texto con enlace
    const mensajeFallback =
      `🎬 Video Tutorial - Módulo ${moduloActual}\n\n` +
      `📹 Puedes ver el video en: ${VIDEOS_MODULOS[moduloActual]}\n\n` +
      `💡 Te recomendamos verlo para aprender sobre el tema.`;
    await enviarMensaje(numeroUsuario, mensajeFallback);
  }

  return null;
}

// Nueva función para iniciar la prueba directamente con validaciones
async function iniciarPruebaDirecta(numeroUsuario, usarPlantilla = false) {
  // Validar número de teléfono
  if (
    !numeroUsuario ||
    typeof numeroUsuario !== "string" ||
    numeroUsuario.trim() === ""
  ) {
    throw new Error(`Número de teléfono inválido: ${numeroUsuario}`);
  }

  // Limpiar cualquier sesión anterior
  if (userSessions.has(numeroUsuario)) {
    console.log(`Limpiando sesión anterior para ${numeroUsuario}`);
    userSessions.delete(numeroUsuario);
  }

  MODULO_ACTUAL = 1; // Siempre empezar desde el módulo 1

  // Configurar sesión inicial
  const sessionData = {
    estado: "en_prueba",
    iniciadoEn: new Date(),
    modulo: MODULO_ACTUAL,
    resultadosModulos: [],
    numeroUsuario: numeroUsuario,
  };
  
  userSessions.set(numeroUsuario, sessionData);
  
  // Guardar datos de inicio de sesión
  await guardarDatosUsuario({
    ...sessionData,
    evento: "inicio_curso",
    usarPlantilla,
  });

  try {
    if (usarPlantilla) {
      // Usar plantilla para mensajes fuera de las 24 horas
      // NOTA: Debes crear una plantilla llamada "curso_seguridad_inicio" en Meta Business
      // O usar "hello_world" como plantilla de prueba
      await enviarMensajePlantilla(
        numeroUsuario,
        "iniciar_prueba", // Usar tu plantilla aprobada
        "es_AR" // Español Argentina
        // No necesita parámetros
      );
      console.log(`Plantilla de inicio enviada a ${numeroUsuario}`);
    }

    // Enviar el video del primer módulo (sin bloquear)
    try {
      await enviarVideoTutorial(numeroUsuario, MODULO_ACTUAL);
    } catch (videoError) {
      console.error(`Error enviando video tutorial: ${videoError}`);
      // Continuar sin video si falla
    }

    // Esperar un poco antes de iniciar el formulario
    setTimeout(async () => {
      try {
        await iniciarFormulario(numeroUsuario);
      } catch (formError) {
        console.error(`Error iniciando formulario: ${formError}`);
        // Intentar notificar al usuario
        try {
          const tip = showPruebaTips
            ? " Escribe 'prueba' para reintentar."
            : " Inténtalo de nuevo más tarde.";
          await enviarMensaje(numeroUsuario, `⚠️ Hubo un problema.${tip}`);
        } catch (e) {
          console.error("No se pudo notificar al usuario:", e);
        }
      }
    }, 2000);
  } catch (error) {
    console.error(`Error iniciando prueba para ${numeroUsuario}:`, error);

    // Si falló y no estábamos usando plantilla, intentar con plantilla
    const errorCode = error.response?.data?.error?.code || 
                     error.response?.data?.error?.error_data?.code ||
                     (error.response?.data?.error && 
                      error.response.data.error.find && 
                      error.response.data.error.find(e => e.code === 131047)?.code);
    
    if (!usarPlantilla && (errorCode === 131047 || error.message?.includes('131047'))) {
      console.log("🔄 Error 131047 detectado - Reintentando con plantilla...");
      console.log("Error original:", JSON.stringify(error.response?.data, null, 2));
      return iniciarPruebaDirecta(numeroUsuario, true);
    }

    throw error;
  }

  return null;
}

// Función para iniciar el formulario con validaciones mejoradas
async function iniciarFormulario(numeroUsuario) {
  try {
    // Validar que el módulo actual existe
    if (!modulos[MODULO_ACTUAL]) {
      console.error(`Módulo ${MODULO_ACTUAL} no existe`);
      return;
    }

    // Preservar resultados anteriores si existen
    const sesionAnterior = userSessions.get(numeroUsuario);

    userSessions.set(numeroUsuario, {
      enFormulario: true,
      preguntaActual: 0,
      respuestasCorrectas: 0,
      iniciadoEn: new Date(),
      modulo: MODULO_ACTUAL,
      resultadosModulos: sesionAnterior?.resultadosModulos || [],
      estado: "en_formulario",
    });

    // Enviar título del módulo primero
    await enviarMensaje(numeroUsuario, modulos[MODULO_ACTUAL].titulo);

    // Pequeña pausa antes de enviar la primera pregunta
    setTimeout(async () => {
      try {
        await enviarPreguntaConBotones(numeroUsuario, 0);
      } catch (error) {
        console.error(
          `Error enviando primera pregunta a ${numeroUsuario}:`,
          error
        );
      }
    }, 1500);

    return null;
  } catch (error) {
    console.error(`Error iniciando formulario para ${numeroUsuario}:`, error);
    throw error;
  }
}

// Función para enviar pregunta con botones simples (solo letras)
async function enviarPreguntaConBotones(numeroUsuario, indicePregunta) {
  try {
    // Validación de parámetros
    if (!modulos[MODULO_ACTUAL]) {
      console.error(`Módulo ${MODULO_ACTUAL} no existe`);
      return;
    }

    if (!modulos[MODULO_ACTUAL].preguntas[indicePregunta]) {
      console.error(
        `Pregunta ${indicePregunta} no existe en módulo ${MODULO_ACTUAL}`
      );
      return;
    }

    const pregunta = modulos[MODULO_ACTUAL].preguntas[indicePregunta];

    // Crear mensaje completo con opciones
    let mensaje = `🟡 Pregunta ${pregunta.numero}:\n${pregunta.pregunta}\n\n`;

    // Agregar todas las opciones completas en el texto
    pregunta.opciones.forEach((opcion) => {
      mensaje += `${opcion}\n`;
    });

    mensaje += `\n💡 Selecciona tu respuesta:`;

    // Crear botones simples solo con las letras
    const botones = [
      {
        type: "reply",
        reply: {
          id: `respuesta_a_${indicePregunta}`,
          title: "A",
        },
      },
      {
        type: "reply",
        reply: {
          id: `respuesta_b_${indicePregunta}`,
          title: "B",
        },
      },
      {
        type: "reply",
        reply: {
          id: `respuesta_c_${indicePregunta}`,
          title: "C",
        },
      },
    ];

    await enviarBotonesOpciones(numeroUsuario, mensaje, botones);
  } catch (error) {
    console.error(`Error enviando pregunta con botones: ${error}`);
    // Intentar enviar como texto si falla
    try {
      const pregunta = modulos[MODULO_ACTUAL].preguntas[indicePregunta];
      let mensajeFallback = `🔴 Pregunta ${pregunta.numero}:\n${pregunta.pregunta}\n\n`;
      pregunta.opciones.forEach((opcion) => {
        mensajeFallback += `${opcion}\n`;
      });
      mensajeFallback += `\n💡 Responde con: A, B o C`;
      await enviarMensaje(numeroUsuario, mensajeFallback);
    } catch (fallbackError) {
      console.error("Error en fallback:", fallbackError);
    }
  }
}

// Función para procesar respuesta del formulario
async function procesarRespuestaFormulario(numeroUsuario, message) {
  const sesion = userSessions.get(numeroUsuario);
  if (!sesion || !sesion.enFormulario) {
    return showPruebaTips
      ? "No tienes un formulario activo. Escribe 'prueba' para comenzar."
      : "No tienes un formulario activo.";
  }

  let respuestaSeleccionada;

  // Verificar si es una respuesta de botón interactivo
  if (message.type === "interactive") {
    if (message.interactive.type === "button_reply") {
      const buttonId = message.interactive.button_reply.id;

      // Extraer la letra de la respuesta (a, b, c) del nuevo formato
      if (buttonId.startsWith("respuesta_")) {
        const letra = buttonId.split("_")[1]; // Extraer a, b, c
        respuestaSeleccionada = letra.toUpperCase(); // Convertir a mayúscula
      }
    }
  } else if (message.type === "text") {
    // Respuesta de texto como fallback
    respuestaSeleccionada = message.text.body.trim().toLowerCase();

    // Convertir a mayúscula para comparar
    if (respuestaSeleccionada === "a") respuestaSeleccionada = "A";
    else if (respuestaSeleccionada === "b") respuestaSeleccionada = "B";
    else if (respuestaSeleccionada === "c") respuestaSeleccionada = "C";
    else {
      await enviarMensaje(
        numeroUsuario,
        "Por favor, responde con los botones o escribe: a, b o c"
      );
      return null;
    }
  }

  // Verificar que tenemos una respuesta válida
  if (!respuestaSeleccionada) {
    await enviarMensaje(numeroUsuario, "Por favor, selecciona una opción.");
    return null;
  }

  const preguntaActual =
    modulos[MODULO_ACTUAL].preguntas[sesion.preguntaActual];
  const respuestaCorrecta =
    respuestaSeleccionada === preguntaActual.respuesta_correcta;

  if (respuestaCorrecta) {
    sesion.respuestasCorrectas++;
  }

  // Guardar respuesta detallada para analytics
  if (!sesion.respuestasDetalladas) {
    sesion.respuestasDetalladas = [];
  }
  
  sesion.respuestasDetalladas.push({
    pregunta: sesion.preguntaActual + 1,
    preguntaTexto: preguntaActual.pregunta,
    respuestaSeleccionada,
    respuestaCorrecta: preguntaActual.respuesta_correcta,
    esCorrecta: respuestaCorrecta,
    timestamp: new Date(),
  });

  // Enviar retroalimentación específica
  const retroalimentacion =
    preguntaActual.retroalimentacion[respuestaSeleccionada];
  if (retroalimentacion) {
    await enviarMensaje(numeroUsuario, retroalimentacion);
  }

  sesion.preguntaActual++;

  // Verificar si hay más preguntas
  if (sesion.preguntaActual < modulos[MODULO_ACTUAL].preguntas.length) {
    // Pequeña pausa antes de enviar siguiente pregunta
    setTimeout(async () => {
      try {
        await enviarPreguntaConBotones(numeroUsuario, sesion.preguntaActual);
      } catch (error) {
        console.error(
          `Error enviando pregunta ${sesion.preguntaActual}:`,
          error
        );
      }
    }, 2000);
    return null;
  } else {
    // Módulo completado - guardar resultado
    const resultadoModulo = {
      modulo: MODULO_ACTUAL,
      titulo: modulos[MODULO_ACTUAL].titulo,
      respuestasCorrectas: sesion.respuestasCorrectas,
      totalPreguntas: modulos[MODULO_ACTUAL].preguntas.length,
      porcentaje:
        (sesion.respuestasCorrectas / modulos[MODULO_ACTUAL].preguntas.length) *
        100,
    };

    sesion.resultadosModulos.push(resultadoModulo);

    // Guardar datos del módulo completado
    await guardarRespuestasFormulario(numeroUsuario, MODULO_ACTUAL, {
      resultadoModulo,
      respuestasDetalladas: sesion.respuestasDetalladas || [],
      fecha_completado: new Date(),
    });

    // Mostrar resultado del módulo actual
    const resultado = generarResultadoModulo(
      sesion.respuestasCorrectas,
      modulos[MODULO_ACTUAL].preguntas.length
    );
    await enviarMensaje(numeroUsuario, resultado);

    // Verificar si hay más módulos
    if (MODULO_ACTUAL < 6) {
      // Avanzar al siguiente módulo
      MODULO_ACTUAL++;

      // Pequeña pausa antes de continuar con el siguiente módulo
      setTimeout(async () => {
        try {
          // Enviar video del siguiente módulo (no bloquea)
          await enviarVideoTutorial(numeroUsuario, MODULO_ACTUAL);

          // Esperar un poco más antes de iniciar el formulario del siguiente módulo
          setTimeout(async () => {
            try {
              await iniciarFormulario(numeroUsuario);
            } catch (formError) {
              console.error(
                `Error iniciando formulario del módulo ${MODULO_ACTUAL}:`,
                formError
              );
              await enviarMensaje(
                numeroUsuario,
                showPruebaTips
                  ? "⚠️ Error al continuar. Escribe 'prueba' para reiniciar."
                  : "⚠️ Error al continuar."
              );
            }
          }, 2000);
        } catch (videoError) {
          console.error(
            `Error enviando video del módulo ${MODULO_ACTUAL}:`,
            videoError
          );
          // Continuar sin video
          setTimeout(async () => {
            try {
              await iniciarFormulario(numeroUsuario);
            } catch (formError) {
              console.error(`Error iniciando formulario:`, formError);
            }
          }, 1000);
        }
      }, 3000);

      return null;
    } else {
      // Todos los módulos completados - mostrar mensaje final y enviar certificado
      const mensajeFinal = generarMensajeFinal(sesion.resultadosModulos);
      await enviarMensaje(numeroUsuario, mensajeFinal);

      // Esperar un poco antes de enviar certificado y encuesta
      setTimeout(async () => {
        try {
          await enviarCertificadoYEncuesta(
            numeroUsuario,
            sesion.resultadosModulos
          );
        } catch (certError) {
          console.error(`Error enviando certificado:`, certError);
          // Intentar al menos enviar un mensaje de felicitación
          try {
            await enviarMensaje(
              numeroUsuario,
              "🎉 ¡Felicitaciones! Has completado todos los módulos del curso. 🏆"
            );
          } catch (e) {
            console.error("Error enviando mensaje de felicitación:", e);
          }
        }
      }, 2000);

      return null; // No retornar mensaje ya que se envía por separado
    }
  }
}

// Función para generar resultado final del módulo
function generarResultadoModulo(respuestasCorrectas, totalPreguntas) {
  const porcentaje = (respuestasCorrectas / totalPreguntas) * 100;

  let mensaje = `🎉 ¡${modulos[MODULO_ACTUAL].titulo} completado!\n\n`;
  mensaje += `📊 Resultado: ${respuestasCorrectas}/${totalPreguntas} respuestas correctas (${porcentaje.toFixed(
    1
  )}%)\n\n`;

  if (porcentaje >= 80) {
    mensaje += `🏆 ¡Excelente! Has dominado este módulo.`;
  } else if (porcentaje >= 60) {
    mensaje += `👍 ¡Bien hecho! Tienes una buena base en este tema.`;
  } else {
    mensaje += `📚 Es importante reforzar estos conceptos.`;
  }

  if (MODULO_ACTUAL < 6) {
    mensaje += `\n\n🎬 Continuemos con el siguiente módulo...`;
  }

  return mensaje;
}

// Función para enviar certificado y iniciar encuesta
async function enviarCertificadoYEncuesta(numeroUsuario, resultadosModulos) {
  // Primero enviar el certificado (desde DigitalOcean CDN)
  const certificadoUrl =
    "https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/Certificado-curso-Phishing.jpg";
  await enviarImagen(
    numeroUsuario,
    certificadoUrl,
    "🎉 ¡Felicitaciones! Has completado el curso de Concientización en Seguridad Digital. Aquí tienes tu certificado."
  );

  // Esperar un poco antes de enviar la encuesta
  setTimeout(async () => {
    const mensajeEncuesta = `Tu opinión es muy valiosa para nosotros. Por favor, tómate 1 minuto para responder esta breve encuesta y ayudarnos a mejorar.\n\n👉 Solo haz clic en las opciones que mejor representen tu experiencia.\n\n¡Tus respuestas son anónimas y nos ayudarán a crear mejores contenidos para todos! 🙌\n\n📝 **Encuesta de Satisfacción - Curso de Phishing**`;

    await enviarMensaje(numeroUsuario, mensajeEncuesta);

    // Iniciar la encuesta
    setTimeout(() => {
      iniciarEncuesta(numeroUsuario);
    }, 2000);
  }, 3000);
}

// Sistema de encuesta de satisfacción
const preguntasEncuesta = [
  {
    numero: 1,
    pregunta: "**1. Duración del curso**",
    opciones: ["🔘 Demasiado corto", "🔘 Adecuado", "🔘 Demasiado largo"],
    ids: ["duracion_corto", "duracion_adecuado", "duracion_largo"],
  },
  {
    numero: 2,
    pregunta: "**2. Comprensión de los contenidos**",
    opciones: [
      "🔘 Excelente (todo claro)",
      "🔘 Bueno (casi todo entendido)",
      "🔘 Regular (algunas dudas)",
    ],
    ids: [
      "comprension_excelente",
      "comprension_bueno",
      "comprension_regular",
    ],
  },
  {
    numero: 3,
    pregunta: "**3. Dinámica del curso**",
    opciones: ["🔘 Muy interactiva", "🔘 Aceptable", "🔘 Poco dinámica"],
    ids: ["dinamica_muy", "dinamica_aceptable", "dinamica_poco"],
  },
  {
    numero: 4,
    pregunta: "**4. Utilidad práctica**",
    opciones: ["🔘 Muy útil", "🔘 Algo útil", "🔘 Poco útil"],
    ids: ["utilidad_muy", "utilidad_algo", "utilidad_poco"],
  },
  {
    numero: 5,
    pregunta: "**5. Recomendación**",
    opciones: [
      "🔘 Sí recomendaría",
      "🔘 Tal vez recomendaría",
      "🔘 No recomendaría",
    ],
    ids: ["recomendacion_si", "recomendacion_tal_vez", "recomendacion_no"],
  },
];

// Función para iniciar la encuesta
async function iniciarEncuesta(numeroUsuario) {
  userSessions.set(numeroUsuario, {
    enEncuesta: true,
    preguntaEncuestaActual: 0,
    respuestasEncuesta: [],
    iniciadoEn: new Date(),
  });

  await enviarPreguntaEncuesta(numeroUsuario, 0);
}

// Función para enviar pregunta de encuesta
async function enviarPreguntaEncuesta(numeroUsuario, indicePregunta) {
  const pregunta = preguntasEncuesta[indicePregunta];

  let mensaje = `${pregunta.pregunta}\n\n`;
  pregunta.opciones.forEach((opcion) => {
    mensaje += `${opcion}\n`;
  });

  // Crear botones dinámicamente según el número de opciones
  const botones = pregunta.ids.map((id, index) => ({
    type: "reply",
    reply: {
      id: id,
      title: `Opción ${index + 1}`,
    },
  }));

  // WhatsApp permite máximo 3 botones, si hay más opciones usar texto
  if (botones.length <= 3) {
    await enviarBotonesOpciones(numeroUsuario, mensaje, botones);
  } else {
    mensaje += `\n💡 Responde con el número de tu opción (1, 2, 3, 4)`;
    await enviarMensaje(numeroUsuario, mensaje);
  }
}

// Función para procesar respuesta de encuesta
async function procesarRespuestaEncuesta(numeroUsuario, message) {
  const sesion = userSessions.get(numeroUsuario);
  if (!sesion || !sesion.enEncuesta) {
    return "No tienes una encuesta activa.";
  }

  let respuestaSeleccionada;

  // Verificar si es una respuesta de botón interactivo
  if (message.type === "interactive") {
    if (message.interactive.type === "button_reply") {
      const buttonId = message.interactive.button_reply.id;
      respuestaSeleccionada = buttonId;
    }
  } else if (message.type === "text") {
    // Respuesta de texto para preguntas con más de 3 opciones
    const textoRespuesta = message.text.body.trim();
    const preguntaActual = preguntasEncuesta[sesion.preguntaEncuestaActual];

    const numeroOpcion = parseInt(textoRespuesta);
    if (numeroOpcion >= 1 && numeroOpcion <= preguntaActual.opciones.length) {
      respuestaSeleccionada = preguntaActual.ids[numeroOpcion - 1];
    } else {
      await enviarMensaje(
        numeroUsuario,
        "Por favor, responde con un número válido de opción."
      );
      return null;
    }
  }

  if (!respuestaSeleccionada) {
    await enviarMensaje(
      numeroUsuario,
      "Por favor, selecciona una opción válida."
    );
    return null;
  }

  // Guardar respuesta
  sesion.respuestasEncuesta.push({
    pregunta: sesion.preguntaEncuestaActual + 1,
    respuesta: respuestaSeleccionada,
  });

  sesion.preguntaEncuestaActual++;

  // Verificar si hay más preguntas
  if (sesion.preguntaEncuestaActual < preguntasEncuesta.length) {
    // Pequeña pausa antes de enviar siguiente pregunta
    setTimeout(() => {
      enviarPreguntaEncuesta(numeroUsuario, sesion.preguntaEncuestaActual);
    }, 1500);
    return null;
  } else {
    // Encuesta completada - guardar datos
    const datosCompletos = userSessions.get(numeroUsuario);
    await guardarRespuestasEncuesta(
      numeroUsuario,
      sesion.respuestasEncuesta,
      datosCompletos?.resultadosModulos || []
    );
    
    userSessions.delete(numeroUsuario);
    MODULO_ACTUAL = 1; // Resetear para el próximo usuario
    return "¡Mil gracias por ayudarnos a mejorar! ✨\n\nTus respuestas han sido registradas y nos ayudarán a crear mejores contenidos para todos.\n\n¡Que tengas un excelente día y recuerda mantener siempre tu seguridad digital! 🛡️💻";
  }
}

// Función para generar mensaje final de felicitaciones
function generarMensajeFinal(resultadosModulos) {
  let mensaje = `🎉 ¡Felicitaciones! 🎉\n\n`;
  mensaje += `Has completado con éxito los 6 módulos del curso de Concientización en Seguridad Digital. Ahora estás mejor preparado para identificar y protegerte de amenazas como el phishing y otros riesgos en línea.\n\n`;

  // Mostrar resumen de resultados
  mensaje += `📊 **Resumen de tus resultados:**\n\n`;

  let totalCorrectas = 0;
  let totalPreguntas = 0;

  resultadosModulos.forEach((resultado, index) => {
    mensaje += `${index + 1}. ${resultado.titulo.replace("✅ ", "")}\n`;
    mensaje += `   📈 ${resultado.respuestasCorrectas}/${
      resultado.totalPreguntas
    } (${resultado.porcentaje.toFixed(1)}%)\n\n`;
    totalCorrectas += resultado.respuestasCorrectas;
    totalPreguntas += resultado.totalPreguntas;
  });

  const porcentajeTotal = (totalCorrectas / totalPreguntas) * 100;
  mensaje += `🏆 **Puntuación total: ${totalCorrectas}/${totalPreguntas} (${porcentajeTotal.toFixed(
    1
  )}%)**\n\n`;

  mensaje += `Gracias a todo lo aprendido, tienes las herramientas necesarias para mantener tu información personal segura y navegar de manera más protegida.\n\n`;
  mensaje += `**Recuerda siempre:**\n`;
  mensaje += `• Crea contraseñas seguras y únicas.\n`;
  mensaje += `• Identifica correos falsos y phishing.\n`;
  mensaje += `• Verifica antes de hacer clic en enlaces sospechosos.\n`;
  mensaje += `• Reporta cualquier incidente de seguridad.\n\n`;
  mensaje += `¡Tu seguridad digital es lo más importante! Gracias por completar este curso y estar un paso más cerca de una navegación segura.\n\n`;
  mensaje += `¡Estás listo para defenderte de las amenazas cibernéticas! 🛡️💻`;

  return mensaje;
}

// Función para generar resumen de resultados parciales (cuando salen)
function generarResumenParcial(
  resultadosModulos,
  moduloActual,
  respuestasCorrectas,
  totalPreguntas
) {
  console.log("=== DEBUG generarResumenParcial ===");
  console.log("resultadosModulos:", resultadosModulos);
  console.log("moduloActual:", moduloActual);
  console.log("respuestasCorrectas:", respuestasCorrectas);
  console.log("totalPreguntas:", totalPreguntas);

  let mensaje = `📊 **Resumen de tu progreso:**\n\n`;

  // Mostrar módulos completados
  if (resultadosModulos && resultadosModulos.length > 0) {
    mensaje += `**Módulos completados:**\n`;
    resultadosModulos.forEach((resultado, index) => {
      mensaje += `${index + 1}. ${resultado.titulo.replace("✅ ", "")}\n`;
      mensaje += `   📈 ${resultado.respuestasCorrectas}/${
        resultado.totalPreguntas
      } (${resultado.porcentaje.toFixed(1)}%)\n\n`;
    });
  } else {
    mensaje += `**Módulos completados:** Ninguno\n\n`;
  }

  // Mostrar módulo actual si está en progreso
  if (totalPreguntas > 0) {
    const porcentajeActual = (respuestasCorrectas / totalPreguntas) * 100;
    mensaje += `**Módulo actual (${moduloActual}):**\n`;
    mensaje += `📈 ${respuestasCorrectas}/${totalPreguntas} (${porcentajeActual.toFixed(
      1
    )}%) - En progreso\n\n`;
  } else {
    // Mostrar información del módulo actual aunque no haya progreso
    if (moduloActual && modulos[moduloActual]) {
      mensaje += `**Estabas en:**\n`;
      mensaje += `${modulos[moduloActual].titulo}\n`;
      mensaje += `📈 0/${modulos[moduloActual].preguntas.length} - No iniciado\n\n`;
    }
  }

  if (showPruebaTips) {
    mensaje += `¡Puedes continuar cuando quieras escribiendo 'prueba'! 😊`;
  }

  console.log("Mensaje generado:", mensaje);
  return mensaje;
}

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));

  // check if the webhook request contains a message
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  // check if the incoming message contains text, interactive, or button
  if (
    message?.type === "text" ||
    message?.type === "interactive" ||
    message?.type === "button"
  ) {
    const numeroUsuario = message.from;
    let textoMensaje = "";
    let esRespuestaFormulario = false;
    let esRespuestaEncuesta = false;

    // Extraer el texto del mensaje
    if (message.type === "text") {
      textoMensaje = message.text.body.toLowerCase().trim();
    } else if (message.type === "button") {
      // Manejar botón de plantilla (Campaign template button)
      if (
        message.button?.payload === "prueba" ||
        message.button?.text === "prueba"
      ) {
        textoMensaje = "prueba"; // Tratar como comando prueba
        console.log("Botón de plantilla detectado: iniciando prueba");
      } else if (
        message.button?.payload === "eINSERTAREMOJI" ||
        message.button?.text === "eINSERTAREMOJI"
      ) {
        textoMensaje = "eINSERTAREMOJI"; // Tratar como comando especial
        console.log("Botón eINSERTAREMOJI detectado: enviando imagen especial");
      }
    } else if (message.type === "interactive") {
      // Manejar botones interactivos
      if (message.interactive.type === "button_reply") {
        const buttonId = message.interactive.button_reply.id;

        // Verificar si es el botón de iniciar
        if (buttonId === "iniciar_si") {
          textoMensaje = "comenzar";
        } else if (buttonId === "iniciar_no") {
          textoMensaje = "no_iniciar";
        }
        // Verificar si es una respuesta A, B, C del formulario
        else if (buttonId.startsWith("respuesta_")) {
          esRespuestaFormulario = true;
        }
        // Verificar si es una respuesta de encuesta
        else if (
          buttonId.includes("duracion_") ||
          buttonId.includes("comprension_") ||
          buttonId.includes("dinamica_") ||
          buttonId.includes("utilidad_") ||
          buttonId.includes("recomendacion_")
        ) {
          esRespuestaEncuesta = true;
        }
      }
    }

    let respuesta;

    // Procesar respuestas de formulario directamente
    if (esRespuestaFormulario && userSessions.has(numeroUsuario)) {
      const sesion = userSessions.get(numeroUsuario);
      if (sesion.enFormulario) {
        respuesta = await procesarRespuestaFormulario(numeroUsuario, message);
      }
    }
    // Procesar respuestas de encuesta directamente
    else if (esRespuestaEncuesta && userSessions.has(numeroUsuario)) {
      const sesion = userSessions.get(numeroUsuario);
      if (sesion.enEncuesta) {
        respuesta = await procesarRespuestaEncuesta(numeroUsuario, message);
      }
    }
    // Verificar si el usuario quiere salir
    else if (textoMensaje === "salir") {
      const sesion = userSessions.get(numeroUsuario);
      console.log("=== DEBUG comando salir ===");
      console.log("sesion:", sesion);

      if (
        sesion &&
        (sesion.enFormulario ||
          sesion.estado === "viendo_video" ||
          sesion.enEncuesta)
      ) {
        // Generar resumen parcial
        respuesta = generarResumenParcial(
          sesion.resultadosModulos || [],
          sesion.modulo || MODULO_ACTUAL,
          sesion.respuestasCorrectas || 0,
          sesion.preguntaActual || 0
        );
        userSessions.delete(numeroUsuario); // Limpiar sesión
        MODULO_ACTUAL = 1; // Resetear módulo
      } else {
        respuesta = showPruebaTips
          ? "No hay ninguna prueba activa. Escribe 'prueba' para comenzar."
          : "No hay ninguna prueba activa.";
      }
    }
    // Verificar si el usuario presionó el botón eINSERTAREMOJI
    else if (textoMensaje === "eINSERTAREMOJI") {
      try {
        await enviarImagen(
          numeroUsuario,
          "https://i.chzbgr.com/full/6796713984/hF30B7124/furry-query",
          "😂 eINSERTAREMOJI"
        );
        respuesta = null; // No enviar mensaje adicional
      } catch (error) {
        console.error("Error enviando imagen especial:", error);
        respuesta = "No pude enviar la imagen xd";
      }
    }
    // Verificar si el usuario quiere iniciar la prueba (comando "prueba")
    else if (textoMensaje === "prueba") {
      await iniciarPruebaDirecta(numeroUsuario);
      respuesta = null; // No enviar mensaje adicional
    }
    // Verificar si el usuario quiere comenzar el formulario (compatibilidad con botón "Sí")
    else if (textoMensaje === "comenzar") {
      const sesion = userSessions.get(numeroUsuario);
      // Si no hay sesión activa, iniciar la prueba directamente
      if (!sesion) {
        await iniciarPruebaDirecta(numeroUsuario);
        respuesta = null;
      } else if (
        sesion.estado === "viendo_video" ||
        sesion.estado === "en_prueba"
      ) {
        // Si ya está en proceso, continuar con el formulario
        respuesta = await iniciarFormulario(numeroUsuario);
      } else {
        respuesta =
          "Ya tienes una prueba en progreso. Continúa respondiendo las preguntas.";
      }
    }
    // Verificar si el usuario no quiere iniciar
    else if (textoMensaje === "no_iniciar") {
      userSessions.delete(numeroUsuario); // Limpiar sesión
      MODULO_ACTUAL = 1; // Resetear módulo
      respuesta = showPruebaTips
        ? "Está bien, puedes iniciar la prueba cuando quieras. Escribe 'prueba' para comenzar de nuevo."
        : "Está bien, puedes iniciar la prueba cuando quieras.";
    }
    // Verificar si el usuario está en un formulario activo
    else if (
      userSessions.has(numeroUsuario) &&
      userSessions.get(numeroUsuario).enFormulario
    ) {
      respuesta = await procesarRespuestaFormulario(numeroUsuario, message);
    }
    // Verificar si el usuario está en una encuesta activa
    else if (
      userSessions.has(numeroUsuario) &&
      userSessions.get(numeroUsuario).enEncuesta
    ) {
      respuesta = await procesarRespuestaEncuesta(numeroUsuario, message);
    }
    // Respuesta por defecto (echo) - solo si no se procesó ninguna acción
    else if (!esRespuestaFormulario && !esRespuestaEncuesta) {
      respuesta =
        "Echo: " +
        (message.type === "text" ? message.text.body : "Mensaje interactivo") +
        (showPruebaTips
          ? "\n\n💡 Tip: Escribe 'prueba' para iniciar el curso de seguridad digital.\n📤 Escribe 'salir' en cualquier momento para abandonar la prueba."
          : "\n\n📤 Escribe 'salir' en cualquier momento para abandonar la prueba.");
    }

    // Enviar respuesta solo si hay una
    if (respuesta) {
      await enviarMensaje(numeroUsuario, respuesta);
    }

    // Marcar mensaje como leído
    await marcarComoLeido(message.id);
  }

  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

// Nuevo endpoint POST para iniciar prueba desde solicitud externa
app.post("/iniciar-prueba", async (req, res) => {
  try {
    const { numero, numeros, usarPlantilla = false } = req.body;

    // Determinar qué tipo de input se recibió
    let numerosAProcesar = [];

    // Caso 1: Array de números
    if (numeros && Array.isArray(numeros)) {
      numerosAProcesar = numeros.filter((n) => n && typeof n === "string");
    }
    // Caso 2: Un solo número
    else if (numero && typeof numero === "string") {
      numerosAProcesar = [numero];
    }
    // Caso 3: Error - no se proporcionó nada válido
    else {
      return res.status(400).json({
        error:
          "Se requiere 'numero' (string) o 'numeros' (array de strings) en el body",
        ejemplo: {
          opcion1: { numero: "584121234567" },
          opcion2: { numeros: ["584121234567", "584129876543"] },
          opcion3: { numero: "584121234567", usarPlantilla: true },
        },
        nota: "Use 'usarPlantilla: true' para enviar a usuarios fuera de la ventana de 24 horas",
      });
    }

    // Eliminar duplicados
    numerosAProcesar = [...new Set(numerosAProcesar)];

    // Validar que hay números para procesar
    if (numerosAProcesar.length === 0) {
      return res.status(400).json({
        error: "No se proporcionaron números válidos",
        mensaje: "Los números deben ser strings no vacíos",
      });
    }

    // Procesar cada número con manejo robusto de errores
    const resultados = [];
    const errores = [];

    // Procesar en lotes para evitar sobrecarga
    const BATCH_SIZE = 5; // Procesar 5 números a la vez

    for (let i = 0; i < numerosAProcesar.length; i += BATCH_SIZE) {
      const batch = numerosAProcesar.slice(i, i + BATCH_SIZE);

      // Procesar batch en paralelo
      const promesas = batch.map(async (num) => {
        try {
          // Validar formato del número
          if (!num || num.trim() === "") {
            throw new Error("Número vacío o inválido");
          }

          // Limpiar cualquier sesión anterior
          userSessions.delete(num);

          // Iniciar la prueba (con plantilla si se especifica)
          await iniciarPruebaDirecta(num, usarPlantilla);

          return {
            numero: num,
            status: "success",
            message: usarPlantilla
              ? "Prueba iniciada con plantilla"
              : "Prueba iniciada exitosamente",
            metodo: usarPlantilla ? "plantilla" : "mensaje_directo",
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          console.error(`Error iniciando prueba para ${num}:`, error.message);

          // Información detallada del error
          const errorInfo = {
            numero: num,
            status: "error",
            message: error.message || "Error desconocido",
            timestamp: new Date().toISOString(),
          };

          // Detectar tipo de error específico
          const errorCode = error.response?.data?.error?.code || 
                           error.response?.data?.error?.error_data?.code ||
                           (error.response?.data?.error && 
                            error.response.data.error.find && 
                            error.response.data.error.find(e => e.code === 131047)?.code);
          
          if (errorCode === 131047 || error.message?.includes('131047')) {
            errorInfo.tipo = "ventana_24_horas";
            errorInfo.sugerencia =
              "Use 'usarPlantilla: true' para enviar fuera de la ventana de 24 horas";
            errorInfo.codigoError = 131047;
          } else if (error.response?.status === 404) {
            errorInfo.tipo = "numero_invalido";
            errorInfo.sugerencia =
              "Verifique que el número esté registrado en WhatsApp";
          } else if (error.response?.status === 401) {
            errorInfo.tipo = "autenticacion";
            errorInfo.sugerencia = "Verifique el token de API";
          }

          return errorInfo;
        }
      });

      // Esperar a que termine el batch
      const resultadosBatch = await Promise.all(promesas);

      // Clasificar resultados
      resultadosBatch.forEach((resultado) => {
        if (resultado.status === "success") {
          resultados.push(resultado);
          console.log(`✅ Prueba iniciada para: ${resultado.numero}`);
        } else {
          errores.push(resultado);
          console.log(
            `❌ Error para: ${resultado.numero} - ${resultado.message}`
          );
        }
      });

      // Pequeña pausa entre batches para no sobrecargar la API
      if (i + BATCH_SIZE < numerosAProcesar.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Responder con el resumen
    const response = {
      success: errores.length === 0,
      message: `Pruebas iniciadas: ${resultados.length} exitosas, ${errores.length} con errores`,
      totalProcesados: numerosAProcesar.length,
      resultados: resultados,
    };

    // Solo incluir errores si los hay
    if (errores.length > 0) {
      response.errores = errores;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error iniciando prueba via POST:", error);
    res.status(500).json({
      error: "Error al iniciar la prueba",
      details: error.message,
    });
  }
});

// Endpoint para enviar tu plantilla de prueba
app.post("/enviar-test", async (req, res) => {
  try {
    // Usar el número que proporcionaste o permitir enviar a otro
    const numero = req.body.numero || "584129704419";

    // Enviar la plantilla "test"
    const resultado = await enviarMensajePlantilla(
      numero,
      "test", // Nombre exacto de tu plantilla
      "en_US" // Inglés US como está configurada tu plantilla
    );

    res.status(200).json({
      success: true,
      message: `Plantilla 'test' enviada a ${numero}`,
      data: resultado,
    });
  } catch (error) {
    console.error(
      "Error enviando plantilla test:",
      error.response?.data || error
    );
    res.status(500).json({
      error: "Error al enviar plantilla",
      details: error.response?.data || error.message,
    });
  }
});

// Endpoint test-camila para enviar plantilla especial
app.post("/test-camila", async (req, res) => {
  try {
    const numero = req.body.numero || "584129704419";

    // Enviar la plantilla "test" o cualquier plantilla que quieras
    const resultado = await enviarMensajePlantilla(
      numero,
      "camille", // Puedes cambiar esto por el nombre de tu plantilla
      "en"
    );

    res.status(200).json({
      success: true,
      message: `Plantilla test-camila enviada a ${numero}`,
      data: resultado,
    });
  } catch (error) {
    console.error(
      "Error enviando plantilla test-camila:",
      error.response?.data || error
    );
    res.status(500).json({
      error: "Error al enviar plantilla",
      details: error.response?.data || error.message,
    });
  }
});

// Endpoint para enviar plantilla iniciar_prueba a múltiples números
app.post("/enviar-iniciar-prueba", async (req, res) => {
  try {
    const { numero, numeros } = req.body;

    // Determinar lista de números a procesar
    let numerosAProcesar = [];

    if (numeros && Array.isArray(numeros)) {
      numerosAProcesar = numeros.filter((n) => n && typeof n === "string");
    } else if (numero && typeof numero === "string") {
      numerosAProcesar = [numero];
    } else {
      return res.status(400).json({
        error: "Se requiere 'numero' (string) o 'numeros' (array)",
        ejemplo: {
          opcion1: { numero: "584121234567" },
          opcion2: { numeros: ["584121234567", "584129876543"] },
        },
      });
    }

    // Eliminar duplicados
    numerosAProcesar = [...new Set(numerosAProcesar)];

    if (numerosAProcesar.length === 0) {
      return res.status(400).json({
        error: "No se proporcionaron números válidos",
      });
    }

    // Procesar envíos
    const resultados = [];
    const errores = [];
    const BATCH_SIZE = 5;

    for (let i = 0; i < numerosAProcesar.length; i += BATCH_SIZE) {
      const batch = numerosAProcesar.slice(i, i + BATCH_SIZE);

      const promesas = batch.map(async (num) => {
        try {
          // Enviar plantilla iniciar_prueba en español (Argentina)
          const resultado = await enviarMensajePlantilla(
            num,
            "iniciar_prueba", // Nombre de tu plantilla
            "es_AR" // Español Argentina
          );

          return {
            numero: num,
            status: "success",
            message: "Plantilla 'iniciar_prueba' enviada exitosamente",
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          console.error(
            `Error enviando a ${num}:`,
            error.response?.data || error
          );
          return {
            numero: num,
            status: "error",
            message: error.response?.data?.error?.message || error.message,
            timestamp: new Date().toISOString(),
          };
        }
      });

      const resultadosBatch = await Promise.all(promesas);

      resultadosBatch.forEach((resultado) => {
        if (resultado.status === "success") {
          resultados.push(resultado);
        } else {
          errores.push(resultado);
        }
      });

      // Pausa entre batches
      if (i + BATCH_SIZE < numerosAProcesar.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    res.status(200).json({
      success: errores.length === 0,
      message: `Plantilla enviada: ${resultados.length} exitosas, ${errores.length} con errores`,
      totalProcesados: numerosAProcesar.length,
      resultados: resultados,
      errores: errores.length > 0 ? errores : undefined,
    });
  } catch (error) {
    console.error("Error en endpoint iniciar-prueba:", error);
    res.status(500).json({
      error: "Error al enviar plantilla",
      details: error.message,
    });
  }
});

// Endpoint para enviar plantilla centromundox con variables
app.post("/enviar-centromundox", async (req, res) => {
  try {
    const { numero, nombre, hora, serial } = req.body;
    
    // Validar parámetros requeridos
    if (!numero || !nombre || !hora || !serial) {
      return res.status(400).json({
        error: "Se requieren todos los parámetros: numero, nombre, hora, serial",
        ejemplo: {
          numero: "584129704419",
          nombre: "Juan Pérez",
          hora: "14:30",
          serial: "ABC123456"
        }
      });
    }
    
    // Enviar plantilla con los 3 parámetros
    const resultado = await enviarMensajePlantilla(
      numero,
      "centromundox",  // Nombre de tu plantilla
      "en_US",          // Inglés US como configuraste
      [nombre, hora, serial]  // Los 3 parámetros en orden: {{1}}, {{2}}, {{3}}
    );
    
    res.status(200).json({
      success: true,
      message: `Plantilla 'centromundox' enviada a ${numero}`,
      parametros: {
        usuario: nombre,
        hora: hora,
        serial: serial
      },
      data: resultado
    });
    
  } catch (error) {
    console.error("Error enviando plantilla centromundox:", error.response?.data || error);
    res.status(500).json({
      error: "Error al enviar plantilla",
      details: error.response?.data || error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
  console.log("URLs de videos configuradas:");
  Object.entries(VIDEOS_MODULOS).forEach(([modulo, url]) => {
    console.log(`  Módulo ${modulo}: ${url}`);
  });
});

// Cerrar conexión de MongoDB cuando se cierre el proceso
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  if (mongoClient) {
    try {
      await mongoClient.close();
      console.log('✅ Conexión de MongoDB cerrada');
    } catch (error) {
      console.error('❌ Error cerrando MongoDB:', error);
    }
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor (SIGTERM)...');
  if (mongoClient) {
    try {
      await mongoClient.close();
      console.log('✅ Conexión de MongoDB cerrada');
    } catch (error) {
      console.error('❌ Error cerrando MongoDB:', error);
    }
  }
  process.exit(0);
});
