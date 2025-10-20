# Niblion - Plataforma de Concienciación contra Phishing

Plataforma integral de capacitación en ciberseguridad que combina cursos interactivos por WhatsApp con simulaciones reales de phishing (Gophish), diseñada para proteger a organizaciones contra ataques de ingeniería social.

## � Características Principales

### 💼 Para Empresas
- **Cursos por WhatsApp**: Capacitación interactiva enviada directamente al móvil de cada empleado
- **Simulaciones de Phishing**: Campañas reales con Gophish para evaluar vulnerabilidad
- **Reportes Detallados**: Analítica completa con métricas de progreso y tasas de éxito
- **Modelo Flexible**: Pago por persona ($5.99 USD / Bs. 220 VES por empleado)
- **Multi-idioma**: Plataforma y cursos disponibles en Español e Inglés

### 🎓 Para Empleados
- Módulos cortos y efectivos (completados en minutos)
- Evaluaciones interactivas con feedback inmediato
- Videos educativos y contenido multimedia
- Certificación al completar cursos
- Accesible desde cualquier dispositivo móvil

## 🏗️ Arquitectura

### Frontend (React + Vite + Tailwind)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── LandingPage.jsx       # Homepage de presentación
│   │   ├── Login.jsx              # Autenticación
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx # Panel de administración
│   │   └── client/
│   │       └── ClientDashboard.jsx # Dashboard de cliente
│   ├── components/
│   │   ├── auth/                  # Componentes de autenticación
│   │   ├── layout/                # Layouts y navegación
│   │   ├── payments/              # Sistema de pagos
│   │   └── ui/                    # Componentes reutilizables
│   ├── contexts/
│   │   └── AuthContext.jsx        # Estado de autenticación global
│   ├── services/
│   │   ├── api.js                 # Cliente HTTP (Axios)
│   │   └── paymentService.js      # Servicio de pagos
│   └── utils/
│       └── i18n.js                # Sistema de internacionalización
```

## 🛠️ Tecnologías

### Frontend
- **React 19.1.1** - Biblioteca de interfaz de usuario
- **Vite 7.1.7** - Herramienta de build ultrarrápida
- **React Router 7.9.3** - Enrutamiento del lado del cliente
- **Tailwind CSS 3.4.18** - Framework CSS utilitario
- **Axios 1.6.0** - Cliente HTTP
- **Multi-idioma**: Sistema i18n personalizado (ES/EN)

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **JWT** - Autenticación con tokens
- **Bull + Redis** - Cola de mensajes para WhatsApp (recomendado)

### Servicios Externos
- **WhatsApp Business API** - Envío de cursos interactivos
- **Gophish** - Simulaciones de phishing
- **PayPal** - Pagos automáticos
- **Pago Móvil Venezuela** - Pagos manuales
- **Transferencias Bancarias** - Pagos manuales

## 🎨 Interfaz de Usuario

### Landing Page (Homepage)
La página de inicio presenta el producto de forma profesional con:
- Hero section con estadísticas de impacto
- 6 características principales del producto
- Proceso paso a paso (How it Works)
- Información de precios transparente
- Formulario de contacto
- Footer completo con información legal

👉 **Ver documentación completa**: [docs/LANDING_PAGE.md](docs/LANDING_PAGE.md)

### Panel de Administración
Dashboard completo para administradores con:
- Gestión de clientes y organizaciones
- Administración de cursos y contenido
- Control de licencias y créditos
- Gestión de campañas
- Reportes y analíticas avanzadas
- Aprobación de pagos manuales

### Panel de Cliente
Dashboard para empresas con:
- Catálogo de cursos disponibles
- Compra de créditos (3 métodos de pago)
- Creación y gestión de campañas
- Seguimiento de progreso en tiempo real
- Reportes por empleado y departamento

## 📋 Requisitos

- Node.js 18+ 
- MongoDB 6+
- Cuenta de WhatsApp Business
- Meta Developer App configurada

## 🔧 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd Niblion
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install

# Configurar variables de entorno
cp .env.example .env
```

