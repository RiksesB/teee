# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Niblion** is a full-stack B2B SaaS platform for cybersecurity awareness training. It delivers interactive phishing protection courses via WhatsApp Business API and provides a React-based web dashboard for organizations to manage training campaigns, track employee progress, and process payments.

### Key Components
- **Backend NestJS (`/backend-nestjs`)**: NestJS 11 server with modular architecture - ~90% complete
- **Backend Legacy (`/secure-fortress-06743`)**: Express.js server deployed on Heroku (production reference)
- **Frontend (`/frontend`)**: React 19 + Vite SaaS platform for organizations and administrators
- **Integration**: WhatsApp Business API for course delivery + Gophish for phishing simulations
- **Business Model**: Pay-per-person ($5.99 USD / Bs. 220 VES) with credit-based system

### Architecture Status
**Backend Migration**: The NestJS backend is 95% complete:
- ✅ WhatsApp course delivery fully functional (95% complete)
- ✅ Database module with MongoDB + Mongoose
- ✅ In-memory queue system (simpler than originally planned BullMQ)
- ✅ 6 educational modules with question randomization
- ✅ **Auth module with JWT (COMPLETE)** - Full authentication system implemented
- ✅ User schema in MongoDB with role-based access
- ❌ Analytics REST API for frontend (database has methods but no controller)

**Note**: `secure-fortress-06743/` contains the working Express.js prototype currently on Heroku. It serves as the reference implementation while NestJS migration completes.

## Development Commands

### Backend NestJS (Primary - 95% Complete)
```bash
cd backend-nestjs
npm install           # Install dependencies
npm run start:dev     # Start with hot reload (port 3000)
npm run build         # Build for production
npm run start:prod    # Production mode
npm run create-admin  # Create default admin user (admin@niblion.com / admin123)
npm run lint          # Run ESLint
```

### Backend Legacy - secure-fortress (Heroku Reference)
```bash
cd secure-fortress-06743
npm install           # Install dependencies
npm start             # Production server
npm run dev           # Development server

# Migration commands
node migrate-questions.js --check    # Verify DB state
node migrate-questions.js --upload   # Upload questions to MongoDB
```

### Frontend (React 19 + Vite)
```bash
cd frontend
npm install       # Install dependencies
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

### Full Development Setup
```bash
# Terminal 1 - MongoDB (or use MongoDB Atlas)
docker run -d -p 27017:27017 mongo:6

# Terminal 2 - Backend NestJS (no Redis needed - uses in-memory queue)
cd backend-nestjs && npm run start:dev

