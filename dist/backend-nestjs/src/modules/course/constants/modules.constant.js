"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENCUESTA_SATISFACCION = exports.MODULOS = exports.VIDEOS_MODULOS = void 0;
exports.VIDEOS_MODULOS = {
    1: 'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo1.mp4',
    2: 'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo2.mp4',
    3: 'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo3.mp4',
    4: 'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo4.mp4',
    5: 'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo5.mp4',
    6: 'https://curriculoms.nyc3.cdn.digitaloceanspaces.com/videos_niblion/modulo6.mp4',
};
exports.MODULOS = {
    1: {
        titulo: '✅ Módulo 1 – Contraseñas Seguras: Tu Primera Línea de Defensa',
        preguntas: [
            {
                numero: 1,
                pregunta: '¿Cuál de estas contraseñas es la más segura?',
                opciones: ['a) 123456', 'b) MiNombre2024', 'c) Tr3nSegura!2025'],
                respuesta_correcta: 'C',
                retroalimentacion: {
                    A: '❌ Muy fácil de adivinar. Es como dejar la puerta abierta.',
                    B: '❌ Aunque tiene letras y números, es predecible si alguien conoce tu nombre.',
                    C: '✅ ¡Muy bien! Una buena contraseña mezcla mayúsculas, minúsculas, números y símbolos.',
                },
            },
            {
                numero: 2,
                pregunta: 'Tu hermana te pide tu contraseña para ayudarte a revisar tu correo. ¿Qué deberías hacer?',
                opciones: [
                    'a) Se la doy, solo por esta vez',
                    'b) Le digo que no la puedo compartir',
                    'c) La cambio después de que ella la use',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ No importa quién lo pida: las contraseñas son personales.',
                    B: '✅ Correcto. Ni familiares ni amigos deben conocer tu contraseña.',
                    C: '❌ Cambiarla después no evita que otro la use mal mientras la tiene.',
                },
            },
            {
                numero: 3,
                pregunta: '¿Para qué sirve activar la verificación en dos pasos?',
                opciones: [
                    'a) Para que me envíen publicidad',
                    'b) Para tener un segundo nivel de seguridad',
                    'c) Para cambiar mi contraseña más rápido',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ No tiene nada que ver con publicidad.',
                    B: '✅ ¡Exacto! Es una capa extra que protege tu cuenta aunque roben tu contraseña.',
                    C: '❌ No facilita el cambio de contraseña, sino que aumenta la protección.',
                },
            },
        ],
    },
    2: {
        titulo: '📧 Módulo 2 – Cómo Identificar Correos Falsos (Phishing)',
        preguntas: [
            {
                numero: 1,
                pregunta: '¿Qué detalle te puede ayudar a descubrir que un correo es falso?',
                opciones: [
                    'a) Tiene errores de ortografía y frases mal escritas',
                    'b) Usa un logotipo bonito y colores oficiales',
                    'c) Empieza con un saludo amigable',
                    'd) Todos los anteriores',
                ],
                respuesta_correcta: 'D',
                retroalimentacion: {
                    A: '❌ Correcto parcialmente, pero los estafadores pueden usar logotipos oficiales y saludos amigables también.',
                    B: '❌ Los estafadores no solo usan errores, también copian logotipos y diseños profesionales.',
                    C: '❌ Un saludo amistoso no garantiza que el correo sea legítimo.',
                    D: '✅ ¡Exacto! Los errores de ortografía, logos bonitos y saludos amigables pueden ser señales de phishing. Siempre verifica el remitente y los enlaces.',
                },
            },
            {
                numero: 2,
                pregunta: 'Recibes un correo urgente del "banco" pidiendo tus datos. ¿Qué haces?',
                opciones: [
                    'a) Los envío de inmediato para evitar problemas',
                    'b) Llamo al banco directamente para verificar',
                    'c) Respondo el correo preguntando si es real',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ Nunca envíes datos sensibles por correo. Los bancos no los piden así.',
                    B: '✅ Perfecto. Siempre verifica por teléfono o en persona antes de dar información.',
                    C: '❌ Responder confirma que tu correo está activo y podrían enviarte más estafas.',
                },
            },
            {
                numero: 3,
                pregunta: '¿Qué es un enlace sospechoso en un correo?',
                opciones: [
                    'a) Uno que dice "haz clic aquí" sin más contexto',
                    'b) Uno con una URL extraña o con errores de escritura',
                    'c) Ambas opciones anteriores',
                ],
                respuesta_correcta: 'C',
                retroalimentacion: {
                    A: '❌ Sí, pero también las URLs raras son sospechosas.',
                    B: '❌ Correcto, pero "haz clic aquí" sin contexto también es una señal.',
                    C: '✅ ¡Muy bien! Enlaces vagos o con URLs extrañas son señales de peligro.',
                },
            },
        ],
    },
    3: {
        titulo: '🎭 Módulo 3 – Deepfakes y Cómo Protegerte',
        preguntas: [
            {
                numero: 1,
                pregunta: '¿Qué es un deepfake?',
                opciones: [
                    'a) Un video editado que parece real pero es falso',
                    'b) Una fotografía con filtros',
                    'c) Un mensaje de texto con emojis',
                ],
                respuesta_correcta: 'A',
                retroalimentacion: {
                    A: '✅ ¡Correcto! Los deepfakes usan inteligencia artificial para crear contenido falso.',
                    B: '❌ Los filtros no son deepfakes, aunque pueden engañar.',
                    C: '❌ Los emojis no tienen nada que ver con deepfakes.',
                },
            },
            {
                numero: 2,
                pregunta: 'Ves un video viral de alguien famoso diciendo algo raro. ¿Qué haces?',
                opciones: [
                    'a) Lo comparto de inmediato porque es impactante',
                    'b) Verifico en fuentes confiables antes de compartir',
                    'c) Lo creo sin dudar porque está en internet',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ Compartir sin verificar puede propagar desinformación.',
                    B: '✅ ¡Muy bien! Siempre verifica antes de compartir.',
                    C: '❌ No todo en internet es verdad. Verifica la fuente.',
                },
            },
            {
                numero: 3,
                pregunta: '¿Cómo puedes protegerte de los deepfakes?',
                opciones: [
                    'a) No compartir contenido sin verificar',
                    'b) Revisar si el video o audio tiene detalles raros',
                    'c) Ambas opciones anteriores',
                ],
                respuesta_correcta: 'C',
                retroalimentacion: {
                    A: '❌ Sí, pero también debes fijarte en detalles raros.',
                    B: '❌ Correcto, pero no compartir sin verificar también es clave.',
                    C: '✅ ¡Excelente! Verificar y no compartir sin confirmar son tus mejores defensas.',
                },
            },
        ],
    },
    4: {
        titulo: '📱 Módulo 4 – Seguridad del Teléfono: Protege Tu Dispositivo',
        preguntas: [
            {
                numero: 1,
                pregunta: '¿Qué deberías hacer para proteger tu teléfono?',
                opciones: [
                    'a) Ponerle un código o huella dactilar',
                    'b) Descargar aplicaciones de cualquier sitio',
                    'c) Dejarlo desbloqueado para acceder rápido',
                ],
                respuesta_correcta: 'A',
                retroalimentacion: {
                    A: '✅ ¡Perfecto! Un código o huella dactilar protege tu información.',
                    B: '❌ Solo descarga apps de tiendas oficiales como Google Play o App Store.',
                    C: '❌ Dejar el teléfono desbloqueado es un riesgo enorme.',
                },
            },
            {
                numero: 2,
                pregunta: 'Una app que descargaste pide permisos para acceder a tu cámara, micrófono y contactos. ¿Qué haces?',
                opciones: [
                    'a) Los acepto todos sin leer',
                    'b) Leo por qué los necesita y los acepto solo si tiene sentido',
                    'c) Los rechazo todos aunque la app no funcione',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ Aceptar todos los permisos sin leer puede poner en riesgo tu privacidad.',
                    B: '✅ ¡Correcto! Solo acepta permisos que la app realmente necesita.',
                    C: '❌ Rechazar todo puede hacer que la app no funcione, pero debes revisar cada permiso.',
                },
            },
            {
                numero: 3,
                pregunta: '¿Por qué es importante mantener tu teléfono actualizado?',
                opciones: [
                    'a) Para tener las últimas funciones',
                    'b) Para corregir errores de seguridad',
                    'c) Ambas opciones anteriores',
                ],
                respuesta_correcta: 'C',
                retroalimentacion: {
                    A: '❌ Sí, pero las actualizaciones también corrigen problemas de seguridad.',
                    B: '❌ Correcto, pero también traen nuevas funciones.',
                    C: '✅ ¡Muy bien! Las actualizaciones mejoran funciones y seguridad.',
                },
            },
        ],
    },
    5: {
        titulo: '🔍 Módulo 5 – VirusTotal y Enlaces Seguros',
        preguntas: [
            {
                numero: 1,
                pregunta: '¿Qué es VirusTotal?',
                opciones: [
                    'a) Un antivirus que instalas en tu teléfono',
                    'b) Una herramienta online para verificar si un enlace es seguro',
                    'c) Una app para limpiar tu teléfono',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ No es un antivirus para instalar, es una herramienta web.',
                    B: '✅ ¡Correcto! VirusTotal analiza enlaces y archivos para detectar amenazas.',
                    C: '❌ No limpia tu teléfono, solo analiza enlaces y archivos.',
                },
            },
            {
                numero: 2,
                pregunta: 'Recibes un enlace por WhatsApp de un desconocido. ¿Qué haces?',
                opciones: [
                    'a) Lo abro de inmediato para ver qué es',
                    'b) Lo verifico con VirusTotal antes de abrirlo',
                    'c) Lo borro sin más',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ Abrirlo sin verificar puede infectar tu dispositivo.',
                    B: '✅ ¡Muy bien! Verificar con VirusTotal es la mejor opción.',
                    C: '❌ Borrarlo es seguro, pero verificar te ayuda a aprender qué tipo de amenaza era.',
                },
            },
            {
                numero: 3,
                pregunta: '¿Cómo saber si un enlace es seguro sin VirusTotal?',
                opciones: [
                    'a) Ver si la URL empieza con "https://"',
                    'b) Verificar que la dirección del sitio se vea correcta',
                    'c) Ambas opciones anteriores',
                ],
                respuesta_correcta: 'C',
                retroalimentacion: {
                    A: '❌ Sí, pero también debes revisar la URL completa.',
                    B: '❌ Correcto, pero "https://" también es importante.',
                    C: '✅ ¡Excelente! Ambas señales ayudan a identificar enlaces seguros.',
                },
            },
        ],
    },
    6: {
        titulo: '🛡️ Módulo 6 – Protección Avanzada: Sé un Experto',
        preguntas: [
            {
                numero: 1,
                pregunta: '¿Qué es la ingeniería social?',
                opciones: [
                    'a) Una técnica para hackear computadoras con programas',
                    'b) Manipular a las personas para que den información confidencial',
                    'c) Crear redes sociales falsas',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ No es hackear con programas, sino manipular personas.',
                    B: '✅ ¡Correcto! La ingeniería social engaña a las personas para robar información.',
                    C: '❌ No se trata de crear redes, sino de manipular a las personas.',
                },
            },
            {
                numero: 2,
                pregunta: '¿Qué deberías hacer si recibes un mensaje sospechoso?',
                opciones: [
                    'a) Responderlo para confirmar si es real',
                    'b) Bloquearlo y reportarlo',
                    'c) Compartirlo con amigos para que opinen',
                ],
                respuesta_correcta: 'B',
                retroalimentacion: {
                    A: '❌ Responder confirma que tu número está activo.',
                    B: '✅ ¡Perfecto! Bloquear y reportar es la mejor acción.',
                    C: '❌ Compartirlo puede poner en riesgo a tus amigos.',
                },
            },
            {
                numero: 3,
                pregunta: '¿Cómo puedes ser un defensor de la seguridad digital?',
                opciones: [
                    'a) Compartiendo lo que aprendiste con otros',
                    'b) Verificando información antes de compartirla',
                    'c) Ambas opciones anteriores',
                ],
                respuesta_correcta: 'C',
                retroalimentacion: {
                    A: '❌ Sí, pero también debes verificar información antes de compartirla.',
                    B: '❌ Correcto, pero compartir conocimiento también ayuda.',
                    C: '✅ ¡Excelente! Educar y verificar te convierten en un defensor digital.',
                },
            },
        ],
    },
};
exports.ENCUESTA_SATISFACCION = [
    {
        numero: 1,
        pregunta: '¿Cómo calificarías la calidad del contenido del curso?',
        opciones: [
            'a) Excelente',
            'b) Buena',
            'c) Regular',
            'd) Necesita mejorar',
        ],
    },
    {
        numero: 2,
        pregunta: '¿Te sientes más preparado para identificar amenazas digitales después de este curso?',
        opciones: [
            'a) Sí, mucho más preparado',
            'b) Un poco más preparado',
            'c) Igual que antes',
            'd) No me siento preparado',
        ],
    },
    {
        numero: 3,
        pregunta: '¿Recomendarías este curso a un amigo o familiar?',
        opciones: [
            'a) Sí, definitivamente',
            'b) Probablemente sí',
            'c) No estoy seguro',
            'd) No lo recomendaría',
        ],
    },
];
//# sourceMappingURL=modules.constant.js.map