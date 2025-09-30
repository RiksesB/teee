# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WhatsApp Business API integration project that delivers an interactive digital security awareness course focused on phishing protection. The application uses Express.js to handle webhooks from Meta's WhatsApp Business Platform and delivers educational content through an interactive quiz format.

## Development Commands

```bash
npm install  # Install all project dependencies
npm start    # Start the application (production mode)
npm run dev  # Start the application (development mode)
```

## Architecture and Key Components

### Core Technologies
- **Express.js**: Web server for handling WhatsApp webhooks
- **Axios**: HTTP client for making API calls to WhatsApp Business API  
- **MongoDB**: Database for storing user analytics and responses
- **dotenv**: Environment variable management
- **ES6 Modules**: Using `"type": "module"` in package.json

### Application Flow

1. **WhatsApp Integration**:
   - Webhook verification endpoint (`GET /webhook`)
   - Message processing endpoint (`POST /webhook`)
   - Handles text, interactive buttons, and template messages

2. **User Journey**:
   - User initiates with "prueba" command or template button
   - Video tutorial (from DigitalOcean CDN) → Interactive quiz (3 questions)
   - Progress through all 6 modules sequentially
   - Certificate generation → Satisfaction survey
   - Session cleanup

3. **State Management**:
   - `userSessions` Map tracks individual user progress
   - Session states: `en_prueba`, `enFormulario`, `enEncuesta`
   - State transitions are automatic based on user responses

### Key API Endpoints

#### WhatsApp Webhooks
- `GET /webhook` - Webhook verification
- `POST /webhook` - Message processing

#### Template Endpoints
- `POST /iniciar-prueba` - Start course for single/multiple users
- `POST /enviar-test` - Send test template
- `POST /enviar-iniciar-prueba` - Send iniciar_prueba template
- `POST /enviar-centromundox` - Send centromundox template with variables
- `POST /test-camila` - Send camille template

### Environment Variables Required

```env
WEBHOOK_VERIFY_TOKEN  # Token for webhook verification
API_TOKEN            # WhatsApp Business API access token
BUSINESS_PHONE       # Business phone number ID  
API_VERSION         # Facebook Graph API version (e.g., v21.0)
PORT                # Server port (defaults to 3000)
MOSTRAR_TIP_PRUEBA  # Control visibility of 'prueba' command tips (default: true)
DATABASE_URI        # MongoDB connection string for analytics storage
```

### Message Templates

The application uses WhatsApp Business message templates for initiating conversations outside the 24-hour window:
- `hello_world` - Default WhatsApp template (fallback)
- `test` - Test template (en_US)
- `iniciar_prueba` - Course initiation (es_AR)
- `centromundox` - Template with dynamic variables ({{1}}, {{2}}, {{3}})
- `camille` - Special test template

### Content Structure

#### Educational Modules (6 total)
Each module contains:
- Title and theme
- 3 multiple-choice questions (A, B, C options)
- Correct answer validation
- Specific feedback for each answer choice
- Progress tracking

#### Module Topics
1. Contraseñas Seguras (Secure Passwords)
2. Identificación de Correos Falsos (Identifying Fake Emails)
3. Deepfakes y Protección (Deepfakes and Protection)
4. Seguridad del Teléfono (Phone Security)
5. VirusTotal y Enlaces Seguros (Safe Links Verification)
6. Protección Avanzada (Advanced Protection)

### Database Analytics (MongoDB)

The application stores comprehensive analytics data in MongoDB with three main collections:

#### Collections Structure
1. **user_sessions** - Initial session data when users start the course
   - `numeroUsuario`: User's phone number
   - `evento`: Event type (e.g., "inicio_curso")
   - `iniciadoEn`: Start timestamp
   - `usarPlantilla`: Whether template message was used

2. **quiz_responses** - Detailed responses for each module
   - `numeroUsuario`: User's phone number
   - `modulo`: Module number (1-6)
   - `respuestasDetalladas`: Array of individual question responses
   - `resultadoModulo`: Module completion summary

3. **survey_responses** - Post-course satisfaction survey
   - `numeroUsuario`: User's phone number
   - `respuestasEncuesta`: Survey responses array
   - `resultadosModulos`: Complete course results summary
   - `fecha_completado`: Completion timestamp

#### Data Points Tracked
- Course initiation events and method (template vs direct)
- Individual question responses with timestamps
- Module completion rates and scores
- Overall course completion analytics
- User satisfaction survey responses
- Detailed performance metrics per module

### Error Handling

- Automatic fallback from interactive buttons to text messages
- Template message retry for 24-hour window violations
- Batch processing for multiple recipients (5 users at a time)
- Detailed error logging with specific error codes
- Graceful database connection handling (continues without DB if unavailable)

### Key Functions Reference

```javascript
// Message sending
enviarMensaje(numeroDestino, texto)
enviarVideo(numeroDestino, videoUrl, caption)
enviarImagen(numeroDestino, imagenPath, caption)
enviarBotonesOpciones(numeroDestino, texto, botones)
enviarMensajePlantilla(numeroDestino, nombrePlantilla, idioma, parametros)

// Course flow
iniciarPruebaDirecta(numeroUsuario, usarPlantilla)
iniciarFormulario(numeroUsuario)
procesarRespuestaFormulario(numeroUsuario, message)
iniciarEncuesta(numeroUsuario)
procesarRespuestaEncuesta(numeroUsuario, message)

// Database analytics
connectToDatabase()
guardarDatosUsuario(datosUsuario)
guardarRespuestasFormulario(numeroUsuario, modulo, respuestas)
guardarRespuestasEncuesta(numeroUsuario, respuestasEncuesta, resultadosModulos)

// Session management
userSessions.get(numeroUsuario)
userSessions.set(numeroUsuario, sessionData)
userSessions.delete(numeroUsuario)
```

### Important Considerations

- Videos are hosted on DigitalOcean CDN for reliable delivery
- WhatsApp limits interactive buttons to 3 per message
- Sessions are maintained in-memory (lost on restart)
- Module progression is strictly sequential
- All user responses are tracked for completion percentage
- MODULO_ACTUAL is a global variable that resets after course completion