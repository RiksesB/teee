# Niblion Security Training Platform

Plataforma integral de concientización en seguridad que combina un chatbot de WhatsApp con un panel de administración web, construida con arquitectura limpia y diseño modular monolítico.

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** con un enfoque de **monolito modular**, separando claramente las responsabilidades en capas bien definidas:

### Backend (Clean Architecture)
```
backend/
├── src/
│   ├── domain/           # Entidades y reglas de negocio
│   │   └── entities/     # Módulos, preguntas, sesiones
│   ├── application/      # Casos de uso
│   │   └── use-cases/    # Lógica de aplicación
│   ├── infrastructure/   # Implementaciones externas
│   │   ├── database/     # Repositorios MongoDB
│   │   └── services/     # APIs externas (WhatsApp)
│   ├── presentation/     # Controladores y rutas
│   │   └── controllers/  # HTTP handlers
│   └── shared/          # Configuración y DI
└── server.js            # Punto de entrada
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   └── layout/      # Navegación y estructura
│   ├── pages/          # Páginas principales
│   │   ├── Dashboard.jsx
│   │   ├── CampaignManager.jsx
│   │   ├── Analytics.jsx
│   │   └── Settings.jsx
│   └── App.jsx         # Configuración de rutas
└── package.json
```

## 🚀 Características

### Chatbot de WhatsApp
- ✅ **Módulos de Capacitación**: 4 módulos de seguridad interactivos
- ✅ **Gestión de Sesiones**: Control de progreso por usuario
- ✅ **Cuestionarios Interactivos**: Evaluación con feedback inmediato
- ✅ **Videos Educativos**: Enlaces a contenido multimedia
- ✅ **Webhooks**: Integración completa con WhatsApp Business API

### Panel de Administración Web
- ✅ **Dashboard en Tiempo Real**: Monitoreo de sesiones activas
- ✅ **Gestor de Campañas**: Envío masivo y programado
- ✅ **Analytics Avanzado**: Estadísticas detalladas y reportes
- ✅ **Configuración Central**: Administración de servicios externos
- ✅ **Interfaz Responsiva**: Tailwind CSS con diseño moderno

### Características Técnicas
- ✅ **Inyección de Dependencias**: Desacoplamiento total de capas
- ✅ **Gestión de Configuración**: Variables de entorno centralizadas
- ✅ **Health Checks**: Monitoreo del estado del sistema
- ✅ **Logging Estructurado**: Trazabilidad completa
- ✅ **Manejo de Errores**: Recuperación resiliente

## 🛠️ Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **MongoDB** - Base de datos NoSQL
- **Axios** - Cliente HTTP para APIs externas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de build ultrarrápida
- **React Router** - Enrutamiento del lado del cliente
- **Tailwind CSS** - Framework CSS utilitario
- **Heroicons** - Iconografía moderna

### Servicios Externos
- **WhatsApp Business API** - Mensajería
- **Meta Developer Platform** - Webhooks y autenticación

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
```

### 4. Variables de Entorno
Crear `backend/.env` con:
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

## 📊 Uso del Sistema

### 1. Configuración Inicial
1. Acceder al panel web en `http://localhost:5173`
2. Ir a **Configuración** y completar credenciales de WhatsApp
3. Probar la conexión con los servicios externos

### 2. Crear Campañas
1. Ir a **Gestor de Campañas**
2. Seleccionar **Nueva Campaña** o usar **Envío Rápido**
3. Cargar lista de números telefónicos
4. Seleccionar módulo de capacitación
5. Enviar y monitorear progreso

### 3. Monitoreo
1. **Dashboard**: Vista general en tiempo real
2. **Analytics**: Reportes detallados y métricas
3. Exportar datos en CSV o PDF

## 🔌 API Endpoints

### Webhooks de WhatsApp
```http
GET  /webhook - Verificación de webhook
POST /webhook - Recepción de mensajes
```

### API de Gestión
```http
GET    /api/statistics      - Estadísticas del sistema
POST   /api/send-batch      - Envío masivo de mensajes
GET    /api/campaigns       - Lista de campañas
GET    /api/analytics       - Datos de análisis
PUT    /api/config          - Actualizar configuración
GET    /health              - Estado del sistema
```

## 🏃‍♂️ Flujo de Usuario (WhatsApp)

1. **Inicio**: Usuario envía mensaje al chatbot
2. **Bienvenida**: Sistema presenta módulos disponibles
3. **Selección**: Usuario elige módulo de interés
4. **Capacitación**: Contenido educativo + videos
5. **Evaluación**: Cuestionario interactivo
6. **Resultados**: Feedback y certificación
7. **Progreso**: Avance al siguiente módulo

## 📈 Métricas y Analytics

El sistema recopila:
- Sesiones activas por estado
- Distribución de usuarios por módulo
- Tasas de completación y puntuaciones
- Tiempos promedio de finalización
- Patrones de uso horarios
- Tendencias de participación

## 🔒 Seguridad

- Validación de tokens de WhatsApp
- Verificación de firmas de webhook
- Sanitización de inputs de usuario
- Rate limiting en endpoints críticos
- Logs de auditoría completos

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