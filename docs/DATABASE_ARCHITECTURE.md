# 🗄️ Diagrama Visual ASCII de Base de Datos MongoDB - Niblion

## 🏗️ Arquitectura Visual Completa de la Base de Datos

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                    🍃 MONGODB - NIBLION_ANALYTICS DATABASE 🍃                        ║
║                         Sistema de Concientización en Seguridad                     ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

                               🌊 FLUJO DE DATOS PRINCIPAL
    
    👤 Usuario          📱 WhatsApp          🎯 Backend          🗄️ MongoDB
       │                   │                   │                  │
       │─── "Hola" ────────►│                   │                  │
       │                   │─── Webhook ──────►│                  │
       │                   │                   │─── Create ─────►│ 📋 user_sessions
       │                   │                   │                  │
       │                   │                   │─── Store ──────►│ 🗂️ active_sessions
       │◄── Módulo 1 ──────┤◄── Response ─────┤                  │
       │                   │                   │                  │
       │─── "A" ───────────►│                   │                  │
       │                   │─── Answer ───────►│                  │
       │                   │                   │─── Save ───────►│ 📝 quiz_responses
       │                   │                   │                  │
       │◄── "¡Correcto!" ──┤◄── Feedback ─────┤                  │
       │                   │                   │                  │
       │◄── Encuesta ──────┤◄── Survey ───────┤                  │
       │                   │                   │                  │
       │─── Respuestas ────►│                   │                  │
       │                   │─── Completed ────►│                  │
       │                   │                   │─── Final ──────►│ 📊 survey_responses
       │                   │                   │                  │
       │◄── Certificado ───┤◄── Certificate ──┤                  │

                              ⏱️ Tiempo Total: ~25-30 minutos
```

## 🗂️ Arquitectura Visual de Colecciones

```
                        ┌─────────────────────────────────────────────────────┐
                        │            🍃 MONGODB DATABASE                      │
                        │               niblion_analytics                     │
                        └─────────────────────────────────────────────────────┘
                                                │
                          ┌─────────────────────┼─────────────────────┐
                          │                     │                     │
                          ▼                     ▼                     ▼
        ┌─────────────────────────────┐ ┌─────────────────────────────┐ ┌─────────────────────────────┐
        │     📋 user_sessions        │ │    🗂️ active_sessions       │ │    📝 quiz_responses        │
        │      (Historial)            │ │      (Temporal)             │ │     (Evaluaciones)          │
        │                             │ │                             │ │                             │
        │ 🔑 numeroUsuario            │ │ 🔑 phoneNumber              │ │ 🔑 numeroUsuario            │
        │ 📅 timestamp                │ │ 🎯 state                    │ │ 📖 modulo                   │
        │ 🎯 evento                   │ │ 📖 currentModule            │ │ 📝 respuestas[]             │
        │ 📄 usarPlantilla            │ │ ❓ currentQuestion          │ │ 🏆 resultadoModulo          │
        │ ⏰ iniciadoEn               │ │ 📝 answers[]                │ │ ⏰ timestamp                │
        │ 📋 metadata                 │ │ 🏆 moduleResults[]          │ │ 📊 metadata                 │
        │                             │ │ 📊 surveyResponses[]        │ │                             │
        │ 📊 ~1000 docs/mes           │ │ ⚡ ~50-200 docs activos     │ │ 📊 ~6000 docs/mes           │
        └─────────────────────────────┘ └─────────────────────────────┘ └─────────────────────────────┘
                          │                                                           │
                          │                     ┌─────────────────────────────┐     │
                          │                     │   📊 survey_responses       │     │
                          │                     │    (Satisfacción)           │     │
                          │                     │                             │     │
                          │                     │ 🔑 numeroUsuario            │     │
                          └─────────────────────┤ 📋 respuestasEncuesta[]     │◄────┘
                                                │ 🏆 resultadosModulos[]      │
                                                │ 📈 resumenGeneral           │
                                                │ ⏰ timestamp                │
                                                │ 🎯 fecha_completado         │
                                                │                             │
                                                │ 📊 ~800 docs/mes            │
                                                └─────────────────────────────┘
