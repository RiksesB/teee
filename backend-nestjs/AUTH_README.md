# Sistema de Autenticación - Niblion Backend

Sistema completo de autenticación JWT implementado en NestJS 11 con MongoDB.

## 📋 Características Implementadas

✅ **Autenticación JWT**
- Tokens de acceso (1 día de duración)
- Refresh tokens (7 días de duración)
- Validación automática de tokens en todas las rutas protegidas

✅ **Endpoints de Autenticación**
- `POST /auth/login` - Login de usuarios
- `POST /auth/register` - Registro de nuevos clientes
- `GET /auth/me` - Obtener datos del usuario actual
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/refresh` - Refrescar access token

✅ **Roles de Usuario**
- **Admin**: Acceso completo al sistema
- **Client**: Acceso a funcionalidades de cliente

✅ **Seguridad**
- Contraseñas hasheadas con bcrypt
- Guards globales de JWT
- Validación de DTOs con class-validator
- Refresh token almacenado en BD

✅ **Base de Datos**
- Schema de Usuario en MongoDB con Mongoose
- Índices optimizados para consultas
- Timestamps automáticos (createdAt, updatedAt)

## 🚀 Instalación y Configuración

### 1. Dependencias Instaladas

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
npm install -D @types/bcryptjs @types/passport-jwt
```

### 2. Variables de Entorno

Agrega estas variables a tu `.env`:

```env
# JWT Configuration
JWT_SECRET=tu-secreto-jwt-super-seguro-cambialo-en-produccion

# MongoDB Connection
DATABASE_URI=mongodb+srv://usuario:password@cluster.mongodb.net/niblion_db

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. Configuración de MongoDB Atlas

Si estás usando MongoDB Atlas localmente, necesitas agregar tu IP a la whitelist:

1. Ve a MongoDB Atlas Dashboard
2. Network Access → Add IP Address
3. Agrega tu IP actual o `0.0.0.0/0` (solo para desarrollo)

## 📚 Uso del Sistema

### Frontend - AuthContext

El frontend ya está configurado para usar el backend real:

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, register } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password123');
    if (result.success) {
      // Login exitoso
      console.log('Usuario:', user);
    }
  };

  return <div>...</div>;
}
```

### Backend - Proteger Rutas

#### Rutas Públicas (sin autenticación)

```typescript
import { Public } from '../modules/auth/decorators/public.decorator';

@Public()
@Get('public-endpoint')
async publicRoute() {
  return { message: 'Esta ruta es pública' };
}
```

#### Rutas Protegidas (requieren autenticación)

Por defecto, **TODAS** las rutas requieren autenticación gracias al guard global.

```typescript
@Get('protected-endpoint')
async protectedRoute(@CurrentUser() user: any) {
  return {
    message: 'Esta ruta requiere autenticación',
    user: user
  };
}
```

#### Rutas con Roles Específicos

```typescript
import { Roles } from '../modules/auth/decorators/roles.decorator';
import { RolesGuard } from '../modules/auth/guards/roles.guard';

@UseGuards(RolesGuard)
@Roles('admin')
@Get('admin-only')
async adminOnlyRoute() {
  return { message: 'Solo admins pueden ver esto' };
}
```

### Obtener Usuario Actual

```typescript
import { CurrentUser } from '../modules/auth/decorators/current-user.decorator';

@Get('profile')
async getProfile(@CurrentUser() user: any) {
  // user contiene: { id, email, name, role, credits }
  return { user };
}
```

## 🔐 Estructura del Schema de Usuario

```typescript
{
  email: string,          // Único, lowercase, requerido
  password: string,       // Hasheado con bcrypt
  name: string,          // Nombre del usuario
  role: 'admin' | 'client', // Rol del usuario
  companyName?: string,  // Nombre de la empresa (clientes)
  phone?: string,        // Teléfono de contacto
  employees?: number,    // Número de empleados
  credits: number,       // Créditos disponibles (default: 0)
  status: 'active' | 'inactive' | 'suspended',
  refreshToken?: string, // Token de refresh almacenado
  lastLoginAt?: Date,    // Último login
  createdAt: Date,       // Auto-generado
  updatedAt: Date        // Auto-generado
}
```

## 🧪 Testing del Sistema

