# 🎨 Arquitectura Visual del Sistema Niblion

## 🏗️ Vista General de la Arquitectura Clean

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            🌟 SISTEMA NIBLION SECURITY PLATFORM 🌟                   │
│                          Plataforma de Concientización en Seguridad                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

🌐 ACTORES EXTERNOS                    🏗️ SISTEMA INTERNO                    📊 SERVICIOS
┌─────────────────┐                   ┌─────────────────────────────────┐    ┌─────────────┐
│                 │                   │                                 │    │             │
│  👤 Usuario     │ ◄─── WhatsApp ───►│        NIBLION CORE             │◄──►│ 📱 Meta API │
│   WhatsApp      │                   │                                 │    │             │
│                 │                   │  🎯 Backend (Node.js)           │    │ 🗄️ MongoDB  │
└─────────────────┘                   │  ⚛️ Frontend (React)            │    │             │
                                      │  🔬 Simulations (Gophis)       │    │ 🎥 Videos   │
┌─────────────────┐                   │                                 │    │             │
│                 │                   │                                 │    │             │
│ 👩‍💼 Admin        │ ◄─── HTTPS ──────►│                                 │    │             │
│   Dashboard     │                   │                                 │    │             │
│                 │                   │                                 │    │             │
└─────────────────┘                   └─────────────────────────────────┘    └─────────────┘
```

## 🏛️ Arquitectura Clean en Capas - Vista Detallada

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              🎯 CLEAN ARCHITECTURE LAYERS                            │
└─────────────────────────────────────────────────────────────────────────────────────┘

🌐 PRESENTATION LAYER (Frameworks & Drivers)
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ║
║  │ 🖥️ React        │  │ 📱 WhatsApp     │  │ 🔗 REST API     │  │ 🌐 HTTP Routes  │  ║
║  │   Dashboard     │  │   Webhook       │  │   Endpoints     │  │   & Middleware  │  ║
║  │                 │  │                 │  │                 │  │                 │  ║
║  │ • Dashboard     │  │ • Message       │  │ • /api/stats    │  │ • CORS          │  ║
║  │ • Campaigns     │  │   Handler       │  │ • /api/batch    │  │ • Auth          │  ║
║  │ • Analytics     │  │ • Webhook       │  │ • /api/config   │  │ • Validation    │  ║
║  │ • Settings      │  │   Validation    │  │ • /health       │  │ • Error Handle  │  ║
║  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
                                          ⬇️ Dependency Flow ⬇️

🎯 APPLICATION LAYER (Use Cases & Services)
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ║
║  │ 📚 Course       │  │ ✅ Answer       │  │ ❓ Question     │  │ 📊 Analytics    │  ║
║  │   Use Cases     │  │   Processing    │  │   Management    │  │   Use Cases     │  ║
║  │                 │  │                 │  │                 │  │                 │  ║
║  │ • StartCourse   │  │ • ProcessAnswer │  │ • SendQuestion  │  │ • GetStats      │  ║
║  │ • SelectModule  │  │ • ValidateResp  │  │ • NextQuestion  │  │ • GenerateReport│  ║
║  │ • TrackProgress │  │ • CalculateScore│  │ • ShowVideo     │  │ • ExportData    │  ║
║  │ • SendCert      │  │ • GiveFeedback  │  │ • ShowOptions   │  │ • UserMetrics   │  ║
║  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘  ║
║                                                                                      ║
║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ║
║  │ 🚀 Campaign     │  │ ⚙️ Session      │  │ 🔬 Simulation   │  │ 📈 Reporting    │  ║
║  │   Management    │  │   Services      │  │   Services      │  │   Services      │  ║
║  │                 │  │                 │  │                 │  │                 │  ║
║  │ • CreateBatch   │  │ • SessionMgmt   │  │ • RunGophis     │  │ • PDFGenerator  │  ║
║  │ • SendMassive   │  │ • StateManager  │  │ • ScenarioMgmt  │  │ • CSVExporter   │  ║
║  │ • ScheduleCamp  │  │ • TimeoutMgmt   │  │ • ResultAnalysis│  │ • ChartGenerator│  ║
║  │ • TrackCamp     │  │ • CleanupSvc    │  │ • UserProgress  │  │ • EmailReports  │  ║
║  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
                                          ⬇️ Dependency Flow ⬇️

🏛️ DOMAIN LAYER (Business Logic & Entities)
╔══════════════════════════════════════════════════════════════════════════════════════╗
║                                    👑 CORE BUSINESS LOGIC 👑                          ║
║                                                                                      ║
║  ┌─────────────────────────────────────────────────────────────────────────────────┐║
║  │                               🎓 ENTITIES                                        │║
║  │                                                                                 │║
║  │  📖 Module              ❓ Question            👤 UserSession      📋 Survey    │║
║  │  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐    ┌─────────────┐│║
║  │  │ • id        │       │ • id        │       │ • phoneNum  │    │ • id        ││║
║  │  │ • title     │       │ • text      │       │ • moduleId  │    │ • questions ││║
║  │  │ • content   │       │ • options   │       │ • state     │    │ • responses ││║
║  │  │ • videoUrl  │       │ • correct   │       │ • score     │    │ • timestamp ││║
║  │  │ • questions │       │ • type      │       │ • answers   │    │ • metadata  ││║
║  │  │ • duration  │       │ • points    │       │ • progress  │    │ • userId    ││║
║  │  └─────────────┘       └─────────────┘       └─────────────┘    └─────────────┘│║
║  └─────────────────────────────────────────────────────────────────────────────────┘║
║                                                                                      ║
║  ┌─────────────────────────────────────────────────────────────────────────────────┐║
║  │                            📏 BUSINESS RULES                                    │║
║  │                                                                                 │║
║  │  🎯 Scoring Rules       📊 Progress Rules      🔐 Validation Rules             │║
║  │  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐                  │║
║  │  │ • MinScore  │       │ • Completion│       │ • Input Val │                  │║
║  │  │ • MaxScore  │       │ • Sequence  │       │ • Phone Val │                  │║
║  │  │ • WeightPts │       │ • Time Lmt  │       │ • State Val │                  │║
║  │  │ • PassThresh│       │ • Retry Lmt │       │ • Data Integrity                │║
║  │  └─────────────┘       └─────────────┘       └─────────────┘                  │║
║  └─────────────────────────────────────────────────────────────────────────────────┘║
╚══════════════════════════════════════════════════════════════════════════════════════╝
                                          ⬇️ Dependency Flow ⬇️

🔧 INFRASTRUCTURE LAYER (External Interfaces)
╔══════════════════════════════════════════════════════════════════════════════════════╗
║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ║
║  │ 🗄️ Database     │  │ 📱 External     │  │ 🎥 File         │  │ ⚙️ Configuration│  ║
║  │   Layer         │  │   APIs          │  │   Storage       │  │   Management    │  ║
║  │                 │  │                 │  │                 │  │                 │  ║
║  │ • MongoDB       │  │ • WhatsApp API  │  │ • Video CDN     │  │ • ConfigMgr     │  ║
║  │ • SessionRepo   │  │ • Meta Graph    │  │ • DigitalOcean  │  │ • EnvValidator  │  ║
║  │ • AnalyticsRepo │  │ • Webhook Mgmt  │  │ • S3 Compatible │  │ • DI Container  │  ║
║  │ • InMemoryCache │  │ • Rate Limiting │  │ • Local Storage │  │ • LoggingMgr    │  ║
║  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘  ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

## 🔄 Flujo de Datos Completo - Diagrama de Secuencia Visual

```
👤 Usuario    📱 Webhook   🎯 UseCase   🏛️ Entity   🗄️ Repository   📲 WhatsApp
   │             │           │           │            │              │
   │─ "Hola" ────►│           │           │            │              │
   │             │           │           │            │              │
   │             │─ process ►│           │            │              │
   │             │           │           │            │              │
   │             │           │─ create ──►│           │              │
   │             │           │           │            │              │
   │             │           │           │◄─ session ─│              │
   │             │           │           │            │              │
   │             │           │─ save ────────────────►│              │
   │             │           │           │            │              │
   │             │           │◄─ saved ──────────────┤              │
   │             │           │           │            │              │
   │             │           │─ send message ─────────────────────► │
   │             │           │           │            │              │
   │             │           │◄─ sent ───────────────────────────── │
   │             │           │           │            │              │
   │             │◄─ done ───│           │            │              │
   │             │           │           │            │              │
   │◄─ respuesta ─│           │           │            │              │
   │             │           │           │            │              │

