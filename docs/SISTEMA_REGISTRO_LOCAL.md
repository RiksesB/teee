# Sistema de Registro con Almacenamiento Local

## 📋 Descripción

El sistema de registro de Niblion ahora utiliza **localStorage** del navegador para almacenar usuarios registrados temporalmente. Esto permite probar la funcionalidad de registro sin necesidad de un backend activo.

## 🔧 Cómo Funciona

### 1. **Registro de Nuevos Usuarios**

Cuando un usuario se registra en `/register`:

```javascript
// Los datos se guardan en localStorage bajo la clave 'niblion_registered_users'
{
  "nuevo@email.com": {
    "id": 1729785600000,
    "email": "nuevo@email.com",
    "name": "Juan Pérez",
    "companyName": "Mi Empresa S.A.",
    "phone": "+58412123456",
    "role": "client",
    "password": "micontraseña",
    "employees": "11-50",
    "createdAt": "2025-10-23T12:00:00.000Z",
    "status": "active"
  }
}
```

### 2. **Inicio de Sesión**

El sistema combina dos fuentes de usuarios:
- **Usuarios por defecto** (hardcoded en AuthContext)
- **Usuarios registrados** (desde localStorage)

```javascript
// En AuthContext.jsx
const defaultUsers = {
  'admin@niblion.com': { ... },
  'client@techcorp.com': { ... }
};

const registeredUsers = JSON.parse(localStorage.getItem('niblion_registered_users') || '{}');
const allUsers = { ...defaultUsers, ...registeredUsers };
```

### 3. **Gestión de Usuarios**

Los administradores pueden ver todos los usuarios en `/admin/users`:
- Ver usuarios del sistema (no eliminables)
- Ver usuarios registrados (eliminables)
- Exportar datos a JSON

## 🎯 Funcionalidades Implementadas

### ✅ Registro
- Formulario completo de registro en `/register`
- Validaciones de contraseña y campos requeridos
- Verificación de email duplicado
- Almacenamiento inmediato en localStorage
- Redirección automática al login

### ✅ Login
- Integración con usuarios registrados localmente
- Combina usuarios por defecto + registrados
- Misma experiencia para todos los usuarios

### ✅ Gestión (Admin)
- Componente `UserManagement` en `/admin/users`
- Tabla con todos los usuarios
- Distinción visual entre usuarios del sistema y registrados
- Eliminación de usuarios registrados
- Exportación a JSON

## 📦 Estructura de Datos en localStorage

### `niblion_registered_users`
Diccionario con email como clave:
```json
{
  "email@ejemplo.com": {
    "id": 1729785600000,
    "email": "email@ejemplo.com",
    "name": "Nombre Completo",
    "companyName": "Nombre Empresa",
    "phone": "+58123456789",
    "role": "client",
    "password": "contraseña123",
    "employees": "11-50",
    "createdAt": "2025-10-23T12:00:00.000Z",
    "status": "active"
  }
}
```

### `niblion_user`
Usuario actual autenticado (session):
```json
{
  "id": 1729785600000,
  "email": "email@ejemplo.com",
  "name": "Nombre Completo",
  "role": "client",
  "token": "mock_jwt_token_..."
}
```

## 🔑 Usuarios por Defecto

Estos usuarios están siempre disponibles (hardcoded):

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@niblion.com | admin123 | admin |
| client@techcorp.com | client123 | client |
| client2@startup.com | client123 | client |

## 🛠️ Funciones Principales

### En `AuthContext.jsx`

```javascript
// Registrar nuevo usuario
const register = async (userData) => {
  // Valida email único
  // Crea objeto usuario
  // Guarda en localStorage
  // Retorna { success: true/false }
}

// Login con usuarios combinados
const login = async (email, password) => {
  const allUsers = { ...defaultUsers, ...registeredUsers };
  // Valida credenciales
  // Guarda sesión
}
```

### En `Register.jsx`

```javascript
const handleSubmit = async (e) => {
  // Validaciones locales
  const result = await register(formData);
  
  if (result.success) {
    setSuccess(true);
    navigate('/login');
  }
}
```

## 🎨 Componentes Actualizados

1. **`AuthContext.jsx`**
   - ✅ Nueva función `register()`
   - ✅ Login actualizado para leer localStorage
   - ✅ Combina usuarios por defecto + registrados

2. **`Register.jsx`**
   - ✅ Usa función `register()` del contexto
   - ✅ Validaciones mejoradas
   - ✅ Mensajes de éxito actualizados

3. **`Login.jsx`**
   - ✅ Link al registro destacado
   - ✅ Nota sobre almacenamiento local

4. **`UserManagement.jsx`** (Nuevo)
   - ✅ Vista de todos los usuarios
   - ✅ Eliminación de usuarios registrados
   - ✅ Exportación de datos
   - ✅ Estadísticas

## 🚀 Cómo Usar

### Registrar un nuevo usuario:
1. Ir a `/register` o hacer clic en "Regístrate aquí" desde login
2. Llenar el formulario
3. Hacer clic en "Enviar Solicitud de Registro"
4. Automáticamente redirige a login
5. Iniciar sesión con las credenciales registradas

### Ver usuarios (Admin):
1. Login como admin (admin@niblion.com / admin123)
2. Ir a la sección de gestión de usuarios
3. Ver, exportar o eliminar usuarios

### Exportar datos:
1. En la página de gestión de usuarios
2. Clic en "Exportar"
3. Se descarga un archivo JSON con todos los usuarios registrados

## ⚠️ Limitaciones del Almacenamiento Local

1. **Persistencia**: Los datos permanecen hasta que se limpie el localStorage del navegador
2. **Seguridad**: Las contraseñas se guardan en texto plano (solo para desarrollo)
3. **Sincronización**: No hay sincronización entre diferentes navegadores/dispositivos
4. **Capacidad**: Limitado a ~5-10MB por dominio

## 🔮 Migración a Backend Real

Cuando se implemente un backend real, solo hay que:

1. Reemplazar `localStorage.getItem()` por llamadas API
2. Actualizar las funciones `login()` y `register()` en AuthContext
3. Agregar autenticación JWT real
4. Hashear contraseñas en el backend

Las interfaces y flujos ya están listos para esta transición.

## 📝 Notas de Desarrollo

- ✅ Sistema funcional para desarrollo y demos
- ✅ Fácil de migrar a API real
- ✅ Validaciones del lado del cliente implementadas
- ⚠️ **No usar en producción** - Solo para desarrollo
- 🔐 En producción, usar hashing de contraseñas y JWT real

---

**Estado**: ✅ Implementado y funcionando
**Fecha**: Octubre 23, 2025
**Versión**: 1.0.0
