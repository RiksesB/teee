# 🏗️ Arquitectura del Sistema Niblion

## Diagrama de Arquitectura Clean

```mermaid
graph TB
    %% External Actors
    WA[👤 Usuario WhatsApp] 
    ADMIN[👩‍💼 Administrador Web]
    META[🌐 Meta/WhatsApp API]
    
    %% Presentation Layer
    subgraph "🌐 PRESENTATION LAYER"
        WEBAPP[🖥️ React Frontend<br/>Dashboard & Admin Panel]
        WEBHOOK[📱 WhatsApp Webhook<br/>Message Handler]
        API[🔗 REST API<br/>Campaign Management]
    end
    
    %% Application Layer
    subgraph "🎯 APPLICATION LAYER"
        UC1[📚 StartCourseUseCase]
        UC2[✅ ProcessAnswerUseCase]  
        UC3[❓ SendQuestionUseCase]
        UC4[📊 AnalyticsUseCase]
        UC5[🚀 CampaignUseCase]
        SVC[⚙️ SessionManagementService]
    end
    
    %% Domain Layer
    subgraph "🏛️ DOMAIN LAYER"
        subgraph "Entities"
            MOD[📖 Module]
            QUEST[❓ Question]
            USER[👤 UserSession]
            SURV[📋 Survey]
        end
        
        subgraph "Business Rules"
            BR1[📏 Validation Rules]
            BR2[🎯 Scoring Logic]
            BR3[📊 Progress Tracking]
        end
    end
    
    %% Infrastructure Layer
    subgraph "🔧 INFRASTRUCTURE LAYER"
        subgraph "Database"
            MONGO[(🗄️ MongoDB<br/>Sessions & Analytics)]
            CACHE[⚡ In-Memory Cache<br/>Active Sessions]
        end
        
        subgraph "External Services"
            WAAPI[📲 WhatsApp API Service]
            VIDEO[🎥 Video Storage<br/>DigitalOcean Spaces]
        end
        
        subgraph "Configuration"
            CONFIG[⚙️ ConfigurationManager]
            DI[📦 DependencyContainer]
        end
    end
    
    %% Connections
    WA --> WEBHOOK
    ADMIN --> WEBAPP
    
    WEBAPP --> API
    WEBHOOK --> UC1
    WEBHOOK --> UC2
    WEBHOOK --> UC3
    API --> UC4
    API --> UC5
    
    UC1 --> MOD
    UC1 --> USER
    UC1 --> SVC
    
    UC2 --> QUEST
    UC2 --> USER
    UC2 --> BR2
    
    UC3 --> QUEST
    UC3 --> MOD
    UC3 --> BR1
    
    UC4 --> USER
    UC4 --> BR3
    
    UC5 --> USER
    UC5 --> SVC
    
    SVC --> MONGO
    SVC --> CACHE
    
    UC1 --> WAAPI
    UC2 --> WAAPI
    UC3 --> WAAPI
    UC5 --> WAAPI
    
    WAAPI --> META
    UC3 --> VIDEO
    
    %% Styling
    classDef presentation fill:#e1f5fe
    classDef application fill:#f3e5f5
    classDef domain fill:#fff3e0
    classDef infrastructure fill:#e8f5e8
    
    class WEBAPP,WEBHOOK,API presentation
    class UC1,UC2,UC3,UC4,UC5,SVC application
    class MOD,QUEST,USER,SURV,BR1,BR2,BR3 domain
    class MONGO,CACHE,WAAPI,VIDEO,CONFIG,DI infrastructure
```

## Flujo de Datos Principal

```mermaid
sequenceDiagram
    participant U as 👤 Usuario WhatsApp
    participant W as 📱 Webhook
    participant UC as 🎯 Use Case
    participant E as 🏛️ Entity
    participant R as 🗄️ Repository
    participant API as 📲 WhatsApp API

    U->>+W: Envía mensaje
    W->>+UC: Procesar mensaje
    UC->>+E: Validar datos
    E-->>-UC: Datos validados
    UC->>+R: Guardar sesión
    R-->>-UC: Sesión guardada
    UC->>+API: Enviar respuesta
    API-->>-UC: Mensaje enviado
    UC-->>-W: Proceso completado
    W-->>-U: Respuesta recibida
```

## Estructura de Directorios Detallada