```

## 🔗 Diagrama de Relaciones y Flujo de Datos

```
📱 USUARIO: "573001234567"
│
├─ FASE 1: INICIO DE CURSO ──────────────────────────────────────────────────────────┐
│  │                                                                                  │
│  └─► 📋 user_sessions                                                               │
│      ┌─────────────────────────────────────────────────────────────────────────────┤
│      │ {                                                                           │
│      │   "numeroUsuario": "573001234567",                                         │
│      │   "evento": "inicio_curso",                                                 │
│      │   "timestamp": "2025-10-01T10:00:00Z",                                     │
│      │   "usarPlantilla": true                                                     │
│      │ }                                                                           │
│      └─────────────────────────────────────────────────────────────────────────────┘
│
├─ FASE 2: SESIÓN ACTIVA ────────────────────────────────────────────────────────────┐
│  │                                                                                  │
│  └─► 🗂️ active_sessions                                                            │
│      ┌─────────────────────────────────────────────────────────────────────────────┤
│      │ {                                                                           │
│      │   "phoneNumber": "573001234567",                                           │
│      │   "state": "answering_quiz",              ◄── Estados Posibles:            │
│      │   "currentModule": 3,                     ├── "idle"                       │
│      │   "currentQuestion": 2,                   ├── "watching_video"            │
│      │   "answers": [                            ├── "answering_quiz"            │
│      │     {                                     ├── "in_survey"                 │
│      │       "questionNumber": 1,                └── "completed"                 │
│      │       "selectedOption": "B",                                               │
│      │       "isCorrect": true                                                    │
│      │     }                                                                      │
│      │   ],                                                                       │
│      │   "lastActivity": "2025-10-01T10:15:00Z"                                  │
│      │ }                                                                           │
│      └─────────────────────────────────────────────────────────────────────────────┘
│                                │
│                                │ TTL: 30 minutos
│                                ▼
│                        💾 CACHE STRATEGY
│                        ┌─────────────────────────────────┐
│                        │ 🧠 In-Memory Map                │
│                        │ ┌─────────────────────────────┐ │
│                        │ │ "573001234567" ──► Session  │ │
│                        │ │ "573002345678" ──► Session  │ │
│                        │ │ "573003456789" ──► Session  │ │
│                        │ └─────────────────────────────┘ │
│                        │ • Acceso O(1)                   │
│                        │ • Auto cleanup                  │
│                        │ • Fallback a MongoDB           │
│                        └─────────────────────────────────┘
│
├─ FASE 3: COMPLETAR MÓDULOS (x6) ──────────────────────────────────────────────────┐
│  │                                                                                  │
│  └─► 📝 quiz_responses (Por cada módulo)                                           │
│      ┌─────────────────────────────────────────────────────────────────────────────┤
│      │ Módulo 1: Seguridad Básica                                                 │
│      │ {                                                                           │
│      │   "numeroUsuario": "573001234567",                                         │
│      │   "modulo": 1,                                                              │
│      │   "respuestas": [                                                           │
│      │     {                                                                       │
│      │       "pregunta": 1,                                                        │
│      │       "respuesta_usuario": "B",                                            │
│      │       "respuesta_correcta": "B",                                           │
│      │       "es_correcta": true,                                                  │
│      │       "tiempo_respuesta": 15                                               │
│      │     }                                                                       │
│      │     // ... 9 preguntas más                                                 │
│      │   ],                                                                        │
│      │   "resultadoModulo": {                                                      │
│      │     "puntuacion": 8,                                                        │
│      │     "porcentaje": 80,                                                       │
│      │     "aprobado": true                                                        │
│      │   }                                                                         │
│      │ }                                                                           │
│      └─────────────────────────────────────────────────────────────────────────────┤
│      │ Módulo 2: Phishing              ┌─► Módulo 3: Contraseñas                  │
│      │ Módulo 4: Redes Sociales        │   Módulo 5: Navegación Segura            │
│      │ Módulo 6: Dispositivos Móviles  └─► (Misma estructura)                     │
│      └─────────────────────────────────────────────────────────────────────────────┘
│
└─ FASE 4: ENCUESTA FINAL ──────────────────────────────────────────────────────────┐
   │                                                                                  │
   └─► 📊 survey_responses                                                           │
       ┌─────────────────────────────────────────────────────────────────────────────┤
       │ {                                                                           │
       │   "numeroUsuario": "573001234567",                                         │
       │   "respuestasEncuesta": [                                                   │
       │     {                                                                       │
       │       "pregunta_id": 1,                                                     │
       │       "pregunta": "¿Cómo calificarías el curso?",                         │
       │       "respuesta": "Excelente",                                            │
       │       "escala": 5                                                          │
       │     }                                                                       │
       │   ],                                                                        │
       │   "resultadosModulos": [                                                    │
       │     { "modulo": 1, "puntuacion": 8, "porcentaje": 80 },                   │
       │     { "modulo": 2, "puntuacion": 9, "porcentaje": 90 },                   │
       │     // ... todos los módulos                                                │
       │   ],                                                                        │
       │   "resumenGeneral": {                                                       │
       │     "puntuacion_total": 87,                                                 │
       │     "curso_completo": true,                                                 │
       │     "certificado_otorgado": true                                            │
       │   }                                                                         │
       │ }                                                                           │
       └─────────────────────────────────────────────────────────────────────────────┘