⏱️ Tiempo:     ~5ms        ~20ms      ~2ms         ~50ms           ~200ms
💭 Proceso:   Receive    Validate   Business    Persistence     External API
```

## 🏗️ Estructura de Proyecto Visual

```
📁 NIBLION/ (Root del Monorepo)
│
├── 📁 backend/ ──────────────────── 🎯 Node.js Application
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 domain/ ────────────── 🏛️ Business Logic Core
│   │   │   └── 📁 entities/
│   │   │       ├── 📄 Module.js ──── 📖 Educational Module
│   │   │       ├── 📄 Question.js ── ❓ Quiz Question
│   │   │       ├── 📄 UserSession.js 👤 User State
│   │   │       └── 📄 Survey.js ──── 📋 Feedback Form
│   │   │
│   │   ├── 📁 application/ ────────── 🎯 Use Cases & Services
│   │   │   ├── 📁 use-cases/
│   │   │   │   ├── 📄 StartCourseUseCase.js ── 🚀 Course Init
│   │   │   │   ├── 📄 ProcessAnswerUseCase.js  ✅ Answer Logic
│   │   │   │   └── 📄 SendQuestionUseCase.js ─ ❓ Question Mgmt
│   │   │   └── 📁 services/
│   │   │       └── 📄 SessionManagementService.js ⚙️ Session Ctrl
│   │   │
│   │   ├── 📁 infrastructure/ ────── 🔧 External Integration
│   │   │   ├── 📁 database/
│   │   │   │   ├── 📄 DatabaseConnection.js ── 🔌 DB Connector
│   │   │   │   └── 📄 MongoSessionRepository.js 🗄️ Data Access
│   │   │   └── 📁 external/
│   │   │       └── 📄 WhatsAppApiService.js ─── 📱 WA Integration
│   │   │
│   │   ├── 📁 presentation/ ──────── 🌐 API & Controllers
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── 📄 WhatsAppWebhookController.js 📱 WA Handler
│   │   │   │   └── 📄 CourseApiController.js ────── 🎓 Course API
│   │   │   └── 📁 routes/
│   │   │       ├── 📄 whatsappRoutes.js ─────────── 📱 WA Routes
│   │   │       └── 📄 courseApiRoutes.js ────────── 📚 API Routes
│   │   │
│   │   └── 📁 shared/ ────────────── ⚙️ Configuration
│   │       ├── 📄 ConfigurationManager.js ─ 🔧 Config
│   │       └── 📄 DependencyContainer.js ── 📦 DI Container
│   │
│   ├── 📄 package.json ──────────── 📋 Dependencies
│   ├── 📄 .env ─────────────────── 🔐 Environment Variables
│   └── 📄 server.js ────────────── 🚀 Entry Point
│
├── 📁 frontend/ ─────────────────── ⚛️ React Application
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 components/
│   │   │   └── 📁 layout/
│   │   │       └── 📄 Navbar.jsx ──── 🧭 Navigation
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── 📄 Dashboard.jsx ──── 📊 Main Dashboard
│   │   │   ├── 📄 CampaignManager.jsx 📢 Campaign Mgmt
│   │   │   ├── 📄 Analytics.jsx ──── 📈 Reports & Metrics
│   │   │   └── 📄 Settings.jsx ───── ⚙️ Configuration
│   │   │
│   │   ├── 📄 App.jsx ────────────── 🏠 Main App Component
│   │   ├── 📄 main.jsx ───────────── 🚀 React Entry Point
│   │   └── 📄 index.css ──────────── 🎨 Global Styles
│   │
│   ├── 📄 package.json ──────────── 📋 Frontend Dependencies
│   ├── 📄 vite.config.js ────────── ⚡ Vite Configuration
│   ├── 📄 tailwind.config.js ────── 🎨 Tailwind Setup
│   └── 📄 postcss.config.js ────── 🔧 PostCSS Config
│
├── 📁 simulations/ ─────────────── 🔬 Gophis Integration (Pending)
│   └── 📄 (simulation modules)
│
├── 📁 docs/ ───────────────────── 📚 Documentation
│   ├── 📄 ARCHITECTURE.md ────── 🏛️ Architecture Guide
│   └── 📄 API.md ──────────────── 🔗 API Documentation
│
├── 📄 README.md ──────────────── 📖 Project Documentation
├── 📄 package.json ───────────── 📋 Monorepo Configuration
└── 📄 .gitignore ─────────────── 🚫 Git Ignore Rules
```

## 🎯 Mapa de Interacciones del Sistema

```
                    🌐 EXTERNAL WORLD                    🏢 NIBLION SYSTEM
    ┌─────────────────────────────────────┐           ┌─────────────────────────────────────┐
    │                                     │           │                                     │
    │  👤 End User                        │           │        🎯 BACKEND CORE              │
    │  ┌─────────────┐                    │           │  ┌─────────────────────────────────┐│
    │  │📱 WhatsApp  │◄────────────────────────────────┤►│ 📱 Webhook Controller           ││
    │  │   Client    │                    │           │  │   │                             ││
    │  └─────────────┘                    │           │  │   ▼                             ││
    │                                     │           │  │ 🎯 Use Cases Layer              ││
    │  👩‍💼 Administrator                   │           │  │   │                             ││
    │  ┌─────────────┐                    │           │  │   ▼                             ││
    │  │🖥️ Web       │◄────────────────────────────────┤►│ 🏛️ Domain Entities             ││
    │  │   Dashboard │                    │           │  │   │                             ││
    │  └─────────────┘                    │           │  │   ▼                             ││
    │                                     │           │  │ 🔧 Infrastructure Layer        ││
    │  🌐 Meta/WhatsApp                   │           │  └─────────────────────────────────┘│
    │  ┌─────────────┐                    │           │                                     │
    │  │📊 Graph API │◄────────────────────────────────┤►│ 📱 WhatsApp Service              │
    │  └─────────────┘                    │           │                                     │
    │                                     │           │  ┌─────────────────────────────────┐│
    │  🗄️ Database                        │           │  │        ⚛️ FRONTEND              ││
    │  ┌─────────────┐                    │           │  │ ┌─────────────────────────────┐ ││
    │  │💾 MongoDB   │◄────────────────────────────────┤►│ │ 📊 Dashboard Component      │ ││
    │  │   Cloud     │                    │           │  │ ├─────────────────────────────┤ ││
    │  └─────────────┘                    │           │  │ │ 📢 Campaign Manager         │ ││
    │                                     │           │  │ ├─────────────────────────────┤ ││
    │  🎥 Video CDN                       │           │  │ │ 📈 Analytics Dashboard      │ ││
    │  ┌─────────────┐                    │           │  │ ├─────────────────────────────┤ ││
    │  │☁️ DigitalOcn│◄────────────────────────────────┤►│ │ ⚙️ Settings Panel           │ ││
    │  │   Spaces    │                    │           │  │ └─────────────────────────────┘ ││
    │  └─────────────┘                    │           │  └─────────────────────────────────┘│
    │                                     │           │                                     │
    └─────────────────────────────────────┘           └─────────────────────────────────────┘

                            🔄 FLOW INDICATORS
    ◄─────► Bidirectional Communication    ─────► Unidirectional Flow
    🔒 Secure HTTPS/WSS                     ⚡ Real-time Updates