```
📁 Niblion/
├── 📁 backend/                    # 🎯 Backend Node.js
│   ├── 📁 src/
│   │   ├── 📁 domain/             # 🏛️ CAPA DE DOMINIO
│   │   │   └── 📁 entities/
│   │   │       ├── 📄 Module.js           # Módulo de capacitación
│   │   │       ├── 📄 Question.js         # Pregunta con validaciones
│   │   │       ├── 📄 UserSession.js      # Sesión de usuario
│   │   │       └── 📄 Survey.js           # Encuesta de feedback
│   │   │
│   │   ├── 📁 application/        # 🎯 CAPA DE APLICACIÓN
│   │   │   ├── 📁 use-cases/
│   │   │   │   ├── 📄 StartCourseUseCase.js     # Iniciar curso
│   │   │   │   ├── 📄 ProcessAnswerUseCase.js   # Procesar respuesta
│   │   │   │   └── 📄 SendQuestionUseCase.js    # Enviar pregunta
│   │   │   └── 📁 services/
│   │   │       └── 📄 SessionManagementService.js
│   │   │
│   │   ├── 📁 infrastructure/     # 🔧 CAPA DE INFRAESTRUCTURA
│   │   │   ├── 📁 database/
│   │   │   │   ├── 📄 DatabaseConnection.js     # Conexión MongoDB
│   │   │   │   └── 📄 MongoSessionRepository.js # Repo de sesiones
│   │   │   └── 📁 external/
│   │   │       └── 📄 WhatsAppApiService.js     # API WhatsApp
│   │   │
│   │   ├── 📁 presentation/       # 🌐 CAPA DE PRESENTACIÓN
│   │   │   ├── 📁 controllers/
│   │   │   │   ├── 📄 WhatsAppWebhookController.js
│   │   │   │   └── 📄 CourseApiController.js
│   │   │   └── 📁 routes/
│   │   │       ├── 📄 whatsappRoutes.js
│   │   │       └── 📄 courseApiRoutes.js
│   │   │
│   │   └── 📁 shared/             # ⚙️ CONFIGURACIÓN COMPARTIDA
│   │       ├── 📄 ConfigurationManager.js
│   │       └── 📄 DependencyContainer.js
│   │
│   ├── 📄 package.json
│   └── 📄 .env
│
├── 📁 frontend/                   # ⚛️ Frontend React
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   └── 📁 layout/
│   │   │       └── 📄 Navbar.jsx
│   │   ├── 📁 pages/
│   │   │   ├── 📄 Dashboard.jsx           # Dashboard principal
│   │   │   ├── 📄 CampaignManager.jsx     # Gestión de campañas
│   │   │   ├── 📄 Analytics.jsx           # Reportes y métricas
│   │   │   └── 📄 Settings.jsx            # Configuración
│   │   ├── 📄 App.jsx
│   │   └── 📄 main.jsx
│   │
│   ├── 📄 package.json
│   ├── 📄 tailwind.config.js
│   └── 📄 vite.config.js
│
├── 📁 simulations/               # 🔬 Módulo Gophis (pendiente)
│   └── 📄 (código de simulaciones)
│
├── 📄 README.md
├── 📄 package.json               # Monorepo principal
└── 📄 .gitignore
```

## Principios de Clean Architecture Aplicados

### 🎯 Regla de Dependencias
```mermaid
graph LR
    P[🌐 Presentation] --> A[🎯 Application]
    A --> D[🏛️ Domain]
    I[🔧 Infrastructure] --> A
    I --> D
    
    style D fill:#fff3e0
    style A fill:#f3e5f5
    style P fill:#e1f5fe
    style I fill:#e8f5e8
```

**Las dependencias fluyen hacia adentro:**
- 🌐 **Presentation** depende de **Application** 
- 🎯 **Application** depende de **Domain**
- 🔧 **Infrastructure** implementa interfaces de **Domain**
- 🏛️ **Domain** NO depende de nada externo

### 🏛️ Capa de Dominio (Domain)
**Responsabilidades:**
- ✅ Entidades de negocio puras
- ✅ Reglas de validación
- ✅ Lógica de scoring y progreso
- ❌ NO conoce bases de datos
- ❌ NO conoce frameworks externos

**Ejemplo de Entidad:**
```javascript
// UserSession.js - Entidad pura de dominio
export class UserSession {
  constructor(phoneNumber, moduleId) {
    this.phoneNumber = phoneNumber;
    this.moduleId = moduleId;
    this.currentState = 'starting';
    this.score = 0;
    this.answers = [];
  }
  
  // Lógica de negocio pura
  advanceToNextQuestion() { /* ... */ }
  calculateFinalScore() { /* ... */ }
  isModuleCompleted() { /* ... */ }
}
```

### 🎯 Capa de Aplicación (Application)
**Responsabilidades:**
- ✅ Casos de uso específicos
- ✅ Orquestación de entidades
- ✅ Coordinación de servicios
- ❌ NO contiene lógica de negocio
- ❌ NO maneja detalles técnicos