### 1. Crear un Usuario Admin (Manual - MongoDB)

Puedes usar MongoDB Compass o el shell de Mongo:

```javascript
// Genera un hash de contraseña con bcrypt (rounds=10)
// Contraseña: admin123
// Hash: $2a$10$ejemplo_hash_aqui

db.users.insertOne({
  email: "admin@niblion.com",
  password: "$2a$10$..." // Reemplazar con hash real
  name: "Administrador Niblion",
  role: "admin",
  credits: 0,
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### 2. Registrar un Cliente (Vía API)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@company.com",
    "password": "password123",
    "name": "Juan Pérez",
    "companyName": "Mi Empresa SA",
    "phone": "+584121234567",
    "employees": 50
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@niblion.com",
    "password": "admin123"
  }'
```

Respuesta:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "admin@niblion.com",
    "name": "Administrador Niblion",
    "role": "admin",
    "credits": 0,
    "status": "active"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 4. Acceder a Ruta Protegida

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Logout

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📂 Estructura de Archivos Creados

```
backend-nestjs/src/
├── modules/
│   ├── auth/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts  # @CurrentUser()
│   │   │   ├── public.decorator.ts        # @Public()
│   │   │   └── roles.decorator.ts         # @Roles()
│   │   ├── dto/
│   │   │   ├── login.dto.ts              # Validación de login
│   │   │   └── register.dto.ts           # Validación de registro
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts         # Guard de JWT
│   │   │   └── roles.guard.ts            # Guard de roles
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts           # Estrategia de Passport JWT
│   │   ├── auth.controller.ts            # Endpoints de auth
│   │   ├── auth.service.ts               # Lógica de autenticación
│   │   └── auth.module.ts                # Módulo de auth
│   └── database/
│       └── schemas/
│           └── user.schema.ts            # Schema de Usuario
└── app.module.ts                         # AuthModule importado con guard global
```

## 🔄 Flujo de Autenticación

1. **Registro**:
   - Usuario envía datos → AuthService valida → Hashea contraseña → Guarda en BD → Retorna éxito

2. **Login**:
   - Usuario envía credenciales → AuthService verifica → Genera tokens JWT → Guarda refreshToken en BD → Retorna tokens y datos de usuario

3. **Acceso a Ruta Protegida**:
   - Request con token → JwtAuthGuard valida → JwtStrategy decodifica → AuthService valida usuario → Request continúa con datos de usuario

4. **Logout**:
   - Request con token → AuthService invalida refreshToken en BD → Retorna éxito

## ⚙️ Configuración para Heroku

Para deployar en Heroku, asegúrate de configurar estas variables de entorno:

```bash
heroku config:set JWT_SECRET=tu-secreto-super-seguro -a secure-fortress-06743
heroku config:set DATABASE_URI=mongodb+srv://... -a secure-fortress-06743
```

## 🎯 Próximos Pasos

- [ ] Implementar recuperación de contraseña
- [ ] Agregar verificación de email
- [ ] Implementar rate limiting en login
- [ ] Agregar auditoría de sesiones
- [ ] Implementar 2FA (Two-Factor Authentication)

## 📝 Notas Importantes

- **Seguridad**: En producción, usa un JWT_SECRET fuerte y único
- **MongoDB Atlas**: Configura correctamente la whitelist de IPs
- **CORS**: Configura CORS_ORIGIN según tu dominio de frontend
- **Tokens**: Los access tokens expiran en 1 día, los refresh en 7 días
- **Rutas Públicas**: Los webhooks de WhatsApp están marcados como @Public()

## 🐛 Troubleshooting

### Error: "Unable to connect to the database"
- Verifica que DATABASE_URI es correcta
- Agrega tu IP a la whitelist de MongoDB Atlas
- Verifica conectividad de red

### Error: "JWT must be provided"
- Asegúrate de enviar el header: `Authorization: Bearer YOUR_TOKEN`
- Verifica que el token no haya expirado

### Error: "Credenciales inválidas"
- Verifica email y contraseña
- Asegúrate que el usuario existe en la BD
- Verifica que la cuenta esté activa (status: 'active')

## 📞 Soporte

Para más información, consulta la documentación oficial:
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport JWT Strategy](http://www.passportjs.org/packages/passport-jwt/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