```

## 🔍 Índices y Optimización Visual

```
                           🔍 ESTRATEGIA DE ÍNDICES MONGODB
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                            📋 user_sessions                                         │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │ 🔑 Primary: { "_id": 1 }                                                            │
    │ 📱 Index: { "numeroUsuario": 1 }          ◄── Buscar por teléfono                  │
    │ ⏰ Index: { "timestamp": 1 }               ◄── Ordenar cronológicamente           │
    │ 🎯 Index: { "evento": 1, "timestamp": 1 } ◄── Consultas por tipo + tiempo         │
    └─────────────────────────────────────────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                            🗂️ active_sessions                                       │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │ 🔑 Primary: { "_id": 1 }                                                            │
    │ 📱 Unique: { "phoneNumber": 1 }           ◄── Una sesión por usuario               │
    │ 🕐 TTL: { "lastActivity": 1 }             ◄── Auto-cleanup (30 min)               │
    │ 🎯 Index: { "state": 1 }                  ◄── Estadísticas por estado             │
    │ 📖 Index: { "currentModule": 1 }          ◄── Distribución por módulo             │
    │ 🔍 Compound: { "state": 1, "currentModule": 1, "lastActivity": -1 }               │
    └─────────────────────────────────────────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                            📝 quiz_responses                                        │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │ 🔑 Primary: { "_id": 1 }                                                            │
    │ 📱 Index: { "numeroUsuario": 1 }          ◄── Respuestas por usuario               │
    │ 📖 Index: { "modulo": 1 }                 ◄── Analytics por módulo                 │
    │ ⏰ Index: { "timestamp": 1 }               ◄── Tendencias temporales               │
    │ 🎯 Unique: { "numeroUsuario": 1, "modulo": 1 } ◄── Un intento por módulo          │
    │ 🔍 Compound: { "numeroUsuario": 1, "timestamp": -1, "modulo": 1 }                 │
    └─────────────────────────────────────────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                            📊 survey_responses                                      │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │ 🔑 Primary: { "_id": 1 }                                                            │
    │ 📱 Unique: { "numeroUsuario": 1 }         ◄── Una encuesta por usuario             │
    │ ⏰ Index: { "timestamp": 1 }               ◄── Ordenar por fecha                   │
    │ 📅 Index: { "fecha_completado": 1 }       ◄── Filtrar por finalización            │
    │ 🏆 Index: { "resumenGeneral.puntuacion_total": -1 } ◄── Ranking de puntuaciones   │
    │ 🔍 Compound: { "fecha_completado": -1, "resumenGeneral.puntuacion_total": -1 }    │
    └─────────────────────────────────────────────────────────────────────────────────────┘
```

## 📊 Consultas y Agregaciones Visuales

```
                        🔍 PIPELINE DE AGREGACIONES PRINCIPALES
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                          📈 ESTADÍSTICAS EN TIEMPO REAL                            │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │                                                                                     │
    │  🗂️ active_sessions                                                                │
    │       │                                                                             │
    │       └─► $group: { _id: "$state", count: { $sum: 1 } }                           │
    │               │                                                                     │
    │               ▼                                                                     │
    │          ┌─────────────────────────────────────────────────────────────────────┐   │
    │          │ Resultado:                                                          │   │
    │          │ { "_id": "answering_quiz", "count": 15 }                           │   │
    │          │ { "_id": "watching_video", "count": 8 }                            │   │
    │          │ { "_id": "idle", "count": 5 }                                      │   │
    │          └─────────────────────────────────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                       🏆 ANÁLISIS DE COMPLETACIÓN POR MÓDULO                       │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │                                                                                     │
    │  📝 quiz_responses                                                                  │
    │       │                                                                             │
    │       └─► $group: {                                                                │
    │             _id: "$modulo",                                                         │
    │             total_usuarios: { $sum: 1 },                                           │
    │             usuarios_aprobados: {                                                   │
    │               $sum: { $cond: [{ $gte: ["$resultadoModulo.porcentaje", 70] }, 1, 0] }│
    │             },                                                                      │
    │             puntuacion_promedio: { $avg: "$resultadoModulo.porcentaje" }           │
    │           }                                                                         │
    │               │                                                                     │
    │               ▼                                                                     │
    │          ┌─────────────────────────────────────────────────────────────────────┐   │
    │          │ Resultado:                                                          │   │
    │          │ { "_id": 1, "total": 120, "aprobados": 105, "tasa": 87.5% }        │   │
    │          │ { "_id": 2, "total": 98, "aprobados": 89, "tasa": 90.8% }          │   │
    │          │ { "_id": 3, "total": 85, "aprobados": 76, "tasa": 89.4% }          │   │
    │          └─────────────────────────────────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                         🚀 EMBUDO DE CONVERSIÓN (FUNNEL)                           │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │                                                                                     │
    │  📋 user_sessions                                                                   │
    │       │                                                                             │
    │       └─► $lookup: quiz_responses + survey_responses                               │
    │               │                                                                     │
    │               └─► $group: {                                                        │
    │                     usuarios_iniciaron: { $sum: 1 },                              │
    │                     usuarios_1_modulo: { $sum: { $cond: [...] } },                │
    │                     usuarios_curso_completo: { $sum: { $cond: [...] } }           │
    │                   }                                                                 │
    │                       │                                                             │
    │                       ▼                                                             │
    │              ┌─────────────────────────────────────────────────────────────────┐   │
    │              │ 👥 Iniciaron: 1000    ┌─► 📖 1+ Módulo: 850  (85%)              │   │
    │              │                       │                                         │   │
    │              │                       └─► 🎯 3+ Módulos: 720  (72%)             │   │
    │              │                                                                 │   │
    │              │                       ┌─► 🏆 Curso Completo: 600  (60%)         │   │
    │              │                       │                                         │   │
    │              │                       └─► 📊 Con Encuesta: 480  (48%)           │   │
    │              └─────────────────────────────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────────────────────────────────────────┘