```

## 📊 Matriz de Responsabilidades por Capa

```
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║                            📋 RESPONSIBILITY MATRIX                                    ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   CONCERN       │ 🌐 PRESENTATION │ 🎯 APPLICATION  │ 🏛️ DOMAIN       │ 🔧 INFRASTRUCTURE│
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ User Interface  │      ✅ OWN     │        ❌       │        ❌       │        ❌       │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ HTTP Handling   │      ✅ OWN     │        ❌       │        ❌       │        ❌       │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Webhook Process │      ✅ OWN     │        ❌       │        ❌       │        ❌       │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Input Validation│      ✅ OWN     │        ✅       │        ❌       │        ❌       │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Business Logic  │        ❌       │      ✅ USE     │      ✅ OWN     │        ❌       │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Use Case Coord  │        ❌       │      ✅ OWN     │        ❌       │        ❌       │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Entity Rules    │        ❌       │        ❌       │      ✅ OWN     │        ❌       │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Data Persistence│        ❌       │      ✅ USE     │        ❌       │      ✅ OWN     │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ External APIs   │        ❌       │      ✅ USE     │        ❌       │      ✅ OWN     │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ Configuration   │        ❌       │      ✅ USE     │        ❌       │      ✅ OWN     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘

Legend: ✅ OWN = Layer owns this concern    ✅ USE = Layer uses this concern    ❌ = No responsibility
```

## 🚀 Flujo de Despliegue y Ejecución

```
🔧 DEVELOPMENT ENVIRONMENT                      🚀 PRODUCTION ENVIRONMENT
┌─────────────────────────────────────┐       ┌─────────────────────────────────────┐
│                                     │       │                                     │
│  💻 Local Development               │       │  ☁️ Cloud Infrastructure            │
│  ┌─────────────────────────────────┐│       │  ┌─────────────────────────────────┐│
│  │ 🔄 Hot Reload                   ││       │  │ 🏗️ Docker Containers            ││
│  │ ┌─────────────┬─────────────────┐││       │  │ ┌─────────────┬─────────────────┐││
│  │ │Backend:3000 │ Frontend:5173   │││  ───► │  │ │Backend:3000 │ Frontend:80    │││
│  │ │npm run dev  │ npm run dev     │││       │  │ │docker run   │ nginx serve    │││
│  │ └─────────────┴─────────────────┘││       │  │ └─────────────┴─────────────────┘││
│  └─────────────────────────────────┘│       │  └─────────────────────────────────┘│
│                                     │       │                                     │
│  🗄️ Local Database                  │       │  🌐 Cloud Services                  │
│  ┌─────────────────────────────────┐│       │  ┌─────────────────────────────────┐│
│  │ 🐳 MongoDB Docker               ││       │  │ 🍃 MongoDB Atlas                ││
│  │ 📱 WhatsApp Test Webhook        ││       │  │ 📱 WhatsApp Business API        ││
│  │ 🎥 Local Video Files            ││       │  │ 🎥 DigitalOcean Spaces          ││
│  └─────────────────────────────────┘│       │  └─────────────────────────────────┘│
│                                     │       │                                     │
└─────────────────────────────────────┘       └─────────────────────────────────────┘

                            📦 CI/CD PIPELINE
                    ┌─────────────────────────────────────┐
                    │ 🔄 GitHub Actions                    │
                    │                                     │
                    │ 1. 🧪 Run Tests                     │
                    │ 2. 🏗️ Build Docker Images           │
                    │ 3. 🚀 Deploy to Production          │
                    │ 4. 🔍 Health Check                  │
                    │ 5. 📊 Monitor Performance           │
                    └─────────────────────────────────────┘
