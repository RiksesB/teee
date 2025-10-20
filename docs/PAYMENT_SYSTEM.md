# 📊 MODELOS DE DATOS ACTUALIZADOS - MONGODB

## Sistema de Pago por Persona + Gophish

### 1. **Organizations (Clientes)**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  industry: String,
  
  // Sistema de créditos por persona
  peopleCredits: {
    available: Number,      // Créditos disponibles
    total: Number,          // Total histórico comprado
    used: Number,           // Créditos ya usados
  },
  
  subscriptionStatus: Enum ['active', 'trial', 'suspended'],
  subscriptionStartDate: Date,
  
  // Configuración
  settings: {
    defaultLanguage: Enum ['es', 'en'],
    timezone: String,
    notifications: {
      email: Boolean,
      sms: Boolean,
    }
  },
  
  createdAt: Date,
  updatedAt: Date,
}
```

### 2. **Payments (Pagos)**
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (ref: Organizations),
  userId: ObjectId (ref: Users),
  
  // Detalles de compra
  numberOfPeople: Number,         // Cantidad de personas compradas
  pricePerPerson: Number,         // Precio unitario
  totalAmount: Number,            // Total pagado
  currency: Enum ['USD', 'VES'],
  
  // Método de pago
  paymentMethod: Enum ['paypal', 'mobile_payment', 'bank_transfer'],
  
  // Detalles específicos según método
  paymentDetails: {
    // PayPal
    paypalTransactionId: String,
    paypalPayerId: String,
    paypalOrderId: String,
    
    // Pago Móvil (Venezuela)
    mobilePhone: String,
    mobileBank: String,          // Código banco (ej: 0102)
    mobileReference: String,
    mobileDate: Date,
    
    // Transferencia Bancaria
    bankName: String,
    accountHolder: String,
    bankReference: String,
    transferDate: Date,
    receiptUrl: String,          // URL del comprobante en storage
  },
  
  // Estado del pago
  status: Enum ['pending', 'processing', 'completed', 'failed', 'refunded'],
  
  // Verificación manual (para pago móvil y transferencias)
  verification: {
    required: Boolean,
    verifiedBy: ObjectId (ref: Users),  // Admin que verificó
    verifiedAt: Date,
    notes: String,
  },
  
  // Facturación
  invoice: {
    number: String,
    url: String,
    issuedAt: Date,
  },
  
  createdAt: Date,
  updatedAt: Date,
  
  // Índices
  indexes: [
    { organizationId: 1, createdAt: -1 },
    { status: 1 },
    { "paymentDetails.paypalTransactionId": 1 },
  ]
}
```

### 3. **Campaigns (Campañas con Gophish)**
```javascript
{
  _id: ObjectId,
  name: String,
  organizationId: ObjectId (ref: Organizations),
  courseId: ObjectId (ref: Courses),
  
  // Personas objetivo
  targetPeople: [{
    phone: String (E.164 format: +58412XXXXXXX),
    name: String,
    email: String,
    department: String,
    customFields: Object,
  }],
  
  // Gestión de créditos
  creditsUsed: Number,            // Personas × 1 crédito c/u
  
  // Fechas
  startDate: Date,
  endDate: Date,
  scheduledSendTime: Date,
  
  // Estado
  status: Enum ['draft', 'scheduled', 'active', 'completed', 'cancelled'],
  
  // Progreso WhatsApp
  whatsappProgress: {
    total: Number,
    sent: Number,
    delivered: Number,
    read: Number,
    replied: Number,
    failed: Number,
  },
  
  // Integración Gophish
  gophishCampaign: {
    campaignId: String,           // ID en Gophish
    simulationType: Enum ['email_phishing', 'smishing', 'vishing'],
    templateId: String,
    landingPageId: String,
    smtpId: String,
    
    // Resultados de simulación
    results: {
      emailsSent: Number,
      emailsOpened: Number,
      linksClicked: Number,
      dataSubmitted: Number,
      reportedByUsers: Number,
    },
    
    launchedAt: Date,
    completedAt: Date,
  },
  
  // Estadísticas combinadas
  overallStats: {
    courseCompletionRate: Number,
    phishingClickRate: Number,    // De Gophish
    improvementScore: Number,      // Comparación pre/post
  },
  
  createdBy: ObjectId (ref: Users),
  createdAt: Date,
  updatedAt: Date,
  
  indexes: [
    { organizationId: 1, status: 1 },
    { startDate: 1 },
    { "gophishCampaign.campaignId": 1 },
  ]
}
```