```

## ⚡ Performance y Monitoreo Visual

```
                        📊 MÉTRICAS DE PERFORMANCE EN TIEMPO REAL
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                                🎯 KPIs PRINCIPALES                                  │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │                                                                                     │
    │  📈 VOLUMEN DE DATOS                        ⚡ PERFORMANCE                          │
    │  ┌─────────────────────────────┐           ┌─────────────────────────────────────┐ │
    │  │ 📋 user_sessions            │           │ 🕐 Query Time                       │ │
    │  │ ├─ ~1000 docs/mes           │           │ ├─ Find: <5ms                      │ │
    │  │ ├─ ~50MB/mes                │           │ ├─ Aggregate: <50ms                │ │
    │  │ └─ Retention: 90 días       │           │ └─ Index scan: <1ms                │ │
    │  │                             │           │                                     │ │
    │  │ 🗂️ active_sessions          │           │ 💾 Cache Performance               │ │
    │  │ ├─ ~50-200 docs activos     │           │ ├─ Hit ratio: >90%                 │ │
    │  │ ├─ ~5MB memoria             │           │ ├─ Miss penalty: ~20ms             │ │
    │  │ └─ TTL: 30 minutos          │           │ └─ Cleanup: cada 5min              │ │
    │  │                             │           │                                     │ │
    │  │ 📝 quiz_responses           │           │ 🔍 Index Efficiency                │ │
    │  │ ├─ ~6000 docs/mes           │           │ ├─ Usage: >95%                     │ │
    │  │ ├─ ~300MB/mes               │           │ ├─ Size: ~50MB                     │ │
    │  │ └─ Growth: ~50MB/mes        │           │ └─ Selectivity: High               │ │
    │  │                             │           │                                     │ │
    │  │ 📊 survey_responses         │           │ 🌐 Operations/sec                  │ │
    │  │ ├─ ~800 docs/mes            │           │ ├─ Reads: ~100/sec                 │ │
    │  │ ├─ ~100MB/mes               │           │ ├─ Writes: ~20/sec                 │ │
    │  │ └─ Completion: ~80%         │           │ └─ Aggregates: ~5/sec              │ │
    │  └─────────────────────────────┘           └─────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────────────────────────────────────┘
    
    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                            🔄 ESTRATEGIA DE BACKUP Y RECOVERY                       │
    ├─────────────────────────────────────────────────────────────────────────────────────┤
    │                                                                                     │
    │  🏠 PRIMARY DATABASE                    📦 BACKUP STRATEGY                         │
    │  ┌─────────────────────────────────┐   ┌─────────────────────────────────────────┐ │
    │  │ 🍃 MongoDB Atlas                │   │ ⏰ Automatic Daily Backups              │ │
    │  │ ├─ Replica Set (3 nodes)       │   │ ├─ Point-in-time recovery               │ │
    │  │ ├─ Auto-failover               │   │ ├─ 7 days retention                     │ │
    │  │ ├─ Read preference: primary    │   │ └─ Cross-region replication             │ │
    │  │ └─ Write concern: majority     │   │                                         │ │
    │  └─────────────────────────────────┘   │ 🔧 Manual Backup (Critical)            │ │
    │                                        │ ├─ Before major updates                 │ │
    │  🧠 IN-MEMORY CACHE                   │ ├─ JSON export for analysis             │ │
    │  ┌─────────────────────────────────┐   │ └─ Local backup for development        │ │
    │  │ 🎯 Active Sessions Map          │   └─────────────────────────────────────────┘ │
    │  │ ├─ Primary storage              │                                               │ │
    │  │ ├─ Backup to MongoDB           │   📊 MONITORING & ALERTS                      │ │
    │  │ ├─ TTL-based cleanup           │   ┌─────────────────────────────────────────┐ │
    │  │ └─ Fallback on cache miss      │   │ 🚨 Response time > 100ms                │ │
    │  └─────────────────────────────────┘   │ 🚨 Error rate > 5%                     │ │
    │                                        │ 🚨 Connection pool > 80%               │ │
    │                                        │ 🚨 Disk usage > 85%                    │ │
    │                                        │ 🚨 Cache hit ratio < 85%               │ │
    │                                        └─────────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────────────────────────────────────┘