### 4. Inicializar Base de Datos
```bash
# Asegurarse de que MongoDB esté corriendo
cd backend
node scripts/seed_database.js
```

### 5. Variables de Entorno
Ver archivo `.env.example` en cada carpeta para la configuración completa.

**📝 Ver credenciales de prueba**: [docs/CREDENCIALES_PRUEBA.md](docs/CREDENCIALES_PRUEBA.md)
```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/niblion_security

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN=tu_verify_token_aquí
WHATSAPP_ACCESS_TOKEN=tu_access_token_permanente
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
META_APP_ID=tu_app_id
META_APP_SECRET=tu_app_secret

# Configuración del Sistema
SESSION_TIMEOUT_MINUTES=30
MAX_CONCURRENT_SESSIONS=100
LOG_LEVEL=info
```

## 🚀 Ejecución

### Desarrollo
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Acceder a:
- **Landing Page**: http://localhost:5173
- **Panel Admin**: http://localhost:5173/admin (después de login)
- **Panel Cliente**: http://localhost:5173/client (después de login)
- **Backend API**: http://localhost:3000

### Producción
```bash
# Backend
cd backend
npm start

# Frontend (build)
cd frontend
npm run build
npm run preview
```

## 💳 Sistema de Pagos

### Precios
- **$5.99 USD** por persona
- **Bs. 220 VES** por persona (Venezuela)

**Incluye:**
- 1 curso completo vía WhatsApp
- 1 simulación de phishing con Gophish
- Reportes y analítica detallada

### Métodos de Pago

1. **PayPal** (Automático)
   - Procesamiento instantáneo
   - Créditos agregados automáticamente
   
2. **Pago Móvil Venezuela** (Manual)
   - Requiere número de referencia
   - Verificación por administrador
   - 24-48 horas de aprobación

3. **Transferencia Bancaria** (Manual)
   - USD o VES
   - Upload de comprobante
   - Verificación por administrador

👉 **Ver documentación completa**: [docs/PAYMENT_SYSTEM.md](docs/PAYMENT_SYSTEM.md)

## 🌍 Internacionalización

Sistema i18n personalizado con soporte completo para:
- **Español (ES)**: Idioma por defecto
- **Inglés (EN)**: Traducción completa

### Uso en componentes
```jsx
import { useTranslation } from '../utils/i18n';

function MyComponent() {
  const { t, language, setLanguage } = useTranslation();
  
  return (
    <div>
      <h1>{t('landing.hero.title')}</h1>
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  );
}
```

## ⚠️ Rate Limiting y Optimización

### Recomendaciones para WhatsApp API
- **Máximo 5 mensajes/segundo**
- **Máximo 500 personas por campaña**
- Usar cola de mensajes (Bull + Redis)
- Implementar retry con backoff exponencial

### Arquitectura de Cola
```javascript
// Procesamiento de mensajes
const messageQueue = new Queue('whatsapp-messages');

messageQueue.process(async (job) => {
  const { phoneNumber, message } = job.data;
  await whatsappService.sendMessage(phoneNumber, message);
  await delay(200); // 5 msg/sec limit
});
```

👉 **Ver arquitectura completa**: [docs/ARQUITECTURA_COMPLETA.md](docs/ARQUITECTURA_COMPLETA.md)

## 📊 Uso del Sistema

### 1. Para Visitantes (Landing Page)
1. Visitar la homepage en `/`
2. Explorar características, precios y proceso
3. Llenar formulario de contacto para solicitar demo
4. Recibir acceso a la plataforma

### 2. Para Clientes (Empresas)
1. **Login**: Acceder en `/login` con credenciales
2. **Comprar créditos**: Ir a "Comprar Créditos" y seleccionar método de pago
3. **Crear campaña**: 
   - Seleccionar curso del catálogo
   - Agregar lista de empleados (CSV o manual)
   - Configurar fechas de inicio/fin
   - Enviar campaña