### 4. **Enrollments (Inscripciones individuales)**
```javascript
{
  _id: ObjectId,
  campaignId: ObjectId (ref: Campaigns),
  courseId: ObjectId (ref: Courses),
  organizationId: ObjectId (ref: Organizations),
  
  // Datos del empleado
  person: {
    phone: String,
    name: String,
    email: String,
    department: String,
  },
  
  // Progreso del curso (WhatsApp)
  courseProgress: {
    status: Enum ['not_started', 'in_progress', 'completed', 'failed'],
    currentModule: Number,
    completedModules: [Number],
    quizScores: [{
      moduleId: Number,
      score: Number,
      maxScore: Number,
      attempts: Number,
      completedAt: Date,
    }],
    totalScore: Number,
    maxScore: Number,
    passingScore: Number,
    passed: Boolean,
  },
  
  // Resultados de simulación Gophish
  phishingSimulation: {
    targetEmail: String,           // Email usado en Gophish
    gophishResultId: String,
    
    // Eventos registrados
    events: [{
      eventType: Enum ['email_sent', 'email_opened', 'link_clicked', 'data_submitted', 'email_reported'],
      timestamp: Date,
      ipAddress: String,
      userAgent: String,
      details: Object,
    }],
    
    // Resumen
    summary: {
      emailOpened: Boolean,
      linkClicked: Boolean,
      dataSubmitted: Boolean,
      reportedPhishing: Boolean,    // ¡Lo reportó correctamente!
      clickTime: Number,             // Tiempo hasta click (segundos)
      riskLevel: Enum ['high', 'medium', 'low'],
    },
    
    simulationDate: Date,
  },
  
  // Análisis combinado
  analysis: {
    preTestScore: Number,           // Antes de curso
    postTestScore: Number,          // Después de curso
    improvement: Number,            // Porcentaje de mejora
    phishingResistance: Boolean,    // No cayó en phishing
    certificateEarned: Boolean,
    certificateUrl: String,
  },
  
  // Timestamps
  startedAt: Date,
  completedAt: Date,
  lastActivityAt: Date,
  
  createdAt: Date,
  updatedAt: Date,
  
  indexes: [
    { campaignId: 1, "person.phone": 1 },
    { organizationId: 1, "courseProgress.status": 1 },
    { "phishingSimulation.gophishResultId": 1 },
  ]
}
```

### 5. **Courses (Cursos con Simulación)**
```javascript
{
  _id: ObjectId,
  title: {
    es: String,
    en: String,
  },
  description: {
    es: String,
    en: String,
  },
  
  level: Enum ['básico', 'intermedio', 'avanzado'],
  category: Enum ['phishing', 'social_engineering', 'password_security', 'data_protection'],
  
  // Módulos del curso
  modules: [{
    id: String,
    title: { es: String, en: String },
    description: { es: String, en: String },
    videoUrl: String,
    duration: Number,                // Segundos
    
    // Quiz por módulo
    questions: [{
      id: String,
      type: Enum ['multiple_choice', 'true_false', 'scenario'],
      text: { es: String, en: String },
      options: [{ es: String, en: String }],
      correctAnswer: String,
      explanation: { es: String, en: String },
      points: Number,
    }],
  }],
  
  // Simulación Gophish asociada
  phishingSimulation: {
    enabled: Boolean,
    timing: Enum ['before_course', 'after_course', 'both'],
    
    // Templates de Gophish
    templates: [{
      language: Enum ['es', 'en'],
      gophishTemplateId: String,
      gophishLandingPageId: String,
      difficulty: Enum ['easy', 'medium', 'hard'],
    }],
  },
  
  // Configuración
  totalDuration: Number,
  passingScore: Number,              // Porcentaje mínimo para aprobar
  certificateTemplate: String,
  
  // Metadatos
  status: Enum ['draft', 'published', 'archived'],
  version: Number,
  createdBy: ObjectId (ref: Users),
  
  // Estadísticas
  stats: {
    totalEnrollments: Number,
    averageScore: Number,
    completionRate: Number,
    phishingSuccessRate: Number,     // % que NO cayó en phishing
  },
  
  createdAt: Date,
  updatedAt: Date,
  publishedAt: Date,
  
  indexes: [
    { status: 1, level: 1 },
    { category: 1 },
  ]
}
```

### 6. **GophishIntegration (Configuración)**
```javascript
{
  _id: ObjectId,
  organizationId: ObjectId (ref: Organizations),
  
  // Credenciales Gophish
  gophishConfig: {
    apiUrl: String,
    apiKey: String,                  // Encriptado
    isActive: Boolean,
    lastSync: Date,
  },
  
  // Templates disponibles
  availableTemplates: [{
    gophishId: String,
    name: String,
    language: Enum ['es', 'en'],
    difficulty: Enum ['easy', 'medium', 'hard'],
  }],
  
  // Landing pages
  landingPages: [{
    gophishId: String,
    name: String,
    captureCredentials: Boolean,
    capturePasswords: Boolean,
    redirectUrl: String,
  }],
  
  // SMTP profiles
  smtpProfiles: [{
    gophishId: String,
    name: String,
    fromAddress: String,
    host: String,
  }],
  
  createdAt: Date,
  updatedAt: Date,
}
```

