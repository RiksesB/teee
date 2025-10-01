# Diagrama Entidad-Relación ASCII - Niblion Chatbot Database

```
                              NIBLION CHATBOT - MODELO ENTIDAD RELACIÓN
                                        MongoDB Database Schema
    
    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                    ENTIDADES Y RELACIONES                                                    │
    └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                          ┌─────────────────────┐
                                          │    USER_SESSIONS    │
                                          │═════════════════════│
                                          │ 🔑 user_id (PK)     │ ◄─────────┐
                                          │    session_data     │           │
                                          │    ├─ name          │           │
                                          │    ├─ phone         │           │
                                          │    └─ preferences   │           │
                                          │    created_at       │           │
                                          │    updated_at       │           │
                                          └─────────┬───────────┘           │
                                                    │                       │
                                                    │ 1:1                   │
                                                    │ TIENE                 │
                                                    ▼                       │
                                          ┌─────────────────────┐           │
                                          │  ACTIVE_SESSIONS    │           │
                                          │═════════════════════│           │
                                          │ 🔑 user_id (PK,FK)  │ ──────────┘
                                          │    module_id        │
                                          │    current_question │
                                          │    start_time       │
                                          │    last_activity    │
                                          │    score            │
                                          │    status           │
                                          │    [active/complete]│
                                          └─────────┬───────────┘
                                                    │
                                                    │ 1:N
                                                    │ GENERA
                                                    ▼
                                          ┌─────────────────────┐
                                          │   QUIZ_RESPONSES    │
                                          │═════════════════════│
                                          │ 🔑 _id (PK)         │
                                          │ 🔗 user_id (FK)     │ ◄─┐
                                          │    module_id        │   │
                                          │    question_id      │   │
                                          │    answer           │   │
                                          │    is_correct       │   │
                                          │    timestamp        │   │
                                          └─────────────────────┘   │
                                                    ▲               │
                                                    │               │
                                                    │ N:1           │ N:1
                                                    │ PERTENECE     │ RESPONDE
                                                    │               │
                                          ┌─────────────────────┐   │
                                          │  SURVEY_RESPONSES   │   │
                                          │═════════════════════│   │
                                          │ 🔑 _id (PK)         │   │
                                          │ 🔗 user_id (FK)     │ ──┘
                                          │    survey_id        │
                                          │    responses[]      │
                                          │    ├─ question      │
                                          │    ├─ answer        │
                                          │    └─ rating        │
                                          │    completed_at     │
                                          │    metadata         │
                                          └─────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                     CARDINALIDADES                                                           │
    └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    USER_SESSIONS (1) ←→ (1) ACTIVE_SESSIONS    │ Un usuario tiene máximo una sesión activa
                                                │
    USER_SESSIONS (1) ←→ (N) QUIZ_RESPONSES     │ Un usuario puede dar múltiples respuestas
                                                │
    USER_SESSIONS (1) ←→ (N) SURVEY_RESPONSES   │ Un usuario puede completar múltiples encuestas
                                                │
    ACTIVE_SESSIONS (1) ←→ (N) QUIZ_RESPONSES   │ Una sesión activa genera múltiples respuestas

    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                   TIPOS DE DATOS                                                             │
    └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    🔑 = Clave Primaria (Primary Key)           String    = Texto variable
    🔗 = Clave Foránea (Foreign Key)            Number    = Entero o decimal  
    ═══ = Separador de título                  Date      = Timestamp UTC
    ┌─┐ = Bordes de entidad                    Boolean   = true/false
    ▲▼  = Dirección de relación                Object    = Documento embebido
    │   = Línea de relación                    Array[]   = Lista de elementos
                                               ObjectId  = Identificador MongoDB

    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                    ÍNDICES OPTIMIZADOS                                                       │
    └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    📊 ACTIVE_SESSIONS:
    ├─ user_id (unique) ⚡ Búsqueda rápida por usuario
    ├─ {status, last_activity} ⚡ Cleanup de sesiones inactivas  
    └─ {module_id, status} ⚡ Reportes por módulo

    📊 USER_SESSIONS:
    ├─ user_id (unique) ⚡ Identificación única
    ├─ created_at ⚡ Ordenamiento temporal
    └─ session_data.phone ⚡ Búsqueda por teléfono

    📊 QUIZ_RESPONSES:
    ├─ {user_id, timestamp} ⚡ Historial de respuestas
    ├─ {module_id, question_id} ⚡ Analytics por pregunta
    └─ {is_correct, timestamp} ⚡ Métricas de rendimiento

    📊 SURVEY_RESPONSES:
    ├─ {user_id, completed_at} ⚡ Encuestas por usuario
    └─ {survey_id, completed_at} ⚡ Análisis de satisfacción

    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                                 FLUJO DE DATOS PRINCIPAL                                                     │
    └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    📱 WhatsApp User                    🤖 Chatbot                     💾 Database
         │                                │                               │
         │ 1. Mensaje inicial             │                               │
         ├─────────────────────────────►  │                               │
         │                                │ 2. Crear/obtener USER_SESSION │
         │                                ├─────────────────────────────► │
         │                                │ 3. Crear ACTIVE_SESSION       │
         │                                ├─────────────────────────────► │
         │ 4. Pregunta del quiz           │                               │
         │ ◄─────────────────────────────┤                               │
         │ 5. Respuesta                   │                               │
         ├─────────────────────────────►  │                               │
         │                                │ 6. Guardar QUIZ_RESPONSE      │
         │                                ├─────────────────────────────► │
         │                                │ 7. Actualizar ACTIVE_SESSION  │
         │                                ├─────────────────────────────► │
         │ 8. Siguiente pregunta/resultado│                               │
         │ ◄─────────────────────────────┤                               │
         │                                │ 9. Encuesta final (opcional)  │
         │                                ├─────────────────────────────► │
         │                                │    SURVEY_RESPONSE            │

    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
    │                               REGLAS DE NEGOCIO                                                              │
    └─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

    ✅ Un usuario solo puede tener UNA sesión activa a la vez
    ✅ Las respuestas de quiz se guardan individualmente para análisis
    ✅ Las sesiones inactivas se marcan como 'abandoned' después de 30 min
    ✅ Los usuarios pueden retomar sesiones abandonadas
    ✅ Las encuestas son opcionales y se envían al completar un módulo
    ✅ Todas las fechas se almacenan en UTC
    ✅ Los scores se calculan en tiempo real durante la sesión