```

## 📋 Estructura Detallada de Colecciones

### 🗂️ **active_sessions** (Sesiones Temporales Activas)

```json
{
  "_id": ObjectId("..."),
  "phoneNumber": "573001234567",                    // 📱 Identificador único del usuario
  "state": "answering_quiz",                        // 🎯 Estado actual: idle, watching_video, answering_quiz, in_survey, completed
  "currentModule": 3,                               // 📖 Módulo actual (1-6)
  "currentQuestion": 2,                             // ❓ Pregunta actual del módulo
  "startedAt": ISODate("2025-10-01T10:00:00Z"),    // ⏰ Inicio de sesión
  "lastActivity": ISODate("2025-10-01T10:15:00Z"), // 🕐 Última actividad
  "updatedAt": ISODate("2025-10-01T10:15:30Z"),    // 🔄 Última actualización
  "answers": [                                      // 📝 Respuestas del módulo actual
    {
      "questionNumber": 1,
      "selectedOption": "B",
      "isCorrect": true,
      "answeredAt": ISODate("2025-10-01T10:12:00Z")
    },
    {
      "questionNumber": 2,
      "selectedOption": "A",
      "isCorrect": false,
      "answeredAt": ISODate("2025-10-01T10:15:00Z")
    }
  ],
  "moduleResults": [                                // 🏆 Resultados de módulos completados
    {
      "module": 1,
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "completedAt": ISODate("2025-10-01T09:45:00Z")
    },
    {
      "module": 2,
      "score": 9,
      "totalQuestions": 10,
      "percentage": 90,
      "completedAt": ISODate("2025-10-01T10:00:00Z")
    }
  ],
  "surveyResponses": [],                            // 📊 Respuestas de encuesta (si aplica)
  "metadata": {                                     // 📋 Metadatos adicionales
    "userAgent": "WhatsApp/2.23.20",
    "sessionDuration": 900,                         // segundos
    "retryCount": 0,
    "lastModuleAccessed": 3
  }
}
```

**🔍 Índices de active_sessions:**
```javascript
// Índices optimizados para consultas frecuentes
db.active_sessions.createIndex({ "phoneNumber": 1 }, { unique: true })
db.active_sessions.createIndex({ "lastActivity": 1 })           // Para cleanup de sesiones expiradas
db.active_sessions.createIndex({ "state": 1 })                 // Para estadísticas por estado
db.active_sessions.createIndex({ "currentModule": 1 })         // Para distribución por módulo
```

### 📋 **user_sessions** (Historial de Sesiones)

```json
{
  "_id": ObjectId("..."),
  "numeroUsuario": "573001234567",                  // 📱 Número de teléfono del usuario
  "evento": "inicio_curso",                         // 🎯 Tipo de evento registrado
  "iniciadoEn": ISODate("2025-10-01T10:00:00Z"),  // ⏰ Cuando inició el curso
  "usarPlantilla": true,                           // 📄 Si usó mensaje de plantilla
  "timestamp": ISODate("2025-10-01T10:00:00Z"),   // 🕐 Timestamp del registro
  "fecha_inicio": ISODate("2025-10-01T10:00:00Z"), // 📅 Fecha de inicio normalizada
  "sessionId": "session_20251001_1000_573001234567", // 🆔 ID único de sesión
  "channel": "whatsapp",                           // 📱 Canal de comunicación
  "metadata": {                                    // 📋 Información adicional
    "templateMessageId": "course_intro_v2",
    "userTimezone": "America/Bogota",
    "deviceType": "mobile"
  }
}
```

**🔍 Índices de user_sessions:**
```javascript
db.user_sessions.createIndex({ "numeroUsuario": 1 })
db.user_sessions.createIndex({ "timestamp": 1 })
db.user_sessions.createIndex({ "evento": 1, "timestamp": 1 })
```

### 📝 **quiz_responses** (Respuestas de Evaluaciones)

```json
{
  "_id": ObjectId("..."),
  "numeroUsuario": "573001234567",                  // 📱 Identificador del usuario
  "modulo": 3,                                      // 📖 Número del módulo (1-6)
  "respuestas": [                                   // 📝 Respuestas detalladas por pregunta
    {
      "pregunta": 1,
      "respuesta_usuario": "B",                     // ✅ Opción seleccionada
      "respuesta_correcta": "B",                    // ✓ Respuesta correcta
      "es_correcta": true,                          // ✅ Boolean de acierto
      "tiempo_respuesta": 15,                       // ⏱️ Segundos para responder
      "timestamp": ISODate("2025-10-01T10:12:00Z")
    },
    {
      "pregunta": 2,
      "respuesta_usuario": "A",
      "respuesta_correcta": "C",
      "es_correcta": false,
      "tiempo_respuesta": 8,
      "timestamp": ISODate("2025-10-01T10:12:30Z")
    }
    // ... hasta 10 preguntas por módulo
  ],
  "resultadoModulo": {                              // 🏆 Resumen del módulo
    "puntuacion": 8,                                // Preguntas correctas
    "total_preguntas": 10,                          // Total de preguntas
    "porcentaje": 80,                               // Porcentaje de acierto
    "tiempo_total": 450,                            // Segundos totales
    "aprobado": true,                               // Si aprobó (>= 70%)
    "intentos": 1                                   // Número de intentos
  },
  "timestamp": ISODate("2025-10-01T10:20:00Z"),   // 🕐 Cuando completó el módulo
  "fecha_completado": ISODate("2025-10-01T10:20:00Z"), // 📅 Fecha de finalización
  "metadata": {                                    // 📋 Datos adicionales
    "moduleTitle": "Contraseñas Seguras",
    "difficulty": "intermediate",
    "retryCount": 0
  }
}
```

**🔍 Índices de quiz_responses:**
```javascript
db.quiz_responses.createIndex({ "numeroUsuario": 1 })
db.quiz_responses.createIndex({ "modulo": 1 })
db.quiz_responses.createIndex({ "timestamp": 1 })
db.quiz_responses.createIndex({ "numeroUsuario": 1, "modulo": 1 }, { unique: true })
```

### 📊 **survey_responses** (Encuestas de Satisfacción)

```json
{
  "_id": ObjectId("..."),
  "numeroUsuario": "573001234567",                  // 📱 Usuario que completó la encuesta
  "respuestasEncuesta": [                           // 📋 Respuestas de la encuesta post-curso
    {
      "pregunta_id": 1,
      "pregunta": "¿Cómo calificarías el contenido del curso?",
      "respuesta": "Excelente",
      "escala": 5,                                  // Escala 1-5
      "timestamp": ISODate("2025-10-01T11:00:00Z")
    },
    {
      "pregunta_id": 2,
      "pregunta": "¿Recomendarías este curso?",
      "respuesta": "Definitivamente sí",
      "escala": 5,
      "timestamp": ISODate("2025-10-01T11:00:30Z")
    },
    {
      "pregunta_id": 3,
      "pregunta": "¿Qué módulo te gustó más?",
      "respuesta": "Phishing y ingeniería social",
      "respuesta_libre": true,
      "timestamp": ISODate("2025-10-01T11:01:00Z")
    }
  ],
  "resultadosModulos": [                            // 🏆 Resumen completo del curso
    {
      "modulo": 1,
      "titulo": "Seguridad Básica",
      "puntuacion": 8,
      "porcentaje": 80,
      "tiempo_dedicado": 420,                       // segundos
      "completado_en": ISODate("2025-10-01T09:45:00Z")
    },
    {
      "modulo": 2,
      "titulo": "Phishing",
      "puntuacion": 9,
      "porcentaje": 90,
      "tiempo_dedicado": 380,
      "completado_en": ISODate("2025-10-01T10:10:00Z")
    }
    // ... todos los módulos completados
  ],
  "resumenGeneral": {                               // 📈 Estadísticas generales
    "puntuacion_total": 87,                         // Promedio general
    "modulos_completados": 6,                       // Módulos finalizados
    "tiempo_total_curso": 2400,                     // Segundos totales
    "fecha_inicio": ISODate("2025-10-01T09:00:00Z"),
    "fecha_finalizacion": ISODate("2025-10-01T11:00:00Z"),
    "certificado_otorgado": true
  },
  "timestamp": ISODate("2025-10-01T11:05:00Z"),   // 🕐 Cuando completó la encuesta
  "fecha_completado": ISODate("2025-10-01T11:05:00Z"), // 📅 Fecha de finalización
  "metadata": {                                    // 📋 Información adicional
    "survey_version": "v2.0",
    "completion_rate": 100,                         // % de encuesta completada
    "nps_score": 9,                                 // Net Promoter Score
    "satisfaction_level": "muy_satisfecho"
  }
}
```

**🔍 Índices de survey_responses:**
```javascript
db.survey_responses.createIndex({ "numeroUsuario": 1 }, { unique: true })
db.survey_responses.createIndex({ "timestamp": 1 })
db.survey_responses.createIndex({ "fecha_completado": 1 })
db.survey_responses.createIndex({ "resumenGeneral.puntuacion_total": 1 })
```

## 🔗 Diagrama de Relaciones entre Colecciones

```
📱 USUARIO (phoneNumber: "573001234567")
│
├─ 📋 user_sessions ─────────────► 🎯 INICIO DE CURSO
│   └── evento: "inicio_curso"
│   └── timestamp: inicio
│
├─ 🗂️ active_sessions ──────────► ⚡ SESIÓN ACTIVA (TEMPORAL)
│   ├── state: "answering_quiz"
│   ├── currentModule: 3
│   ├── currentQuestion: 2
│   └── TTL: 30 minutos
│
├─ 📝 quiz_responses ───────────► 📚 POR CADA MÓDULO (1-6)
│   ├── modulo: 1 ──────────────► Seguridad Básica
│   ├── modulo: 2 ──────────────► Phishing  
│   ├── modulo: 3 ──────────────► Contraseñas
│   ├── modulo: 4 ──────────────► Redes Sociales
│   ├── modulo: 5 ──────────────► Navegación Segura
│   └── modulo: 6 ──────────────► Dispositivos Móviles
│
└─ 📊 survey_responses ─────────► 🎓 FINALIZACIÓN DE CURSO
    └── resumenGeneral ─────────► Certificado + Estadísticas
