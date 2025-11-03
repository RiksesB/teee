# Soluciones Propuestas

## Problema 1: Solapamiento de Sesiones

### Causa Raíz
Los `setTimeout` capturan el estado de la sesión en closures, pero la sesión es mutable. Si llegan múltiples mensajes del mismo usuario, se crean race conditions.

**Ejemplo del problema (línea 1041):**
```javascript
setTimeout(async () => {
  await enviarPreguntaConBotones(numeroUsuario, sesion.preguntaActual);
  // ❌ sesion.preguntaActual puede haber cambiado
});
```

### Solución 1: Cola de Procesamiento por Usuario (SIN dependencias)

**Ventajas:**
- No requiere Redis ni dependencias adicionales
- Fácil de implementar
- Procesamiento secuencial garantizado por usuario
- Sesiones aisladas completamente

**Implementación:**
```javascript
// Cola de mensajes pendientes por usuario
const messageQueues = new Map();
const processingUsers = new Set();

async function procesarMensajeConCola(numeroUsuario, handler) {
  // Agregar a la cola del usuario
  if (!messageQueues.has(numeroUsuario)) {
    messageQueues.set(numeroUsuario, []);
  }
  messageQueues.get(numeroUsuario).push(handler);

  // Si ya se está procesando, salir (el handler se ejecutará después)
  if (processingUsers.has(numeroUsuario)) {
    return;
  }

  // Marcar como procesando
  processingUsers.add(numeroUsuario);

  // Procesar cola secuencialmente
  while (messageQueues.get(numeroUsuario).length > 0) {
    const nextHandler = messageQueues.get(numeroUsuario).shift();
    try {
      await nextHandler();
    } catch (error) {
      console.error(`Error procesando mensaje para ${numeroUsuario}:`, error);
    }
  }

  // Limpiar
  processingUsers.delete(numeroUsuario);
  messageQueues.delete(numeroUsuario);
}
```

**Uso:**
```javascript
// En lugar de ejecutar directamente:
await procesarRespuestaFormulario(numeroUsuario, message);

// Usar la cola:
await procesarMensajeConCola(numeroUsuario, async () => {
  await procesarRespuestaFormulario(numeroUsuario, message);
});
```

### Solución 2: Redis con Locks Distribuidos

**Ventajas:**
- Sesiones persistentes (sobreviven reinicios)
- Escalable horizontalmente (múltiples instancias)
- Locks distribuidos
- Mejor para producción

**Requiere:**
```bash
npm install redis ioredis
```

**Implementación:**
```javascript
import Redis from 'ioredis';
import Redlock from 'redlock';

const redis = new Redis(process.env.REDIS_URL);
const redlock = new Redlock([redis]);

async function procesarConLock(numeroUsuario, handler) {
  const lock = await redlock.acquire([`lock:${numeroUsuario}`], 5000);
  try {
    // Leer sesión de Redis
    const sesionStr = await redis.get(`session:${numeroUsuario}`);
    const sesion = sesionStr ? JSON.parse(sesionStr) : null;

    // Ejecutar handler
    const resultado = await handler(sesion);

    // Guardar sesión actualizada
    if (resultado) {
      await redis.setex(`session:${numeroUsuario}`, 3600, JSON.stringify(resultado));
    }

    return resultado;
  } finally {
    await lock.release();
  }
}
```

---

## Problema 2: Soporte para 4 Opciones (A, B, C, D)

WhatsApp limita botones interactivos a 3. Para 4+ opciones usar **List Messages**.

### Solución: Mensajes de Lista (List Messages)

**Soporta hasta 10 opciones:**

```javascript
async function enviarPreguntaConLista(numeroUsuario, indicePregunta) {
  const sesion = obtenerSesionUsuario(numeroUsuario);
  const moduloUsuario = sesion.modulo;
  const pregunta = modulos[moduloUsuario].preguntas[indicePregunta];

  // Crear secciones para la lista
  const rows = pregunta.opciones.map((opcion, index) => {
    const letra = String.fromCharCode(65 + index); // A, B, C, D...
    return {
      id: `respuesta_${letra.toLowerCase()}_${indicePregunta}`,
      title: letra,
      description: opcion.substring(3) // Quitar "a) " del texto
    };
  });

  await axios({
    method: "POST",
    url: `https://graph.facebook.com/${API_VERSION}/${BUSINESS_PHONE}/messages`,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
    data: {
      messaging_product: "whatsapp",
      to: numeroUsuario,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: `Pregunta ${pregunta.numero}`
        },
        body: {
          text: pregunta.pregunta
        },
        footer: {
          text: "Selecciona tu respuesta"
        },
        action: {
          button: "Ver opciones",
          sections: [{
            title: "Respuestas",
            rows: rows
          }]
        }
      }
    }
  });
}
```

### Fallback automático:
```javascript
try {
  // Intentar con lista (4+ opciones)
  if (pregunta.opciones.length > 3) {
    await enviarPreguntaConLista(numeroUsuario, indicePregunta);
  } else {
    // Usar botones (3 opciones)
    await enviarPreguntaConBotones(numeroUsuario, indicePregunta);
  }
} catch (error) {
  // Fallback a texto plano
  await enviarPreguntaTextoPlano(numeroUsuario, indicePregunta);
}
```

---

## Recomendación

**Para empezar:** Solución 1 (Cola de procesamiento) + List Messages
- Sin dependencias adicionales
- Resuelve el 90% de los problemas
- Fácil de implementar

**Para producción a escala:** Migrar a Redis después
- Cuando tengas >100 usuarios simultáneos
- Si necesitas múltiples servidores
- Para persistencia de sesiones