# Terminal 3 - Frontend
cd frontend && npm run dev
```

## Architecture and Key Components

### Tech Stack

#### Backend NestJS 11 (`/backend-nestjs`) - 90% Complete
- **NestJS 11.0**: Modern Node.js framework with TypeScript
- **In-Memory Queue**: Sequential message processing per user (NO Redis required)
- **Mongoose 8.19**: MongoDB ODM with TypeScript schemas
- **@nestjs/config**: Centralized configuration management
- **class-validator**: DTO validation (configured but not widely used yet)
- **Axios 1.13**: HTTP client for WhatsApp Business API
- **TypeScript 5**: Full type safety across the application

**Modules:**
- `DatabaseModule`: ✅ MongoDB with 4 schemas (User, UserSession, QuizResponse, SurveyResponse)
- `QueueModule`: ✅ In-memory queue service (simpler than BullMQ, no external deps)
- `WhatsAppModule`: ✅ 95% complete - All messaging, session management, course flow
- `CourseModule`: ✅ 6 educational modules + quiz constants
- `AuthModule`: ✅ **COMPLETE** - JWT authentication, role-based guards, user management
- `AnalyticsModule`: ❌ No REST API (database has methods but no controller)

#### Backend Legacy (`/secure-fortress-06743`) - Production Reference
- **Express.js 4.18**: Single-file monolithic server (2,437 lines in index.js)
- **Axios 1.10**: HTTP client for WhatsApp Business API
- **MongoDB 6.3**: Analytics database
- **In-Memory Queue**: Map-based message queue (100+ concurrent users)
- **Heroku**: Deployed at secure-fortress-06743.herokuapp.com

**Purpose**: Working prototype and production reference while NestJS completes. Contains battle-tested WhatsApp integration logic.

#### Frontend (`/frontend`)
- **React 19.1**: UI library
- **Vite 7.1**: Build tool and dev server
- **React Router 7.9**: Client-side routing with role-based navigation
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Axios 1.6**: HTTP client for backend API
- **Custom i18n**: Multi-language support (ES/EN) via context API

### Application Architecture

#### Frontend Structure (`/frontend/src`)
```
src/
├── pages/
│   ├── LandingPage.jsx          # Public homepage with features/pricing
│   ├── Login.jsx                # Authentication page
│   ├── admin/                   # Admin dashboard pages
│   │   ├── AdminDashboard.jsx   # Main admin panel
│   │   ├── ClientsPage.jsx      # Client management
│   │   ├── CoursesPage.jsx      # Course content management
│   │   ├── CampaignsPage.jsx    # Campaign oversight
│   │   ├── LicensesPage.jsx     # License allocation
│   │   └── ReportsPage.jsx      # System-wide analytics
│   └── client/                  # Client dashboard pages
│       ├── ClientDashboard.jsx  # Client overview
│       ├── CatalogPage.jsx      # Course catalog
│       ├── ClientCampaignsPage.jsx  # Campaign management
│       ├── TrackingPage.jsx     # Employee progress tracking
│       └── ClientLicensesPage.jsx   # Credit management
├── components/
│   ├── auth/ProtectedRoute.jsx  # Route guards by role
│   ├── layout/                  # Navbar, DashboardLayout
│   ├── payments/PurchaseCredits.jsx  # Multi-method payment UI
│   └── ui/                      # Reusable components (Button, Logo, etc.)
├── contexts/
│   └── AuthContext.jsx          # Global auth state (roles: admin/client)
├── services/
│   ├── api.js                   # Axios instance with interceptors
│   └── paymentService.js        # Payment processing logic
└── utils/
    └── i18n.jsx                 # Translation context and hook