---

## 📡 **RATE LIMITING RECOMENDADO**

### **WhatsApp API Limits**

```javascript
// Límites oficiales de WhatsApp Business API
const WHATSAPP_LIMITS = {
  // Límite por número de teléfono
  messagesPerSecond: 20,           // 20 msg/seg
  messagesPerHour: 1000,           // 1000 msg/hora
  messagesPerDay: 100000,          // 100k msg/día (tier business)
  
  // Para evitar sobrecarga, límites internos más conservadores
  RECOMMENDED: {
    messagesPerSecond: 5,          // 5 msg/seg (seguro)
    messagesPerMinute: 100,        // 100 msg/min
    messagesPerCampaign: 500,      // Max 500 personas por campaña
    concurrentCampaigns: 5,        // Max 5 campañas activas
  }
};
```

### **Implementación en Backend**

```javascript
// backend/src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Rate limiter para API general
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:',
  }),
  windowMs: 15 * 60 * 1000,        // 15 minutos
  max: 100,                         // 100 requests por IP
  message: 'Demasiadas peticiones, intenta de nuevo más tarde',
});

// Rate limiter para autenticación
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:',
  }),
  windowMs: 60 * 60 * 1000,        // 1 hora
  max: 5,                           // 5 intentos de login
  skipSuccessfulRequests: true,
  message: 'Demasiados intentos de login, intenta en 1 hora',
});

// Rate limiter para creación de campañas
export const campaignLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:campaign:',
  }),
  windowMs: 60 * 60 * 1000,        // 1 hora
  max: 10,                          // 10 campañas por hora
  message: 'Límite de campañas alcanzado, espera 1 hora',
});

// Rate limiter para compras
export const purchaseLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:purchase:',
  }),
  windowMs: 60 * 60 * 1000,        // 1 hora
  max: 5,                           // 5 compras por hora
  message: 'Límite de compras alcanzado',
});
```

### **Cola de Mensajes WhatsApp**

```javascript
// backend/src/infrastructure/queues/whatsappQueue.js
import Bull from 'bull';

export const whatsappQueue = new Bull('whatsapp-messages', {
  redis: process.env.REDIS_URL,
  limiter: {
    max: 5,              // 5 mensajes
    duration: 1000,      // por segundo
  },
});

// Procesar mensajes
whatsappQueue.process(async (job) => {
  const { phone, message, campaignId } = job.data;
  
  try {
    await whatsappService.sendMessage(phone, message);
    
    // Registrar envío exitoso
    await Campaign.updateOne(
      { _id: campaignId },
      { 
        $inc: { 'whatsappProgress.sent': 1 },
        $set: { updatedAt: new Date() }
      }
    );
    
    return { success: true, phone };
  } catch (error) {
    // Reintentar con backoff exponencial
    if (job.attemptsMade < 3) {
      throw error;
    }
    
    // Registrar fallo
    await Campaign.updateOne(
      { _id: campaignId },
      { $inc: { 'whatsappProgress.failed': 1 } }
    );
    
    return { success: false, phone, error: error.message };
  }
});

// Agregar mensajes a la cola
export const queueCampaignMessages = async (campaign) => {
  const delay = 0;
  const priority = campaign.priority || 5;
  
  for (const person of campaign.targetPeople) {
    await whatsappQueue.add(
      {
        phone: person.phone,
        message: generateWelcomeMessage(person, campaign),
        campaignId: campaign._id,
      },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        priority,
        delay: delay,
      }
    );
  }
};
```

---

## ✅ **RECOMENDACIONES FINALES**

### **Límites por Campaña**
- **Máximo recomendado**: 500 personas por campaña
- **Óptimo**: 100-200 personas por campaña
- **Razón**: Mejor control, seguimiento más detallado, evita sobrecarga

### **Límites Técnicos**
```javascript
const CAMPAIGN_LIMITS = {
  maxPeoplePerCampaign: 500,
  maxConcurrentCampaigns: 5,
  maxCampaignsPerDay: 10,
  minDelayBetweenMessages: 200,    // 200ms entre mensajes
};
```

### **Monitoreo de Salud**
```javascript
// Dashboard admin debe mostrar:
- Messages sent per second (actual vs limit)
- Queue size
- Failed message rate
- WhatsApp API health status
- Alerts si se acerca a límites
```

¿Necesitas que implemente alguna de estas funcionalidades específicas?