4. **Monitorear progreso**: Ver seguimiento en tiempo real
5. **Analizar resultados**: Revisar reportes y métricas

### 3. Para Administradores
1. **Gestionar clientes**: Aprobar registros, asignar licencias
2. **Administrar cursos**: Crear/editar contenido educativo
3. **Aprobar pagos**: Verificar Pago Móvil y transferencias
4. **Monitorear sistema**: Dashboard con métricas globales
5. **Generar reportes**: Exportar analíticas generales

## 🔌 API Endpoints

### Públicos
```http
GET  /                        - Landing page
POST /api/public/contact      - Formulario de contacto
```

### Autenticación
```http
POST /api/auth/login          - Login (JWT)
POST /api/auth/refresh        - Refresh token
POST /api/auth/logout         - Cerrar sesión
```

### Cliente
```http
GET    /api/client/courses           - Catálogo de cursos
GET    /api/client/credits           - Créditos disponibles
POST   /api/client/campaigns         - Crear campaña
GET    /api/client/campaigns         - Listar campañas
GET    /api/client/campaigns/:id     - Detalle de campaña
POST   /api/payments/paypal/create   - Iniciar pago PayPal
POST   /api/payments/mobile          - Registrar Pago Móvil
POST   /api/payments/bank-transfer   - Registrar transferencia
GET    /api/payments/:id/status      - Estado de pago
```

### Admin
```http
GET    /api/admin/clients            - Lista de clientes
GET    /api/admin/payments/pending   - Pagos pendientes
PUT    /api/admin/payments/:id       - Aprobar/rechazar pago
POST   /api/admin/courses            - Crear curso
PUT    /api/admin/courses/:id        - Editar curso
GET    /api/admin/analytics          - Analítica global
```

### WhatsApp
```http
GET  /webhook                  - Verificación de webhook
POST /webhook                  - Recepción de mensajes
```

### Sistema
```http
GET  /health                   - Estado del sistema
```

## 🏃‍♂️ Flujo de Usuario

### Para Empresas (B2B)
1. **Descubrimiento**: Visitar landing page, conocer el producto
2. **Contacto**: Solicitar demo o información
3. **Registro**: Crear cuenta de organización
4. **Compra**: Adquirir créditos según empleados a capacitar
5. **Configuración**: Crear campaña y cargar lista de empleados
6. **Ejecución**: Sistema envía cursos por WhatsApp
7. **Monitoreo**: Seguir progreso en tiempo real
8. **Resultados**: Analizar métricas y descargar reportes

### Para Empleados (WhatsApp)
1. **Recepción**: Recibir mensaje de bienvenida en WhatsApp
2. **Inicio**: Leer introducción del curso
3. **Aprendizaje**: Consumir módulos educativos con videos
4. **Evaluación**: Responder cuestionarios interactivos
5. **Feedback**: Recibir correcciones y explicaciones
6. **Certificación**: Completar curso y obtener certificado
7. **Simulación**: Participar en campaña de phishing simulado
8. **Resultados**: Conocer desempeño final

## 📈 Métricas y Analytics

### Dashboard Ejecutivo (Admin)
- Total de clientes activos
- Ingresos por mes
- Créditos vendidos vs. utilizados
- Tasa de conversión de contactos
- Cursos más populares

### Dashboard de Cliente
- Empleados capacitados / Total
- Tasa de completación de cursos
- Resultados de simulaciones de phishing
- Empleados vulnerables (clickearon phishing)
- Empleados resilientes (reportaron phishing)
- Progreso por departamento
- Tiempo promedio de completación

### KPIs del Sistema
- Mensajes enviados por día
- Tasa de entrega de WhatsApp
- Tiempo de respuesta promedio
- Uptime del sistema
- Uso de créditos

## 📚 Documentación Adicional

Este repositorio incluye documentación detallada en la carpeta `/docs`:

- **[LANDING_PAGE.md](docs/LANDING_PAGE.md)**: Guía completa de la homepage
- **[ARQUITECTURA_COMPLETA.md](docs/ARQUITECTURA_COMPLETA.md)**: Arquitectura técnica del sistema
- **[PAYMENT_SYSTEM.md](docs/PAYMENT_SYSTEM.md)**: Sistema de pagos y métodos
- **[DATABASE_ARCHITECTURE.md](docs/DATABASE_ARCHITECTURE.md)**: Esquemas de MongoDB
- **[VISUAL_ARCHITECTURE.md](docs/VISUAL_ARCHITECTURE.md)**: Diagramas visuales

## 🔒 Seguridad

### Implementado
- ✅ Autenticación JWT con refresh tokens
- ✅ RBAC (Role-Based Access Control)
- ✅ HTTPS en producción
- ✅ Encriptación de datos sensibles
- ✅ Validación de tokens de WhatsApp
- ✅ Sanitización de inputs
- ✅ Rate limiting en endpoints

### Recomendado para Producción
- 🔲 2FA (Two-Factor Authentication)
- 🔲 Auditoría de logs completa
- 🔲 WAF (Web Application Firewall)
- � Monitoreo de seguridad (Sentry, LogRocket)
- 🔲 Backup automático de MongoDB
- 🔲 Disaster Recovery Plan

## 🚀 Roadmap

### Versión 1.0 (Actual)
- ✅ Landing page profesional
- ✅ Sistema de autenticación
- ✅ Dashboards (Admin + Cliente)
- ✅ Sistema de pagos multi-método
- ✅ Multi-idioma (ES/EN)
- ✅ Integración WhatsApp (estructura)
- ✅ Integración Gophish (estructura)

### Versión 1.1 (Q1 2025)
- 🔲 Backend API completo
- 🔲 Cola de mensajes (Bull + Redis)
- 🔲 Integración PayPal funcional
- 🔲 Sistema de aprobación de pagos
- 🔲 Exportación de reportes (PDF/CSV)
- 🔲 Envío de notificaciones por email

### Versión 2.0 (Q2 2025)
- 🔲 Editor de cursos WYSIWYG
- 🔲 Plantillas de phishing personalizables
- 🔲 Integración con Slack/Teams
- 🔲 Gamificación (badges, leaderboards)
- 🔲 API pública para integraciones
- 🔲 Mobile app nativa

## 📄 Modelos de Datos

### Organization (Cliente)
```javascript
{
  name: String,
  email: String,
  peopleCredits: Number,        // Créditos disponibles
  totalPurchased: Number,       // Total histórico
  paymentMethods: [String],
  subscriptionTier: String,
  createdAt: Date
}
```

### Payment (Pago)
```javascript
{
  organizationId: ObjectId,
  method: String,               // 'paypal' | 'mobile' | 'bank'
  amount: Number,
  currency: String,             // 'USD' | 'VES'
  peopleCredits: Number,
  status: String,               // 'pending' | 'approved' | 'rejected'
  referenceNumber: String,
  receiptUrl: String,
  createdAt: Date
}
```

### Campaign (Campaña)
```javascript
{
  organizationId: ObjectId,
  courseId: ObjectId,
  name: String,
  people: [{
    name: String,
    phone: String,
    email: String,
    department: String
  }],
  status: String,               // 'pending' | 'active' | 'completed'
  startDate: Date,
  endDate: Date,
  creditsUsed: Number
}
```

### Course (Curso)
```javascript
{
  title: { es: String, en: String },
  description: { es: String, en: String },
  modules: [{
    title: String,
    content: String,
    videoUrl: String,
    questions: [{
      text: String,
      options: [String],
      correctAnswer: Number
    }]
  }],
  level: String,                // 'basic' | 'intermediate' | 'advanced'
  durationMinutes: Number
}
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear feature branch (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para reportar bugs o solicitar características:
1. Crear issue en el repositorio
2. Incluir logs relevantes
3. Describir pasos para reproducir
4. Especificar entorno (Node.js, OS, etc.)

---

**Desarrollado con ❤️ para la concientización en ciberseguridad**