```

#### Backend NestJS Structure (`/backend-nestjs/src`)
```
src/
├── modules/
│   ├── database/                           # ✅ COMPLETE
│   │   ├── schemas/
│   │   │   ├── user.schema.ts              # User accounts (JWT auth)
│   │   │   ├── user-session.schema.ts      # WhatsApp session tracking
│   │   │   ├── quiz-response.schema.ts     # Quiz answers
│   │   │   └── survey-response.schema.ts   # Post-course survey
│   │   ├── database.module.ts
│   │   └── database.service.ts             # CRUD + analytics queries
│   ├── queue/                              # ✅ COMPLETE
│   │   ├── queue.module.ts
│   │   └── in-memory-queue.service.ts      # Sequential processing
│   ├── course/                             # ✅ COMPLETE
│   │   └── constants/
│   │       ├── modules.constant.ts         # 6 modules + 18 questions
│   │       └── survey.constant.ts          # 5 survey questions
│   ├── whatsapp/                           # ✅ 95% COMPLETE
│   │   ├── whatsapp.module.ts
│   │   ├── whatsapp.controller.ts          # All endpoints working (@Public())
│   │   ├── whatsapp.service.ts             # All messaging functions
│   │   ├── session.service.ts              # Session management
│   │   ├── course.service.ts               # Course flow logic (813 lines)
│   │   ├── survey.service.ts               # Survey handling
│   │   └── message-router.service.ts       # Message routing
│   ├── auth/                               # ✅ COMPLETE
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts   # @CurrentUser() decorator
│   │   │   ├── public.decorator.ts         # @Public() decorator
│   │   │   └── roles.decorator.ts          # @Roles() decorator
│   │   ├── dto/
│   │   │   ├── login.dto.ts                # Login validation
│   │   │   └── register.dto.ts             # Register validation
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts           # JWT authentication guard (GLOBAL)
│   │   │   └── roles.guard.ts              # Role-based access control
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts             # Passport JWT strategy
│   │   ├── auth.controller.ts              # Login, register, me, logout, refresh
│   │   ├── auth.service.ts                 # Auth logic with bcrypt
│   │   └── auth.module.ts                  # Auth module with Passport & JWT
│   └── analytics/                          # ❌ NOT IMPLEMENTED
│       └── (empty directories - no controller)
├── config/
│   └── configuration.ts                    # ✅ Full config object (incl. JWT)
├── app.module.ts                           # ✅ Imports all modules + global JWT guard
└── main.ts                                 # ✅ CORS + validation
```

**Actual Implementation Status:**
- ✅ Complete WhatsApp course delivery system
- ✅ Question randomization (prevents cheating)
- ✅ WhatsApp List Messages for 4+ options
- ✅ Certificate generation + survey
- ✅ MongoDB analytics storage
- ✅ Automatic session cleanup
- ✅ **JWT authentication with role-based access control**
- ✅ **User management (register, login, logout, refresh tokens)**
- ✅ **Frontend-backend integration ready** (AuthContext updated)
- ✅ Auth DTOs with class-validator
- ❌ No Analytics REST API
- ❌ DTOs not used in other modules (validation exists but not applied)

#### WhatsApp Course Delivery Flow

**Employee Journey** (via WhatsApp):
1. **Initiation**: User types "prueba" OR receives template message from campaign
2. **Video Tutorial**: Receives educational video from DigitalOcean CDN (with fallback to text link)
3. **Quiz**: Answers 3 randomized questions per module (buttons for ≤3 options, lists for 4+)
4. **Feedback**: Immediate correct/incorrect response with explanation
5. **Progress**: Automatically advances through 6 modules sequentially
6. **Certificate**: Receives certificate image upon completion
7. **Survey**: 5-question satisfaction survey
8. **Cleanup**: Session deleted, results saved to MongoDB

**State Management** (NestJS Backend):
- `SessionService`: In-memory Map tracks `{ modulo, estado, enFormulario, enEncuesta, respuestas }`
- Automatic cleanup of inactive sessions (>60 min) every 30 minutes
- Queue ensures sequential message processing per user
- Module progression: Each user tracks their own progress (not global)

**Smart Message Routing**:
- ≤3 options → Interactive buttons (A, B, C)
- 4-10 options → WhatsApp List Messages (A, B, C, D, E...)
- All fallback to text if interactive messages fail
- Template messages for >24hr window violations (auto-retry)

#### User Roles and Access

- **Admin** (`role: 'admin'`):
  - Access to `/admin/*` routes
  - Manage clients, courses, campaigns, licenses
  - Approve manual payments (Pago Móvil, bank transfers)
  - View system-wide analytics

- **Client** (`role: 'client'`):
  - Access to `/client/*` routes
  - Purchase credits (3 payment methods)
  - Create and monitor campaigns
  - Track employee progress
  - View organization analytics

### Key API Endpoints

#### WhatsApp Endpoints (NestJS Backend)
**Webhooks:**
- `GET /webhook` - Webhook verification (returns hub.challenge if token matches)
- `POST /webhook` - Message processing (queued, routed, marks as read)

**Course Initiation:**
- `POST /iniciar-prueba` - Start course for users (batch: 5 at a time)
  - Body: `{ numeros: string[], usarPlantilla?: boolean }`
  - Auto-retries with template on 24hr window violations
- `POST /enviar-test` - Send test template message

**Monitoring:**
- `GET /health` - Health check with session statistics
  - Returns: `{ status, timestamp, sessions: { total, enFormulario, enEncuesta, enPrueba } }`

#### Authentication Endpoints (✅ IMPLEMENTED)
All auth endpoints are functional and connected to frontend:

**Public Routes:**
- `POST /auth/login` - User login (returns JWT tokens)
- `POST /auth/register` - Register new client account
- `POST /auth/refresh` - Refresh access token

**Protected Routes (require JWT):**
- `GET /auth/me` - Get current user data
- `POST /auth/logout` - Logout (invalidates refresh token)

**Client Routes**
- `GET /api/client/courses` - List available courses
- `GET /api/client/credits` - Get credit balance
- `POST /api/client/campaigns` - Create campaign
- `GET /api/client/campaigns` - List campaigns
- `GET /api/client/campaigns/:id` - Campaign details
- `POST /api/payments/paypal/create` - Initiate PayPal payment
- `POST /api/payments/mobile` - Register Pago Móvil payment
- `POST /api/payments/bank-transfer` - Register bank transfer
- `GET /api/payments/:id/status` - Check payment status

**Admin Routes**
- `GET /api/admin/clients` - List all clients
- `GET /api/admin/payments/pending` - Pending payment approvals
- `PUT /api/admin/payments/:id` - Approve/reject payment
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `GET /api/admin/analytics` - System-wide analytics

### Environment Variables

#### Backend NestJS (`.env` in `/backend-nestjs`)
```env
# Server
PORT=3000
NODE_ENV=development

# WhatsApp Business API
WEBHOOK_VERIFY_TOKEN=your_verify_token
API_TOKEN=your_whatsapp_access_token
BUSINESS_PHONE=your_phone_number_id
API_VERSION=v21.0

# MongoDB
DATABASE_URI=mongodb://localhost:27017/niblion_analytics
# Or: mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Application
MOSTRAR_TIP_PRUEBA=true
SESSION_TIMEOUT_MINUTES=30
MAX_CONCURRENT_SESSIONS=100

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT Authentication
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRATION=1d
```

#### Backend Legacy (`.env` in `/secure-fortress-06743`)
Same as NestJS but without SESSION_TIMEOUT_MINUTES and MAX_CONCURRENT_SESSIONS.

#### Frontend (`.env.development` in `/frontend`)
```env
VITE_API_URL=http://localhost:3000
```

**Note**: Frontend connects directly to backend root, not `/api` prefix.

### Payment System

**Pricing Model**: $5.99 USD / Bs. 220 VES per person
**Credit System**: Organizations purchase credits, each credit = 1 course + 1 phishing simulation

#### Payment Methods
1. **PayPal** (Automatic):
   - Instant processing
   - Credits auto-added upon confirmation
   - Integration via `/api/payments/paypal/create`

2. **Pago Móvil Venezuela** (Manual):
   - Client submits reference number
   - Admin approval required
   - 24-48 hour verification period

3. **Bank Transfer** (Manual):
   - Upload proof of transfer (USD or VES)
   - Admin approval required
   - 24-48 hour verification period

Component: `frontend/src/components/payments/PurchaseCredits.jsx`

### Internationalization (i18n)

Custom context-based i18n system supporting Spanish (ES) and English (EN).

**Implementation**: `frontend/src/utils/i18n.jsx`

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

**Translation structure**: Nested object keys (e.g., `landing.hero.title`, `dashboard.analytics.completion`)

### WhatsApp Message Templates

The backend uses WhatsApp Business templates for initiating conversations outside the 24-hour window:
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

#### WhatsAppService (`backend-nestjs/src/modules/whatsapp/whatsapp.service.ts`)
```typescript
// Message sending
enviarMensaje(numeroDestino: string, texto: string)
enviarVideo(numeroDestino: string, videoUrl: string, caption?: string)
enviarImagen(numeroDestino: string, imagenPath: string, caption?: string)
enviarBotonesOpciones(numeroDestino: string, texto: string, botones: Boton[])
enviarPreguntaConLista(numeroDestino: string, texto: string, opciones: string[], ...)
enviarMensajePlantilla(numeroDestino: string, nombrePlantilla: string, ...)
marcarComoLeido(messageId: string)
```

#### CourseService (`backend-nestjs/src/modules/whatsapp/course.service.ts`)
```typescript
// Course flow (813 lines - most complex service)
iniciarPruebaDirecta(numeroUsuario: string, usarPlantilla: boolean)
iniciarFormulario(numeroUsuario: string)
procesarRespuestaFormulario(numeroUsuario: string, message: any)
enviarCertificadoYEncuesta(numeroUsuario: string, resultadosModulos: any[])
randomizarOpciones(pregunta: any, quitarUnaIncorrecta: boolean)  // Prevents cheating
```

#### SessionService (`backend-nestjs/src/modules/whatsapp/session.service.ts`)
```typescript
// Session management (in-memory)
obtenerSesionUsuario(numeroUsuario: string): UserSession
actualizarSesionUsuario(numeroUsuario: string, datosNuevos: Partial<UserSession>)
crearSesion(numeroUsuario: string, modulo: number)
eliminarSesion(numeroUsuario: string)
obtenerEstadisticas(): { total, enFormulario, enEncuesta, enPrueba }
cleanInactiveSessions()  // Auto-runs every 30 min
```

#### DatabaseService (`backend-nestjs/src/modules/database/database.service.ts`)
```typescript
// MongoDB operations
guardarDatosUsuario(datosUsuario: any)
guardarRespuestasFormulario(numeroUsuario: string, modulo: number, respuestas: any)
guardarRespuestasEncuesta(numeroUsuario: string, respuestasEncuesta: any[], ...)
getModuleStatistics(modulo: number)  // Aggregation pipeline
getAllCompletedSurveys()
```

#### Frontend Key Files

**Authentication**:
- `frontend/src/contexts/AuthContext.jsx` - Auth state, login/logout, role management
- `frontend/src/components/auth/ProtectedRoute.jsx` - Route guards by role

**API Communication**:
- `frontend/src/services/api.js` - Axios instance with auth interceptors
- `frontend/src/services/paymentService.js` - Payment processing

**Internationalization**:
- `frontend/src/utils/i18n.jsx` - Translation context and `useTranslation()` hook

**Core Pages**:
- `frontend/src/pages/LandingPage.jsx` - Public homepage
- `frontend/src/pages/admin/AdminDashboard.jsx` - Admin panel
- `frontend/src/pages/client/ClientDashboard.jsx` - Client panel

### Critical Architecture Notes

#### NestJS Backend Specifics
**Question Randomization** (`CourseService`):
- Options are shuffled using Fisher-Yates algorithm per user
- 50% chance to remove one incorrect option from 4-option questions
- Mapping stored in session: `mapeosPreguntas[questionIndex] = { mapeoRespuestas, mapeoRetroalimentacion }`
- Validation uses mapping to check original correct answer
- Prevents cheating via screenshot sharing

**Message Type Selection** (Automatic):
- ≤3 options → `enviarBotonesOpciones()` (interactive reply buttons)
- 4-10 options → `enviarPreguntaConLista()` (WhatsApp List Messages)
- Automatic fallback to plain text if interactive messages fail
- Error 131047 (24hr window) → auto-retry with template message

**Session Lifecycle**:
- Created on course start: `SessionService.crearSesion()`
- Updated per question: `SessionService.actualizarSesionUsuario()`
- Auto-cleanup: Inactive >60min removed every 30min via `setInterval`
- Deleted on completion: After survey, before saving to MongoDB

**Queue System** (`InMemoryQueueService`):
- Per-user queue: `Map<string, Array<() => Promise<void>>>`
- Processing state: `Set<string>` tracks active users
- Ensures sequential execution: User can't process message N+1 until N completes
- No external dependencies (Redis-free)

#### Frontend Architecture
- **Real Authentication**: `AuthContext.jsx` connects to NestJS backend via JWT
- **Auth Flow**: Login → JWT tokens → Axios interceptors add Bearer token → Protected routes
- **Token Management**: Access token (1d) + Refresh token (7d) stored in localStorage
- **API Integration**: Auth endpoints fully functional, other endpoints awaiting implementation
- **Payment UI**: Complete UI but no backend endpoints (`paymentService.js` has placeholders)
- **i18n**: Custom context-based system, not react-i18next
- **Protected Routes**: `ProtectedRoute.jsx` checks role from AuthContext

#### Deployment Considerations
- **secure-fortress-06743**: Currently on Heroku with Express.js (working production)
- **backend-nestjs**: Not deployed yet, ready for Heroku (has Procfile)
- In-memory sessions lost on restart (acceptable for MVP, consider Redis for HA)
- MongoDB Atlas recommended over local MongoDB for production
- Certificate image must be accessible via CDN (currently DigitalOcean)

#### Known Gaps
- ❌ No Analytics REST API → Dashboards can't fetch data
- ❌ DTOs not used in non-auth modules → Input not fully validated
- ❌ No tests → 0% coverage
- ❌ Payment endpoints not implemented
- ❌ Gophish integration placeholder only
- ❌ No admin user seeding script (use `npm run create-admin` to create default admin)

## Authentication System (NestJS + React)

### Overview
Complete JWT-based authentication system with bcrypt password hashing, refresh tokens, and role-based access control.

### Backend Implementation

**Architecture:**
- Global `JwtAuthGuard` protects all routes by default
- Use `@Public()` decorator to mark public routes (e.g., webhooks)
- Use `@Roles('admin', 'client')` + `RolesGuard` for role-specific routes
- Use `@CurrentUser()` decorator to access authenticated user in route handlers

**Key Files:**
- `src/modules/auth/auth.service.ts` - Login/register logic, bcrypt hashing, JWT generation
- `src/modules/auth/strategies/jwt.strategy.ts` - Passport JWT validation
- `src/modules/auth/guards/jwt-auth.guard.ts` - Global authentication guard
- `src/modules/database/schemas/user.schema.ts` - User model with roles

**User Schema:**
```typescript
{
  email: string,           // Unique, lowercase
  password: string,        // Bcrypt hashed (10 rounds)
  name: string,
  role: 'admin' | 'client',
  companyName?: string,
  phone?: string,
  employees?: number,
  credits: number,         // For credit-based billing
  status: 'active' | 'inactive' | 'suspended',
  refreshToken?: string,   // Stored refresh token
  lastLoginAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Creating Admin User:**
```bash
cd backend-nestjs
npm run create-admin
# Creates: admin@niblion.com / admin123
```

**Example Protected Route:**
```typescript
import { Public } from '../modules/auth/decorators/public.decorator';
import { Roles } from '../modules/auth/decorators/roles.decorator';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { CurrentUser } from '../modules/auth/decorators/current-user.decorator';

// Public route (no auth required)
@Public()
@Get('public')
async publicRoute() {
  return { message: 'Public access' };
}

// Protected route (auth required, any role)
@Get('profile')
async getProfile(@CurrentUser() user: any) {
  return { user };
}

// Admin-only route
@UseGuards(RolesGuard)
@Roles('admin')
@Get('admin-only')
async adminRoute() {
  return { message: 'Admin access' };
}
```

### Frontend Implementation

**AuthContext Integration:**
- Frontend connects to backend via `/auth/login`, `/auth/register`, etc.
- JWT tokens stored in localStorage (`niblion_user`)
- Axios interceptor adds `Authorization: Bearer <token>` to all requests
- Auto-validates session on app load via `/auth/me`

**Key Files:**
- `frontend/src/contexts/AuthContext.jsx` - Auth state management
- `frontend/src/services/api.js` - Axios instance with JWT interceptors
- `frontend/src/components/auth/ProtectedRoute.jsx` - Route guards

**Usage in Components:**
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, register } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password');
    if (result.success) {
      // Redirected based on role
    }
  };

  return <div>Welcome {user?.name}</div>;
}
```

### Token Flow
1. **Login**: User sends email/password → Backend validates → Returns `{ accessToken, refreshToken, user }`
2. **Storage**: Frontend stores tokens in localStorage
3. **Requests**: Axios interceptor adds `Authorization: Bearer <accessToken>` header
4. **Validation**: Backend `JwtAuthGuard` validates token → Extracts user → Attaches to request
5. **Refresh**: When access token expires (1d), use refresh token (7d) via `/auth/refresh`
6. **Logout**: Frontend calls `/auth/logout` → Backend invalidates refresh token → Clears localStorage

### Security Notes
- **Passwords**: Hashed with bcrypt (10 rounds)
- **JWT Secret**: Must be strong in production (configure `JWT_SECRET` env var)
- **Token Expiry**: Access token 1 day, refresh token 7 days
- **CORS**: Configure `CORS_ORIGIN` to match frontend domain
- **MongoDB**: User IP must be whitelisted in MongoDB Atlas for development

### Testing Authentication

**Register Client:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.com",
    "password": "password123",
    "name": "Test User",
    "companyName": "Test Company",
    "phone": "+1234567890",
    "employees": 10
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@niblion.com", "password": "admin123"}'
```

**Access Protected Route:**
```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### Additional Documentation
See `backend-nestjs/AUTH_README.md` for comprehensive authentication documentation including troubleshooting, deployment, and advanced usage.