```

## 📊 Agregaciones y Consultas Principales

### 🎯 **Estadísticas en Tiempo Real**

```javascript
// 1. Sesiones activas por estado
db.active_sessions.aggregate([
  {
    $group: {
      _id: "$state",
      count: { $sum: 1 },
      usuarios: { $push: "$phoneNumber" }
    }
  },
  {
    $sort: { count: -1 }
  }
])

// Resultado esperado:
// { "_id": "answering_quiz", "count": 15, "usuarios": ["573001...", "573002..."] }
// { "_id": "watching_video", "count": 8, "usuarios": ["573003...", "573004..."] }
// { "_id": "idle", "count": 5, "usuarios": ["573005..."] }
```

### 📈 **Analytics de Completación por Módulo**

```javascript
// 2. Tasa de completación por módulo
db.quiz_responses.aggregate([
  {
    $group: {
      _id: "$modulo",
      total_usuarios: { $sum: 1 },
      usuarios_aprobados: {
        $sum: {
          $cond: [{ $gte: ["$resultadoModulo.porcentaje", 70] }, 1, 0]
        }
      },
      puntuacion_promedio: { $avg: "$resultadoModulo.porcentaje" },
      tiempo_promedio: { $avg: "$resultadoModulo.tiempo_total" }
    }
  },
  {
    $addFields: {
      tasa_aprobacion: {
        $multiply: [
          { $divide: ["$usuarios_aprobados", "$total_usuarios"] },
          100
        ]
      }
    }
  },
  {
    $sort: { "_id": 1 }
  }
])

