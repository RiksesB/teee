# 📊 REFERENCIA COMPLETA - BASE DE DATOS MONGODB

## 🎯 Información General

**Base de Datos:** `niblion_analytics`  
**Motor:** MongoDB (NoSQL)  
**Propósito:** Almacenar datos de cursos WhatsApp, autenticación, analíticas, pagos y campañas

---

## 📁 COLECCIONES IMPLEMENTADAS

### Índice de Colecciones
1. [users](#1-users---usuarios-del-sistema) - Usuarios del sistema (Admin/Client)
2. [courses](#2-courses---cursos-de-capacitación) - Cursos de capacitación
3. [user_sessions](#3-user_sessions---sesiones-de-usuarios-whatsapp) - Sesiones de usuarios WhatsApp
4. [quiz_responses](#4-quiz_responses---respuestas-de-evaluaciones) - Respuestas de evaluaciones
5. [survey_responses](#5-survey_responses---encuestas-de-satisfacción) - Encuestas de satisfacción
6. [active_sessions](#6-active_sessions---sesiones-activas-temporales) - Sesiones activas (temporal)
7. [organizations](#7-organizations---clientes-organizaciones) - Clientes/Organizaciones (planificado)
8. [payments](#8-payments---registro-de-pagos) - Registro de pagos (planificado)
9. [campaigns](#9-campaigns---campañas-de-capacitación) - Campañas de capacitación (planificado)
10. [enrollments](#10-enrollments---inscripciones-individuales) - Inscripciones individuales (planificado)

---

## 1. `users` - Usuarios del Sistema

**Propósito:** Almacenar usuarios con autenticación (Admin, Client)  
**Colección:** `users`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "admin@niblion.com",
  "password": "$2a$10$hasheddpassword...",
  "name": "Juan Pérez",
  "role": "super_admin",
  "companyName": "Niblion Systems",
  "phone": "+584121234567",
  "employees": 0,
  "credits": 1000,
  "status": "active",
  "refreshToken": "jwt.refresh.token...",
  "lastLoginAt": ISODate("2025-11-04T10:30:00Z"),
  "createdAt": ISODate("2025-01-15T08:00:00Z"),
  "updatedAt": ISODate("2025-11-04T10:30:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción | Valores |
|-------|------|-----------|-------------|---------|
| `_id` | ObjectId | Sí | ID único del usuario | Auto-generado |
| `email` | String | Sí | Email único (lowercase) | ej: `usuario@empresa.com` |
| `password` | String | Sí | Hash bcrypt de contraseña | bcrypt hash |
| `name` | String | Sí | Nombre completo | ej: `Juan Pérez` |
| `role` | String | Sí | Rol del usuario | `super_admin`, `admin`, `client` |
| `companyName` | String | No | Nombre de empresa (clientes) | ej: `Empresa Demo S.A.` |
| `phone` | String | No | Teléfono de contacto | ej: `+584121234567` |
| `employees` | Number | No | Cantidad de empleados | Default: `0` |
| `credits` | Number | No | Créditos disponibles | Default: `0` |
| `status` | String | Sí | Estado de la cuenta | `active`, `inactive`, `suspended` |
| `refreshToken` | String | No | Token JWT de refresh | JWT string |
| `lastLoginAt` | Date | No | Fecha de último login | ISODate |
| `createdAt` | Date | Auto | Fecha de creación | ISODate |
| `updatedAt` | Date | Auto | Fecha de actualización | ISODate |

### Índices

```javascript
{ email: 1 } // Único
{ role: 1 }
{ status: 1 }
{ createdAt: -1 }
```

### Ejemplo de Datos de Prueba

```json
// Super Admin
{
  "email": "super@niblion.com",
  "password": "$2a$10$...",
  "name": "Super Admin",
  "role": "super_admin",
  "status": "active",
  "credits": 0
}

// Cliente
{
  "email": "cliente@empresa.com",
  "password": "$2a$10$...",
  "name": "María González",
  "role": "client",
  "companyName": "TechCorp Solutions",
  "phone": "+584121234567",
  "employees": 150,
  "credits": 500,
  "status": "active"
}
```

---

## 2. `courses` - Cursos de Capacitación

**Propósito:** Almacenar cursos de ciberseguridad con módulos y evaluaciones  
**Colección:** `courses`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "title": "Fundamentos de Ciberseguridad",
  "description": "Curso básico sobre seguridad informática y prevención de phishing",
  "level": "basic",
  "language": "es",
  "modules": [
    {
      "title": "Seguridad Básica",
      "content": "Introducción a conceptos fundamentales...",
      "videoUrl": "https://storage.example.com/videos/modulo1.mp4",
      "questions": [
        {
          "text": "¿Qué es phishing?",
          "options": [
            "Un tipo de malware",
            "Un ataque de ingeniería social",
            "Un antivirus",
            "Una red social"
          ],
          "correctAnswer": 1,
          "feedback": {
            "correct": "¡Correcto! El phishing es ingeniería social.",
            "incorrect": "Incorrecto. El phishing es un ataque de ingeniería social."
          }
        }
      ],
      "order": 1
    }
  ],
  "durationMinutes": 45,
  "thumbnailUrl": "https://storage.example.com/thumbnails/course1.jpg",
  "tags": ["phishing", "seguridad", "básico"],
  "isActive": true,
  "createdBy": ObjectId("507f1f77bcf86cd799439011"),
  "enrolledCount": 245,
  "completedCount": 198,
  "createdAt": ISODate("2025-01-20T10:00:00Z"),
  "updatedAt": ISODate("2025-11-01T15:30:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único del curso |
| `title` | String | Sí | Título del curso |
| `description` | String | Sí | Descripción completa |
| `level` | String | Sí | Nivel de dificultad: `basic`, `intermediate`, `advanced` |
| `language` | String | No | Idioma del curso (default: `es`) |
| `modules` | Array | Sí | Array de módulos del curso |
| `modules[].title` | String | Sí | Título del módulo |
| `modules[].content` | String | Sí | Contenido educativo |
| `modules[].videoUrl` | String | No | URL del video (opcional) |
| `modules[].questions` | Array | Sí | Preguntas de evaluación |
| `modules[].questions[].text` | String | Sí | Texto de la pregunta |
| `modules[].questions[].options` | Array[String] | Sí | Opciones de respuesta (4) |
| `modules[].questions[].correctAnswer` | Number | Sí | Índice de respuesta correcta (0-3) |
| `modules[].questions[].feedback` | Object | No | Feedback por respuesta |
| `modules[].order` | Number | No | Orden del módulo |
| `durationMinutes` | Number | No | Duración estimada (default: 30) |
| `thumbnailUrl` | String | No | URL de imagen miniatura |
| `tags` | Array[String] | No | Etiquetas para búsqueda |
| `isActive` | Boolean | No | Si está publicado (default: true) |
| `createdBy` | ObjectId | Sí | Referencia a User que creó |
| `enrolledCount` | Number | No | Cantidad de inscritos |
| `completedCount` | Number | No | Cantidad que completó |

### Índices

```javascript
{ title: "text", description: "text" } // Text search
{ level: 1 }
{ language: 1 }
{ isActive: 1 }
{ createdAt: -1 }
{ tags: 1 }
```

---

## 3. `user_sessions` - Sesiones de Usuarios WhatsApp

**Propósito:** Registrar el inicio de cursos vía WhatsApp  
**Colección:** `user_sessions`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "numeroUsuario": "573001234567",
  "evento": "inicio_curso",
  "iniciadoEn": ISODate("2025-11-04T09:00:00Z"),
  "usarPlantilla": true,
  "timestamp": ISODate("2025-11-04T09:00:00Z"),
  "fecha_inicio": ISODate("2025-11-04T09:00:00Z"),
  "createdAt": ISODate("2025-11-04T09:00:00Z"),
  "updatedAt": ISODate("2025-11-04T09:00:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único de la sesión |
| `numeroUsuario` | String | Sí | Número de teléfono (formato: 573001234567) |
| `evento` | String | Sí | Tipo de evento: `inicio_curso` |
| `iniciadoEn` | Date | Sí | Timestamp de inicio |
| `usarPlantilla` | Boolean | Sí | Si se usó mensaje de plantilla WhatsApp |
| `timestamp` | Date | Sí | Timestamp del evento |
| `fecha_inicio` | Date | Sí | Fecha normalizada de inicio |

### Índices

```javascript
{ numeroUsuario: 1 }
{ timestamp: -1 }
{ evento: 1 }
```

### Volumen Estimado
- ~1,000 documentos/mes
- Retención: 12 meses

---

## 4. `quiz_responses` - Respuestas de Evaluaciones

**Propósito:** Almacenar respuestas de evaluaciones por módulo  
**Colección:** `quiz_responses`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "numeroUsuario": "573001234567",
  "modulo": 1,
  "respuestasDetalladas": [
    {
      "numero": 1,
      "pregunta": "¿Qué es phishing?",
      "respuestaUsuario": "B",
      "respuestaCorrecta": "B",
      "esCorrecta": true,
      "timestamp": ISODate("2025-11-04T09:15:00Z")
    },
    {
      "numero": 2,
      "pregunta": "¿Cómo identificar un email falso?",
      "respuestaUsuario": "A",
      "respuestaCorrecta": "C",
      "esCorrecta": false,
      "timestamp": ISODate("2025-11-04T09:16:30Z")
    }
  ],
  "resultadoModulo": {
    "modulo": 1,
    "preguntasCorrectas": 8,
    "preguntasTotales": 10,
    "porcentaje": 80
  },
  "timestamp": ISODate("2025-11-04T09:20:00Z"),
  "createdAt": ISODate("2025-11-04T09:20:00Z"),
  "updatedAt": ISODate("2025-11-04T09:20:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único de la respuesta |
| `numeroUsuario` | String | Sí | Número de teléfono |
| `modulo` | Number | Sí | Número del módulo (1-6) |
| `respuestasDetalladas` | Array | Sí | Respuestas individuales |
| `respuestasDetalladas[].numero` | Number | Sí | Número de pregunta (1-10) |
| `respuestasDetalladas[].pregunta` | String | Sí | Texto de la pregunta |
| `respuestasDetalladas[].respuestaUsuario` | String | Sí | Opción elegida (A, B, C, D) |
| `respuestasDetalladas[].respuestaCorrecta` | String | Sí | Opción correcta (A, B, C, D) |
| `respuestasDetalladas[].esCorrecta` | Boolean | Sí | Si acertó |
| `respuestasDetalladas[].timestamp` | Date | Sí | Cuándo respondió |
| `resultadoModulo` | Object | Sí | Resumen del módulo |
| `resultadoModulo.modulo` | Number | Sí | Número del módulo |
| `resultadoModulo.preguntasCorrectas` | Number | Sí | Cantidad de aciertos |
| `resultadoModulo.preguntasTotales` | Number | Sí | Total de preguntas (10) |
| `resultadoModulo.porcentaje` | Number | Sí | Porcentaje de acierto |
| `timestamp` | Date | Sí | Timestamp de finalización |

### Índices

```javascript
{ numeroUsuario: 1 }
{ modulo: 1 }
{ timestamp: -1 }
{ numeroUsuario: 1, modulo: 1 } // Único (un quiz por módulo)
```

### Volumen Estimado
- ~6,000 documentos/mes (1,000 usuarios × 6 módulos)
- Retención: Permanente

---

## 5. `survey_responses` - Encuestas de Satisfacción

**Propósito:** Almacenar respuestas de encuesta post-curso  
**Colección:** `survey_responses`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "numeroUsuario": "573001234567",
  "respuestasEncuesta": [
    {
      "numero": 1,
      "pregunta": "¿Cómo calificarías el contenido del curso?",
      "respuesta": "Excelente"
    },
    {
      "numero": 2,
      "pregunta": "¿Recomendarías este curso?",
      "respuesta": "Definitivamente sí"
    },
    {
      "numero": 3,
      "pregunta": "¿Qué módulo te gustó más?",
      "respuesta": "Phishing y ingeniería social"
    }
  ],
  "resultadosModulos": [
    {
      "modulo": 1,
      "preguntasCorrectas": 8,
      "preguntasTotales": 10,
      "porcentaje": 80
    },
    {
      "modulo": 2,
      "preguntasCorrectas": 9,
      "preguntasTotales": 10,
      "porcentaje": 90
    }
  ],
  "timestamp": ISODate("2025-11-04T11:00:00Z"),
  "fecha_completado": ISODate("2025-11-04T11:00:00Z"),
  "createdAt": ISODate("2025-11-04T11:00:00Z"),
  "updatedAt": ISODate("2025-11-04T11:00:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único de la encuesta |
| `numeroUsuario` | String | Sí | Número de teléfono |
| `respuestasEncuesta` | Array | Sí | Respuestas de la encuesta |
| `respuestasEncuesta[].numero` | Number | Sí | Número de pregunta |
| `respuestasEncuesta[].pregunta` | String | Sí | Texto de pregunta |
| `respuestasEncuesta[].respuesta` | String | Sí | Respuesta del usuario |
| `resultadosModulos` | Array | Sí | Resumen de todos los módulos |
| `resultadosModulos[].modulo` | Number | Sí | Número del módulo |
| `resultadosModulos[].preguntasCorrectas` | Number | Sí | Preguntas correctas |
| `resultadosModulos[].preguntasTotales` | Number | Sí | Total de preguntas |
| `resultadosModulos[].porcentaje` | Number | Sí | Porcentaje de acierto |
| `timestamp` | Date | Sí | Cuándo completó la encuesta |
| `fecha_completado` | Date | Sí | Fecha de finalización |

### Índices

```javascript
{ numeroUsuario: 1 } // Único (una encuesta por usuario)
{ timestamp: -1 }
{ fecha_completado: -1 }
```

### Volumen Estimado
- ~800 documentos/mes (80% de completitud)
- Retención: Permanente

---

## 6. `active_sessions` - Sesiones Activas (Temporal)

**Propósito:** Mantener el estado temporal de usuarios activos (TTL: 30 minutos)  
**Colección:** `active_sessions`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "phoneNumber": "573001234567",
  "state": "answering_quiz",
  "currentModule": 2,
  "currentQuestion": 3,
  "lastActivity": ISODate("2025-11-04T10:15:30Z"),
  "answers": [
    {
      "questionNumber": 1,
      "selectedOption": "B",
      "isCorrect": true,
      "answeredAt": ISODate("2025-11-04T10:12:00Z")
    },
    {
      "questionNumber": 2,
      "selectedOption": "A",
      "isCorrect": false,
      "answeredAt": ISODate("2025-11-04T10:15:00Z")
    }
  ],
  "moduleResults": [
    {
      "module": 1,
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "completedAt": ISODate("2025-11-04T09:45:00Z")
    }
  ],
  "surveyResponses": [],
  "metadata": {
    "userAgent": "WhatsApp/2.23.20",
    "sessionDuration": 900,
    "retryCount": 0,
    "lastModuleAccessed": 2
  },
  "createdAt": ISODate("2025-11-04T09:00:00Z"),
  "updatedAt": ISODate("2025-11-04T10:15:30Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único de sesión |
| `phoneNumber` | String | Sí | Número de teléfono (único) |
| `state` | String | Sí | Estado actual: `viewing_module`, `answering_quiz`, `survey`, `completed` |
| `currentModule` | Number | Sí | Módulo actual (1-6) |
| `currentQuestion` | Number | No | Pregunta actual del quiz |
| `lastActivity` | Date | Sí | Última actividad (para TTL) |
| `answers` | Array | Sí | Respuestas del módulo actual |
| `moduleResults` | Array | Sí | Resultados de módulos completados |
| `surveyResponses` | Array | No | Respuestas de encuesta |
| `metadata` | Object | No | Información adicional |

### Índices

```javascript
{ phoneNumber: 1 } // Único
{ lastActivity: 1 } // Para limpieza automática (TTL)
{ state: 1 }
{ currentModule: 1 }
```

### TTL (Time To Live)

```javascript
// Borrado automático después de 30 minutos de inactividad
db.active_sessions.createIndex(
  { "lastActivity": 1 },
  { expireAfterSeconds: 1800 }
);
```

### Volumen Estimado
- ~50-200 documentos activos simultáneos
- Auto-eliminación tras 30 minutos

---

## 7. `organizations` - Clientes/Organizaciones

**Propósito:** Almacenar clientes empresariales (PLANIFICADO)  
**Colección:** `organizations`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439017"),
  "name": "TechCorp Solutions",
  "email": "contacto@techcorp.com",
  "phone": "+584121234567",
  "industry": "Tecnología",
  "peopleCredits": {
    "available": 450,
    "total": 1000,
    "used": 550
  },
  "subscriptionStatus": "active",
  "subscriptionStartDate": ISODate("2025-01-01T00:00:00Z"),
  "settings": {
    "defaultLanguage": "es",
    "timezone": "America/Caracas",
    "notifications": {
      "email": true,
      "sms": false
    }
  },
  "createdAt": ISODate("2025-01-01T10:00:00Z"),
  "updatedAt": ISODate("2025-11-04T15:30:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único de organización |
| `name` | String | Sí | Nombre de la empresa |
| `email` | String | Sí | Email de contacto (único) |
| `phone` | String | No | Teléfono de contacto |
| `industry` | String | No | Sector industrial |
| `peopleCredits.available` | Number | Sí | Créditos disponibles |
| `peopleCredits.total` | Number | Sí | Total histórico comprado |
| `peopleCredits.used` | Number | Sí | Créditos ya utilizados |
| `subscriptionStatus` | String | Sí | Estado: `active`, `trial`, `suspended` |
| `subscriptionStartDate` | Date | No | Fecha de inicio |
| `settings` | Object | No | Configuración personalizada |

### Índices

```javascript
{ email: 1 } // Único
{ subscriptionStatus: 1 }
{ "peopleCredits.available": 1 }
```

---

## 8. `payments` - Registro de Pagos

**Propósito:** Registrar todas las transacciones de pago (PLANIFICADO)  
**Colección:** `payments`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439018"),
  "organizationId": ObjectId("507f1f77bcf86cd799439017"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "numberOfPeople": 100,
  "pricePerPerson": 5.00,
  "totalAmount": 500.00,
  "currency": "USD",
  "paymentMethod": "paypal",
  "paymentDetails": {
    "paypalTransactionId": "PAYID-123456789",
    "paypalPayerId": "PAYER123",
    "paypalOrderId": "ORDER-98765"
  },
  "status": "approved",
  "creditsAdded": 100,
  "approvedAt": ISODate("2025-11-04T14:30:00Z"),
  "approvedBy": ObjectId("507f1f77bcf86cd799439011"),
  "notes": "Pago procesado correctamente",
  "createdAt": ISODate("2025-11-04T14:25:00Z"),
  "updatedAt": ISODate("2025-11-04T14:30:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único del pago |
| `organizationId` | ObjectId | Sí | Referencia a Organization |
| `userId` | ObjectId | Sí | Usuario que realizó el pago |
| `numberOfPeople` | Number | Sí | Cantidad de créditos comprados |
| `pricePerPerson` | Number | Sí | Precio unitario |
| `totalAmount` | Number | Sí | Monto total pagado |
| `currency` | String | Sí | Moneda: `USD`, `VES` |
| `paymentMethod` | String | Sí | Método: `paypal`, `mobile_payment`, `bank_transfer` |
| `paymentDetails` | Object | Sí | Detalles específicos del método |
| `status` | String | Sí | Estado: `pending`, `approved`, `rejected` |
| `creditsAdded` | Number | No | Créditos agregados |
| `approvedAt` | Date | No | Cuándo se aprobó |
| `approvedBy` | ObjectId | No | Admin que aprobó |
| `notes` | String | No | Notas adicionales |

### Tipos de Pago Soportados

#### PayPal
```json
"paymentDetails": {
  "paypalTransactionId": "PAYID-123456789",
  "paypalPayerId": "PAYER123",
  "paypalOrderId": "ORDER-98765"
}
```

#### Pago Móvil (Venezuela)
```json
"paymentDetails": {
  "mobilePhone": "04121234567",
  "mobileBank": "0102",
  "mobileReference": "123456",
  "receiptUrl": "https://storage/receipts/img123.jpg"
}
```

#### Transferencia Bancaria
```json
"paymentDetails": {
  "bankName": "Banco de Venezuela",
  "bankAccount": "0102-0123-45-6789012345",
  "referenceNumber": "987654321",
  "transferDate": ISODate("2025-11-04T10:00:00Z"),
  "receiptUrl": "https://storage/receipts/img124.jpg"
}
```

### Índices

```javascript
{ organizationId: 1, createdAt: -1 }
{ status: 1 }
{ "paymentDetails.paypalTransactionId": 1 }
```

---

## 9. `campaigns` - Campañas de Capacitación

**Propósito:** Gestionar campañas de capacitación WhatsApp (PLANIFICADO)  
**Colección:** `campaigns`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439019"),
  "name": "Capacitación Q4 2025",
  "organizationId": ObjectId("507f1f77bcf86cd799439017"),
  "courseId": ObjectId("507f1f77bcf86cd799439012"),
  "targetPeople": [
    {
      "phone": "+584121234567",
      "name": "Juan Pérez",
      "email": "juan@techcorp.com",
      "department": "IT"
    },
    {
      "phone": "+584129876543",
      "name": "María González",
      "email": "maria@techcorp.com",
      "department": "Ventas"
    }
  ],
  "creditsUsed": 100,
  "startDate": ISODate("2025-11-05T09:00:00Z"),
  "endDate": ISODate("2025-11-30T18:00:00Z"),
  "scheduledSendTime": ISODate("2025-11-05T09:00:00Z"),
  "status": "active",
  "whatsappProgress": {
    "total": 100,
    "sent": 100,
    "delivered": 98,
    "read": 85,
    "replied": 72,
    "failed": 2
  },
  "gophishCampaign": {
    "campaignId": "gophish-123",
    "simulationType": "email_phishing",
    "templateId": "template-001",
    "landingPageId": "landing-001",
    "smtpId": "smtp-001",
    "results": {
      "emailsSent": 100,
      "emailsOpened": 65,
      "linksClicked": 28,
      "dataSubmitted": 12,
      "reportedByUsers": 8
    },
    "launchedAt": ISODate("2025-11-10T10:00:00Z"),
    "completedAt": ISODate("2025-11-15T18:00:00Z")
  },
  "overallStats": {
    "courseCompletionRate": 82,
    "phishingClickRate": 28,
    "averageScore": 85,
    "improvementScore": 15
  },
  "createdBy": ObjectId("507f1f77bcf86cd799439011"),
  "createdAt": ISODate("2025-11-01T10:00:00Z"),
  "updatedAt": ISODate("2025-11-15T18:00:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único de campaña |
| `name` | String | Sí | Nombre de la campaña |
| `organizationId` | ObjectId | Sí | Referencia a Organization |
| `courseId` | ObjectId | Sí | Referencia a Course |
| `targetPeople` | Array | Sí | Lista de personas objetivo |
| `targetPeople[].phone` | String | Sí | Teléfono (formato E.164) |
| `targetPeople[].name` | String | Sí | Nombre completo |
| `targetPeople[].email` | String | No | Email |
| `targetPeople[].department` | String | No | Departamento |
| `creditsUsed` | Number | Sí | Créditos consumidos |
| `startDate` | Date | Sí | Fecha de inicio |
| `endDate` | Date | Sí | Fecha de fin |
| `status` | String | Sí | Estado: `draft`, `scheduled`, `active`, `completed`, `cancelled` |
| `whatsappProgress` | Object | No | Progreso de envío WhatsApp |
| `gophishCampaign` | Object | No | Integración con Gophish |

### Índices

```javascript
{ organizationId: 1, status: 1 }
{ startDate: 1 }
{ "gophishCampaign.campaignId": 1 }
```

---

## 10. `enrollments` - Inscripciones Individuales

**Propósito:** Seguimiento individual de progreso de cada persona (PLANIFICADO)  
**Colección:** `enrollments`

### Estructura del Documento

```json
{
  "_id": ObjectId("507f1f77bcf86cd79943901a"),
  "campaignId": ObjectId("507f1f77bcf86cd799439019"),
  "courseId": ObjectId("507f1f77bcf86cd799439012"),
  "organizationId": ObjectId("507f1f77bcf86cd799439017"),
  "person": {
    "phone": "+584121234567",
    "name": "Juan Pérez",
    "email": "juan@techcorp.com",
    "department": "IT"
  },
  "courseProgress": {
    "status": "completed",
    "currentModule": 6,
    "completedModules": [1, 2, 3, 4, 5, 6],
    "quizScores": [
      {
        "moduleId": 1,
        "score": 8,
        "maxScore": 10,
        "attempts": 1,
        "completedAt": ISODate("2025-11-06T10:30:00Z")
      },
      {
        "moduleId": 2,
        "score": 9,
        "maxScore": 10,
        "attempts": 1,
        "completedAt": ISODate("2025-11-07T11:00:00Z")
      }
    ],
    "totalScore": 52,
    "maxScore": 60,
    "passingScore": 42,
    "passed": true
  },
  "phishingSimulation": {
    "targetEmail": "juan@techcorp.com",
    "gophishResultId": "result-001",
    "events": [
      {
        "eventType": "email_sent",
        "timestamp": ISODate("2025-11-10T10:00:00Z"),
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "details": {}
      },
      {
        "eventType": "email_opened",
        "timestamp": ISODate("2025-11-10T10:15:00Z"),
        "ipAddress": "192.168.1.100",
        "details": {}
      }
    ],
    "summary": {
      "emailOpened": true,
      "linkClicked": false,
      "dataSubmitted": false,
      "reportedPhishing": true,
      "clickTime": null,
      "riskLevel": "low"
    },
    "simulationDate": ISODate("2025-11-10T10:00:00Z")
  },
  "analysis": {
    "preTestScore": 60,
    "postTestScore": 87,
    "improvement": 27,
    "phishingResistance": true,
    "certificateEarned": true,
    "certificateUrl": "https://storage/certificates/cert-001.pdf"
  },
  "startedAt": ISODate("2025-11-05T09:00:00Z"),
  "completedAt": ISODate("2025-11-12T16:30:00Z"),
  "lastActivityAt": ISODate("2025-11-12T16:30:00Z"),
  "createdAt": ISODate("2025-11-05T09:00:00Z"),
  "updatedAt": ISODate("2025-11-12T16:30:00Z")
}
```

### Campos Detallados

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | ObjectId | Sí | ID único de inscripción |
| `campaignId` | ObjectId | Sí | Referencia a Campaign |
| `courseId` | ObjectId | Sí | Referencia a Course |
| `organizationId` | ObjectId | Sí | Referencia a Organization |
| `person` | Object | Sí | Datos de la persona |
| `courseProgress` | Object | Sí | Progreso del curso |
| `courseProgress.status` | String | Sí | Estado: `not_started`, `in_progress`, `completed`, `failed` |
| `courseProgress.completedModules` | Array[Number] | Sí | Módulos completados |
| `courseProgress.quizScores` | Array | Sí | Puntuaciones por módulo |
| `courseProgress.passed` | Boolean | Sí | Si aprobó el curso |
| `phishingSimulation` | Object | No | Resultados de simulación |
| `phishingSimulation.summary.riskLevel` | String | No | Nivel de riesgo: `high`, `medium`, `low` |
| `analysis` | Object | No | Análisis combinado |
| `analysis.improvement` | Number | No | Porcentaje de mejora |

### Índices

```javascript
{ campaignId: 1, "person.phone": 1 }
{ organizationId: 1, "courseProgress.status": 1 }
{ "phishingSimulation.gophishResultId": 1 }
```

---

## 🔍 CONSULTAS ÚTILES PARA PRUEBAS

### 1. Verificar Usuarios Registrados

```javascript
// Listar todos los usuarios
db.users.find().pretty()

// Contar usuarios por rol
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

// Buscar usuario por email
db.users.findOne({ email: "admin@niblion.com" })
```

### 2. Verificar Sesiones de WhatsApp

```javascript
// Sesiones del último día
db.user_sessions.find({
  timestamp: { 
    $gte: new Date(Date.now() - 24*60*60*1000) 
  }
}).pretty()

// Contar sesiones por usuario
db.user_sessions.aggregate([
  { $group: { _id: "$numeroUsuario", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

### 3. Verificar Respuestas de Quiz

```javascript
// Respuestas de un usuario específico
db.quiz_responses.find({ 
  numeroUsuario: "573001234567" 
}).sort({ modulo: 1 })

// Promedio de puntajes por módulo
db.quiz_responses.aggregate([
  {
    $group: {
      _id: "$modulo",
      avgScore: { $avg: "$resultadoModulo.porcentaje" },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])

// Usuarios que aprobaron todos los módulos (>70%)
db.quiz_responses.aggregate([
  {
    $group: {
      _id: "$numeroUsuario",
      avgScore: { $avg: "$resultadoModulo.porcentaje" },
      modulesCompleted: { $sum: 1 }
    }
  },
  {
    $match: {
      avgScore: { $gte: 70 },
      modulesCompleted: { $gte: 6 }
    }
  }
])
```

### 4. Verificar Encuestas Completadas

```javascript
// Encuestas del último mes
db.survey_responses.find({
  fecha_completado: {
    $gte: new Date(Date.now() - 30*24*60*60*1000)
  }
}).pretty()

// Contar encuestas completadas
db.survey_responses.countDocuments()
```

### 5. Verificar Sesiones Activas

```javascript
// Sesiones activas ahora
db.active_sessions.find({
  lastActivity: {
    $gte: new Date(Date.now() - 30*60*1000) // Últimos 30 min
  }
}).pretty()

// Sesiones por estado
db.active_sessions.aggregate([
  { $group: { _id: "$state", count: { $sum: 1 } } }
])
```

### 6. Verificar Cursos

```javascript
// Listar cursos activos
db.courses.find({ isActive: true }).pretty()

// Cursos por nivel
db.courses.aggregate([
  { $group: { _id: "$level", count: { $sum: 1 } } }
])

// Curso con más inscripciones
db.courses.find().sort({ enrolledCount: -1 }).limit(5)
```

### 7. Verificar Créditos y Pagos (cuando se implemente)

```javascript
// Organizaciones con créditos bajos
db.organizations.find({
  "peopleCredits.available": { $lt: 50 }
})

// Pagos pendientes de aprobación
db.payments.find({ status: "pending" })

// Total recaudado por método de pago
db.payments.aggregate([
  { $match: { status: "approved" } },
  {
    $group: {
      _id: "$paymentMethod",
      total: { $sum: "$totalAmount" },
      count: { $sum: 1 }
    }
  }
])
```

### 8. Dashboard de Analíticas

```javascript
// KPIs generales
db.user_sessions.aggregate([
  {
    $facet: {
      "totalSessions": [{ $count: "count" }],
      "uniqueUsers": [
        { $group: { _id: "$numeroUsuario" } },
        { $count: "count" }
      ],
      "sessionsToday": [
        {
          $match: {
            timestamp: {
              $gte: new Date(new Date().setHours(0,0,0,0))
            }
          }
        },
        { $count: "count" }
      ]
    }
  }
])

// Tasa de completitud
db.quiz_responses.aggregate([
  {
    $group: {
      _id: "$numeroUsuario",
      modulesCompleted: { $sum: 1 }
    }
  },
  {
    $group: {
      _id: null,
      avgModules: { $avg: "$modulesCompleted" },
      completed6Modules: {
        $sum: { $cond: [{ $eq: ["$modulesCompleted", 6] }, 1, 0] }
      },
      totalUsers: { $sum: 1 }
    }
  },
  {
    $project: {
      avgModules: 1,
      completionRate: {
        $multiply: [
          { $divide: ["$completed6Modules", "$totalUsers"] },
          100
        ]
      }
    }
  }
])
```

---

## 📊 VOLÚMENES DE DATOS ESTIMADOS

| Colección | Docs/Mes | Retención | Tamaño Estimado/Año |
|-----------|----------|-----------|---------------------|
| `users` | 10-50 | Permanente | 1 KB × 600 = 600 KB |
| `courses` | 2-5 | Permanente | 50 KB × 60 = 3 MB |
| `user_sessions` | 1,000 | 12 meses | 2 KB × 12,000 = 24 MB |
| `quiz_responses` | 6,000 | Permanente | 5 KB × 72,000 = 360 MB |
| `survey_responses` | 800 | Permanente | 3 KB × 9,600 = 29 MB |
| `active_sessions` | 50-200 | 30 min TTL | 10 KB × 200 = 2 MB |
| `organizations` | 20-100 | Permanente | 2 KB × 1,200 = 2.4 MB |
| `payments` | 50-200 | Permanente | 3 KB × 2,400 = 7.2 MB |
| `campaigns` | 100-500 | Permanente | 20 KB × 6,000 = 120 MB |
| `enrollments` | 5,000-20,000 | Permanente | 10 KB × 240,000 = 2.4 GB |

**Total Estimado/Año:** ~3 GB

---

## 🔐 SEGURIDAD Y MEJORES PRÁCTICAS

### Encriptación de Contraseñas

```javascript
// Usar bcrypt para passwords
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Hash de contraseña
const hash = await bcrypt.hash('password123', saltRounds);

// Verificación
const isValid = await bcrypt.compare('password123', hash);
```

### Validación de Datos

```javascript
// Ejemplo: Validar formato de teléfono
const phoneRegex = /^57[0-9]{10}$/;
if (!phoneRegex.test(numeroUsuario)) {
  throw new Error('Formato de teléfono inválido');
}

// Validar email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Email inválido');
}
```

### Índices para Performance

```javascript
// Crear índices compuestos
db.quiz_responses.createIndex(
  { numeroUsuario: 1, modulo: 1 },
  { unique: true }
);

// Índice de texto para búsqueda
db.courses.createIndex(
  { title: "text", description: "text" },
  { default_language: "spanish" }
);

// TTL index para limpieza automática
db.active_sessions.createIndex(
  { lastActivity: 1 },
  { expireAfterSeconds: 1800 }
);
```

---

## 🚀 SCRIPTS DE INICIALIZACIÓN

### Crear Índices

```javascript
// scripts/create-indexes.js
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.courses.createIndex({ isActive: 1 });
db.quiz_responses.createIndex({ numeroUsuario: 1, modulo: 1 }, { unique: true });
db.active_sessions.createIndex({ phoneNumber: 1 }, { unique: true });
db.active_sessions.createIndex({ lastActivity: 1 }, { expireAfterSeconds: 1800 });
```

### Seed de Datos Básicos

```javascript
// scripts/seed-data.js
const users = [
  {
    email: "super@niblion.com",
    password: "$2a$10$...", // Hash de 'admin123'
    name: "Super Admin",
    role: "super_admin",
    status: "active"
  },
  {
    email: "cliente@demo.com",
    password: "$2a$10$...", // Hash de 'cliente123'
    name: "Cliente Demo",
    role: "client",
    companyName: "Demo Corp",
    credits: 100,
    status: "active"
  }
];

db.users.insertMany(users);
```

---

## 📝 NOTAS IMPORTANTES

1. **Formato de Teléfonos:** Siempre usar formato sin '+' ni espacios (ej: `573001234567`)
2. **Timestamps:** Usar ISODate para fechas, no strings
3. **ObjectIds:** Siempre validar referencias antes de insertar
4. **TTL:** Las sesiones activas se eliminan automáticamente tras 30 minutos
5. **Índices Únicos:** Email en users, phoneNumber en active_sessions
6. **Créditos:** Validar disponibilidad antes de crear campañas
7. **Estados:** Usar enums definidos, no valores arbitrarios
8. **Paginación:** Para queries grandes, usar `.limit()` y `.skip()`

---

## 📞 CONTACTO Y SOPORTE

Para consultas sobre la estructura de datos:
- **Documentación:** `/docs` folder
- **Schemas:** `/backend-nestjs/src/modules/database/schemas`
- **Servicios:** `/backend-nestjs/src/modules/database/database.service.ts`

---

**Última Actualización:** 4 de Noviembre, 2025  
**Versión del Documento:** 1.0  
**Base de Datos:** MongoDB 6.0+