```

## 🎨 Frontend Component Architecture

```
⚛️ REACT FRONTEND ARCHITECTURE
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                 📱 APP.JSX                                           │
│                            (Main Application Router)                                │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                          ┌─────────────┼─────────────┐
                          │             │             │
                          ▼             ▼             ▼
    ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
    │   🧭 NAVBAR.JSX         │ │    📄 PAGES/            │ │   🎨 GLOBAL STYLES      │
    │   (Navigation Component)│ │   (Page Components)     │ │   (Tailwind CSS)        │
    │                         │ │                         │ │                         │
    │ • Logo & Branding       │ │ 📊 Dashboard.jsx        │ │ • Utility Classes       │
    │ • Navigation Menu       │ │ 📢 CampaignManager.jsx  │ │ • Custom Components     │
    │ • Mobile Responsive     │ │ 📈 Analytics.jsx        │ │ • Color Scheme          │
    │ • Active State          │ │ ⚙️ Settings.jsx         │ │ • Typography            │
    └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        │                   │                   │
                        ▼                   ▼                   ▼
            ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
            │  📊 DASHBOARD       │ │  📢 CAMPAIGNS       │ │  📈 ANALYTICS       │
            │                     │ │                     │ │                     │
            │ 🔢 Stats Cards      │ │ 📝 Campaign Forms   │ │ 📊 Charts & Graphs  │
            │ 📈 Real-time Data   │ │ 📋 Batch Management │ │ 📈 Metrics Display  │
            │ 🚨 System Alerts    │ │ 📱 Quick Send       │ │ 📄 Export Options   │
            │ 🎯 Quick Actions    │ │ 📊 Progress Track   │ │ 🔍 Filter Controls  │
            └─────────────────────┘ └─────────────────────┘ └─────────────────────┘

    ┌─────────────────────┐ 
    │  ⚙️ SETTINGS        │ 
    │                     │ 
    │ 📱 WhatsApp Config  │ 
    │ 🗄️ Database Setup   │ 
    │ 🔔 Notifications    │ 
    │ 🛡️ Security Options │ 
    └─────────────────────┘ 