// Resultado esperado:
// { "_id": 1, "total_usuarios": 120, "usuarios_aprobados": 105, "tasa_aprobacion": 87.5, "puntuacion_promedio": 83.2 }
// { "_id": 2, "total_usuarios": 98, "usuarios_aprobados": 89, "tasa_aprobacion": 90.8, "puntuacion_promedio": 86.1 }
```

### 🏆 **Análisis de Retención de Usuarios**

```javascript
// 3. Embudo de conversión (Funnel Analysis)
db.user_sessions.aggregate([
  {
    $lookup: {
      from: "quiz_responses",
      localField: "numeroUsuario",
      foreignField: "numeroUsuario",
      as: "modulos_completados"
    }
  },
  {
    $lookup: {
      from: "survey_responses",
      localField: "numeroUsuario",
      foreignField: "numeroUsuario",
      as: "encuesta_completada"
    }
  },
  {
    $addFields: {
      total_modulos: { $size: "$modulos_completados" },
      completo_encuesta: { $gt: [{ $size: "$encuesta_completada" }, 0] },
      curso_completo: { $gte: [{ $size: "$modulos_completados" }, 6] }
    }
  },
  {
    $group: {
      _id: null,
      usuarios_iniciaron: { $sum: 1 },
      usuarios_1_modulo: { $sum: { $cond: [{ $gte: ["$total_modulos", 1] }, 1, 0] } },
      usuarios_3_modulos: { $sum: { $cond: [{ $gte: ["$total_modulos", 3] }, 1, 0] } },
      usuarios_curso_completo: { $sum: { $cond: ["$curso_completo", 1, 0] } },
      usuarios_con_encuesta: { $sum: { $cond: ["$completo_encuesta", 1, 0] } }
    }
  }
])
```

### ⏰ **Análisis Temporal de Actividad**

```javascript
// 4. Distribución de actividad por horas del día
db.quiz_responses.aggregate([
  {
    $addFields: {
      hora_del_dia: { $hour: "$timestamp" },
      dia_semana: { $dayOfWeek: "$timestamp" }
    }
  },
  {
    $group: {
      _id: {
        hora: "$hora_del_dia",
        dia: "$dia_semana"
      },
      total_respuestas: { $sum: 1 },
      usuarios_unicos: { $addToSet: "$numeroUsuario" }
    }
  },
  {
    $addFields: {
      usuarios_unicos_count: { $size: "$usuarios_unicos" }
    }
  },
  {
    $sort: { "_id.dia": 1, "_id.hora": 1 }
  }
])
```

## ⚡ Estrategia de Optimización y Performance

### 🎯 **Cache Strategy**

```
🧠 IN-MEMORY CACHE (Map)                     🗄️ MONGODB PERSISTANCE
┌─────────────────────────────────────┐      ┌─────────────────────────────────────┐
│                                     │      │                                     │
│  📱 Active Sessions                 │ ◄────┤►  📋 active_sessions               │
│  ┌─────────────────────────────────┐│      │  (Backup + Sync)                   │
│  │ phoneNumber -> UserSession      ││      │                                     │
│  │ TTL: 30 minutes                 ││      │  🔍 Indexed by:                     │
│  │ Auto-cleanup expired            ││      │  • phoneNumber (unique)             │
│  │ Instant access: O(1)            ││      │  • lastActivity (cleanup)           │
│  └─────────────────────────────────┘│      │  • state (analytics)                │
│                                     │      │                                     │
│  🚀 Performance Benefits:           │      │  📊 Analytics Queries:              │
│  • Sub-millisecond access          │      │  • Real-time statistics             │
│  • Reduced DB load                 │      │  • Historical trends                │
│  • Automatic cleanup               │      │  • User behavior patterns           │
│  • Fallback resilience             │      │                                     │
└─────────────────────────────────────┘      └─────────────────────────────────────┘
```

### 📊 **Índices Compuestos Optimizados**

```javascript
// Índices para consultas complejas más frecuentes
db.quiz_responses.createIndex({
  "numeroUsuario": 1,
  "timestamp": -1,
  "modulo": 1
})