**Ejemplo de Caso de Uso:**
```javascript
// ProcessAnswerUseCase.js
export class ProcessAnswerUseCase {
  constructor(sessionRepository, whatsappService) {
    this.sessionRepository = sessionRepository;
    this.whatsappService = whatsappService;
  }
  
  async execute(phoneNumber, answer) {
    // 1. Obtener sesión
    const session = await this.sessionRepository.find(phoneNumber);
    
    // 2. Procesar respuesta (lógica de dominio)
    const result = session.processAnswer(answer);
    
    // 3. Guardar cambios
    await this.sessionRepository.save(session);
    
    // 4. Enviar feedback
    await this.whatsappService.sendMessage(phoneNumber, result.feedback);
    
    return result;
  }
}
```

### 🔧 Capa de Infraestructura (Infrastructure)
**Responsabilidades:**
- ✅ Implementación de repositorios
- ✅ Servicios externos (WhatsApp, MongoDB)
- ✅ Configuración y conexiones
- ✅ Detalles técnicos específicos

### 🌐 Capa de Presentación (Presentation)
**Responsabilidades:**
- ✅ Controladores HTTP
- ✅ Webhooks de WhatsApp
- ✅ Rutas y middleware
- ✅ Validación de entrada
- ✅ Formateo de respuestas

## Patrones de Diseño Implementados

### 📦 Dependency Injection
```javascript
// DependencyContainer.js
export class DependencyContainer {
  async initialize() {
    // Inyección de dependencias
    this.sessionRepository = new MongoSessionRepository(db);
    this.whatsappService = new WhatsAppApiService(config);
    this.processAnswerUseCase = new ProcessAnswerUseCase(
      this.sessionRepository,
      this.whatsappService
    );
  }
}
```

### 🏪 Repository Pattern
```javascript
// Interfaz implícita en JavaScript
class ISessionRepository {
  async find(phoneNumber) { throw new Error('Not implemented'); }
  async save(session) { throw new Error('Not implemented'); }
}

// Implementación concreta
export class MongoSessionRepository {
  async find(phoneNumber) {
    // Lógica específica de MongoDB
  }
  
  async save(session) {
    // Lógica específica de MongoDB
  }
}
```

### 🎭 Strategy Pattern
```javascript
// Para diferentes tipos de preguntas
class QuestionProcessor {
  process(question, answer) {
    switch(question.type) {
      case 'multiple_choice':
        return new MultipleChoiceStrategy().process(question, answer);
      case 'true_false':
        return new TrueFalseStrategy().process(question, answer);
    }
  }
}
```

## Ventajas de Esta Arquitectura

### ✅ **Mantenibilidad**
- Código organizado por responsabilidades
- Fácil localización de funcionalidades
- Cambios aislados por capas

### ✅ **Testabilidad**
- Lógica de negocio independiente
- Mocking fácil de dependencias
- Tests unitarios por capa

### ✅ **Escalabilidad**
- Adición de nuevos casos de uso
- Cambio de tecnologías sin afectar lógica
- Módulos independientes

### ✅ **Flexibilidad**
- Cambio de base de datos sin afectar dominio
- Integración con nuevas APIs
- Diferentes interfaces (Web, API, CLI)

## Flujo de Proceso de Negocio

### 📱 Flujo de WhatsApp
```mermaid
graph TD
    A[Usuario envía mensaje] --> B{¿Nueva sesión?}
    B -->|Sí| C[Crear sesión]
    B -->|No| D[Recuperar sesión]
    C --> E[Mostrar menú principal]
    D --> F{¿Estado actual?}
    F -->|starting| E
    F -->|watching_video| G[Continuar video]
    F -->|answering_quiz| H[Procesar respuesta]
    F -->|completed| I[Mostrar certificado]
    
    E --> J[Seleccionar módulo]
    J --> K[Enviar video]
    K --> L[Mostrar cuestionario]
    L --> H
    H --> M{¿Aprobado?}
    M -->|Sí| N[Siguiente módulo]
    M -->|No| O[Repetir pregunta]
    N --> P{¿Todos completados?}
    P -->|Sí| I
    P -->|No| E
```

### 🌐 Flujo de Administración Web
```mermaid
graph TD
    A[Admin accede al panel] --> B[Dashboard]
    B --> C{¿Qué acción?}
    C -->|Ver métricas| D[Analytics]
    C -->|Crear campaña| E[Campaign Manager]
    C -->|Configurar| F[Settings]
    
    E --> G[Seleccionar módulo]
    G --> H[Cargar números]
    H --> I[Enviar mensajes masivos]
    I --> J[Monitorear progreso]
    
    D --> K[Generar reportes]
    K --> L[Exportar datos]
    
    F --> M[Configurar WhatsApp]
    F --> N[Configurar Base de Datos]
```

Esta arquitectura garantiza que el sistema sea robusto, mantenible y escalable, siguiendo las mejores prácticas de desarrollo de software empresarial. 🚀