```

## 🎯 Patrones de Diseño Implementados

```
🏗️ DESIGN PATTERNS IN NIBLION ARCHITECTURE

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              📦 DEPENDENCY INJECTION                                │
│                                                                                     │
│ DependencyContainer.js                                                              │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │  constructor() {                                                                │ │
│ │    this.dependencies = {                                                        │ │
│ │      📄 sessionRepo: new MongoSessionRepository(db),                            │ │
│ │      📱 whatsappSvc: new WhatsAppApiService(config),                            │ │
│ │      🎯 processAnswerUC: new ProcessAnswerUseCase(sessionRepo, whatsappSvc)     │ │
│ │    };                                                                           │ │
│ │  }                                                                              │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               🏪 REPOSITORY PATTERN                                 │
│                                                                                     │
│ Interface (Implicit)              Implementation                                    │
│ ┌─────────────────────────┐      ┌─────────────────────────┐                       │
│ │ ISessionRepository      │      │ MongoSessionRepository  │                       │
│ │ ─────────────────────── │ ◄────┤ ─────────────────────── │                       │
│ │ + find(phoneNumber)     │      │ + find(phoneNumber)     │                       │
│ │ + save(session)         │      │ + save(session)         │                       │
│ │ + delete(phoneNumber)   │      │ + delete(phoneNumber)   │                       │
│ │ + findAll()             │      │ + findAll()             │                       │
│ └─────────────────────────┘      └─────────────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               🎭 STRATEGY PATTERN                                   │
│                                                                                     │
│ Question Processing Strategies                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │                          QuestionProcessor                                      │ │
│ │ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐                   │ │
│ │ │ MultipleChoice  │ │ TrueFalse       │ │ FreeText        │                   │ │
│ │ │ Strategy        │ │ Strategy        │ │ Strategy        │                   │ │
│ │ │ ─────────────── │ │ ─────────────── │ │ ─────────────── │                   │ │
│ │ │ +process()      │ │ +process()      │ │ +process()      │                   │ │
│ │ │ +validate()     │ │ +validate()     │ │ +validate()     │                   │ │
│ │ │ +score()        │ │ +score()        │ │ +score()        │                   │ │
│ │ └─────────────────┘ └─────────────────┘ └─────────────────┘                   │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                               🎪 FACADE PATTERN                                     │
│                                                                                     │
│ WhatsAppApiService (Facade)                                                         │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ + sendMessage()     ───► │ MessageSender │ ───► Meta Graph API                  │ │
│ │ + sendMedia()       ───► │ MediaSender   │ ───► File Upload API                 │ │
│ │ + validateWebhook() ───► │ Validator     │ ───► Signature Verify                │ │
│ │ + getProfile()      ───► │ ProfileGetter │ ───► User Info API                   │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              🏭 FACTORY PATTERN                                     │
│                                                                                     │
│ Entity Factory                                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│ │ createUserSession(phone, module) ───► UserSession Entity                        │ │
│ │ createQuestion(type, data)       ───► Question Entity                           │ │
│ │ createModule(id, content)        ───► Module Entity                             │ │
│ │ createSurvey(questions)          ───► Survey Entity                             │ │
│ └─────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

Esta documentación visual elaborada proporciona una comprensión completa y detallada de la arquitectura del sistema Niblion desde múltiples perspectivas, usando diagramas ASCII art avanzados y representaciones visuales que son fáciles de entender y seguir. 🎨✨