db.survey_responses.createIndex({
  "fecha_completado": -1,
  "resumenGeneral.puntuacion_total": -1
})

db.active_sessions.createIndex({
  "state": 1,
  "currentModule": 1,
  "lastActivity": -1
})
```

### 🔄 **TTL (Time To Live) Collections**

```javascript
// Auto-cleanup de sesiones expiradas
db.active_sessions.createIndex(
  { "lastActivity": 1 },
  { expireAfterSeconds: 1800 }  // 30 minutos
)

// Retention policy para logs antiguos (opcional)
db.user_sessions.createIndex(
  { "timestamp": 1 },
  { expireAfterSeconds: 7776000 }  // 90 días
)
```

## 📈 Métricas de Performance y Monitoreo

### 🎯 **KPIs Principales**

```
📊 DATABASE METRICS                          🚀 PERFORMANCE INDICATORS
┌─────────────────────────────────────┐      ┌─────────────────────────────────────┐
│                                     │      │                                     │
│ 📈 Documents Count:                 │      │ ⚡ Query Performance:               │
│ • active_sessions: ~50-200          │      │ • Average query time: <10ms        │
│ • user_sessions: ~1000/month        │      │ • Index hit ratio: >95%             │
│ • quiz_responses: ~6000/month       │      │ • Cache hit ratio: >90%             │
│ • survey_responses: ~800/month      │      │ • Connection pool: 10-20            │
│                                     │      │                                     │
│ 💾 Storage Size:                    │      │ 🔧 Operations/sec:                  │
│ • Total DB size: ~500MB/month       │      │ • Reads: ~100/sec                   │
│ • Index size: ~50MB                 │      │ • Writes: ~20/sec                   │
│ • Growth rate: ~50MB/month          │      │ • Updates: ~30/sec                  │
│                                     │      │ • Aggregations: ~5/sec              │
└─────────────────────────────────────┘      └─────────────────────────────────────┘
```

### 🔍 **Consultas de Monitoreo**

```javascript
// 1. Estado general de la base de datos
db.runCommand("dbStats")

// 2. Performance de consultas
db.setProfilingLevel(2, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)

// 3. Uso de índices
db.active_sessions.getIndexes()
db.quiz_responses.aggregate([{ $indexStats: {} }])

// 4. Estadísticas de colecciones
db.active_sessions.stats()
db.quiz_responses.stats()
```

Este diagrama de base de datos te proporciona una visión completa de cómo está estructurada tu información en MongoDB, optimizada para el sistema de concientización en seguridad Niblion. 🚀