# Credenciales de Prueba - Niblion

Este documento contiene las credenciales y datos de prueba para probar todas las funcionalidades de la plataforma Niblion.

## 🔐 Credenciales de Usuario

### Cuenta de Administrador
```
Email: admin@niblion.com
Password: Admin123!
Role: ADMIN
```

**Acceso a:**
- Panel de administración (`/admin`)
- Gestión de clientes
- Gestión de cursos
- Aprobación de pagos
- Reportes globales
- Configuración del sistema

### Cuenta de Cliente (Empresa 1)
```
Email: cliente@empresa1.com
Password: Cliente123!
Role: CLIENT
Organization: Empresa Demo S.A.
```

**Datos de la organización:**
- Nombre: Empresa Demo S.A.
- Créditos disponibles: 100 personas
- RIF: J-12345678-9

**Acceso a:**
- Dashboard de cliente (`/client`)
- Catálogo de cursos
- Compra de créditos
- Creación de campañas
- Seguimiento y reportes

### Cuenta de Cliente (Empresa 2)
```
Email: cliente@empresa2.com
Password: Cliente456!
Role: CLIENT
Organization: Tech Solutions Corp
```

**Datos de la organización:**
- Nombre: Tech Solutions Corp
- Créditos disponibles: 50 personas
- RIF: J-98765432-1

## 💳 Datos de Pago de Prueba

### PayPal Sandbox
```
Email: sb-buyer@niblion.com
Password: PayPal123!
```

**Tarjetas de prueba:**
- Visa: 4111 1111 1111 1111
- Mastercard: 5555 5555 5555 4444
- CVV: 123
- Fecha de expiración: Cualquier fecha futura
- Código postal: 12345

### Pago Móvil Venezuela (Datos de prueba)
```
Teléfono: 0414-1234567
Banco: Banesco
Referencia: 12345678
Fecha: 20/10/2025
Monto: Bs. 220 o Bs. 1100 (5 personas)
```

**Cuenta de destino (ficticia):**
- Banco: Banesco
- Tipo: Corriente
- Número: 0134-0123-45-1234567890
- Titular: Niblion C.A.
- RIF: J-40123456-7
- Teléfono: 0414-9876543

### Transferencia Bancaria (Datos de prueba)

**Cuenta en USD:**
```
Banco: Bancaribe
Tipo: Corriente
Número: 0114-0234-56-2345678901
Titular: Niblion C.A.
RIF: J-40123456-7
```

**Cuenta en VES:**
```
Banco: Mercantil
Tipo: Corriente
Número: 0105-0345-67-3456789012
Titular: Niblion C.A.
RIF: J-40123456-7
```

## 📱 Datos de WhatsApp para Pruebas

### Números de prueba (formato internacional)
```
+58 414 1234567
+58 424 9876543
+58 412 5554321
+1 305 5551234
+34 612 345678
```

### Webhook de WhatsApp (Desarrollo)
```
URL: http://localhost:3000/webhook
Verify Token: niblion_verify_token_2024
```

## 🎓 Cursos de Prueba

### Curso 1: Introducción al Phishing
```
ID: course_001
Título: Introducción al Phishing
Nivel: Básico
Duración: 30 minutos
Módulos: 4
Idiomas: ES, EN
```

### Curso 2: Phishing Avanzado
```
ID: course_002
Título: Técnicas Avanzadas de Detección
Nivel: Intermedio
Duración: 45 minutos
Módulos: 6
Idiomas: ES, EN
```

### Curso 3: Ingeniería Social
```
ID: course_003
Título: Ingeniería Social y Protección
Nivel: Avanzado
Duración: 60 minutos
Módulos: 8
Idiomas: ES, EN
```

## 📊 Datos de Campaña de Prueba

### Campaña de Prueba 1
```json
{
  "name": "Capacitación Q4 2024",
  "courseId": "course_001",
  "people": [
    {
      "name": "Juan Pérez",
      "phone": "+58 414 1234567",
      "email": "juan.perez@empresa1.com",
      "department": "IT"
    },
    {
      "name": "María García",
      "phone": "+58 424 9876543",
      "email": "maria.garcia@empresa1.com",
      "department": "Marketing"
    },
    {
      "name": "Carlos Rodríguez",
      "phone": "+58 412 5554321",
      "email": "carlos.rodriguez@empresa1.com",
      "department": "Ventas"
    }
  ],
  "startDate": "2024-10-25",
  "endDate": "2024-11-15"
}
```

### CSV de Ejemplo para Importar
Crear archivo `empleados_prueba.csv`:
```csv
nombre,telefono,email,departamento
Ana Martínez,+584141111111,ana.martinez@empresa.com,Recursos Humanos
Pedro Sánchez,+584242222222,pedro.sanchez@empresa.com,Finanzas
Laura Torres,+584123333333,laura.torres@empresa.com,Operaciones
Diego Morales,+584144444444,diego.morales@empresa.com,IT
Sofia Ramírez,+584245555555,sofia.ramirez@empresa.com,Marketing
```

## 🔧 Variables de Entorno para Desarrollo

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000
VITE_PAYPAL_CLIENT_ID=sb-client-id-sandbox
VITE_PRICE_PER_PERSON_USD=5.99
VITE_PRICE_PER_PERSON_VES=220
VITE_ENABLE_PAYPAL=true
VITE_ENABLE_MOBILE_PAYMENT=true
VITE_ENABLE_BANK_TRANSFER=true
```

### Backend (`.env`)
```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/niblion_dev

# JWT
JWT_SECRET=niblion_jwt_secret_key_2024_development
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=niblion_refresh_secret_key_2024
JWT_REFRESH_EXPIRES_IN=7d

# WhatsApp Business API
WHATSAPP_VERIFY_TOKEN=niblion_verify_token_2024
WHATSAPP_ACCESS_TOKEN=tu_access_token_de_meta
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
META_APP_ID=tu_app_id
META_APP_SECRET=tu_app_secret
WHATSAPP_API_URL=https://graph.facebook.com/v18.0

# Gophish
GOPHISH_API_URL=http://localhost:3333
GOPHISH_API_KEY=tu_gophish_api_key

# PayPal
PAYPAL_CLIENT_ID=sb-client-id-sandbox
PAYPAL_CLIENT_SECRET=sb-secret-sandbox
PAYPAL_MODE=sandbox

# Redis (para cola de mensajes)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email (para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@niblion.com
SMTP_PASSWORD=tu_password_smtp
SMTP_FROM=Niblion <noreply@niblion.com>

# Rate Limiting
WHATSAPP_RATE_LIMIT_PER_SECOND=5
MAX_PEOPLE_PER_CAMPAIGN=500

# Logs
LOG_LEVEL=debug
```

## 📝 Script de Inicialización de Base de Datos

### Insertar datos de prueba en MongoDB

```javascript
// mongo_seed.js - Ejecutar con: node mongo_seed.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGODB_URI = 'mongodb://localhost:27017/niblion_dev';

async function seedDatabase() {
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  // Limpiar colecciones existentes
  await db.collection('users').deleteMany({});
  await db.collection('organizations').deleteMany({});
  await db.collection('courses').deleteMany({});

  // Crear organizaciones
  const org1 = await db.collection('organizations').insertOne({
    name: 'Empresa Demo S.A.',
    email: 'contacto@empresa1.com',
    rif: 'J-12345678-9',
    peopleCredits: 100,
    totalPurchased: 100,
    paymentMethods: ['paypal', 'mobile', 'bank'],
    subscriptionTier: 'professional',
    createdAt: new Date()
  });

  const org2 = await db.collection('organizations').insertOne({
    name: 'Tech Solutions Corp',
    email: 'contacto@empresa2.com',
    rif: 'J-98765432-1',
    peopleCredits: 50,
    totalPurchased: 50,
    paymentMethods: ['paypal'],
    subscriptionTier: 'basic',
    createdAt: new Date()
  });

  // Crear usuarios
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const clientPassword1 = await bcrypt.hash('Cliente123!', 10);
  const clientPassword2 = await bcrypt.hash('Cliente456!', 10);

  await db.collection('users').insertMany([
    {
      email: 'admin@niblion.com',
      password: adminPassword,
      name: 'Administrador Niblion',
      role: 'admin',
      isActive: true,
      createdAt: new Date()
    },
    {
      email: 'cliente@empresa1.com',
      password: clientPassword1,
      name: 'Cliente Empresa 1',
      role: 'client',
      organizationId: org1.insertedId,
      isActive: true,
      createdAt: new Date()
    },
    {
      email: 'cliente@empresa2.com',
      password: clientPassword2,
      name: 'Cliente Empresa 2',
      role: 'client',
      organizationId: org2.insertedId,
      isActive: true,
      createdAt: new Date()
    }
  ]);

  // Crear cursos de prueba
  await db.collection('courses').insertMany([
    {
      _id: 'course_001',
      title: {
        es: 'Introducción al Phishing',
        en: 'Introduction to Phishing'
      },
      description: {
        es: 'Curso básico sobre identificación y prevención de phishing',
        en: 'Basic course on phishing identification and prevention'
      },
      level: 'basic',
      durationMinutes: 30,
      modules: [
        {
          title: '¿Qué es el Phishing?',
          content: 'Introducción al concepto de phishing y sus tipos',
          videoUrl: 'https://example.com/video1',
          questions: [
            {
              text: '¿Qué es el phishing?',
              options: [
                'Un ataque de ingeniería social',
                'Un virus informático',
                'Un tipo de spam',
                'Un firewall'
              ],
              correctAnswer: 0
            }
          ]
        }
      ],
      isActive: true,
      createdAt: new Date()
    }
  ]);

  console.log('✅ Base de datos inicializada con datos de prueba');
  console.log('\n🔐 Credenciales creadas:');
  console.log('Admin: admin@niblion.com / Admin123!');
  console.log('Cliente 1: cliente@empresa1.com / Cliente123!');
  console.log('Cliente 2: cliente@empresa2.com / Cliente456!');

  await client.close();
}

seedDatabase().catch(console.error);
```

## 🚀 Guía de Prueba Paso a Paso

### 1. Probar Login y Navegación
- [ ] Ir a `http://localhost:5174`
- [ ] Ver landing page completa
- [ ] Cambiar idioma (ES/EN)
- [ ] Click en "Iniciar Sesión"
- [ ] Login como admin: `admin@niblion.com / Admin123!`
- [ ] Verificar redirección a `/admin`
- [ ] Logout
- [ ] Login como cliente: `cliente@empresa1.com / Cliente123!`
- [ ] Verificar redirección a `/client`

### 2. Probar Dashboard Cliente
- [ ] Ver créditos disponibles (100)
- [ ] Navegar al catálogo de cursos
- [ ] Navegar a "Comprar Créditos"
- [ ] Simular compra con PayPal
- [ ] Simular compra con Pago Móvil
- [ ] Ver campañas existentes

### 3. Probar Dashboard Admin
- [ ] Ver estadísticas globales
- [ ] Ver lista de clientes
- [ ] Ver pagos pendientes de aprobación
- [ ] Aprobar/rechazar un pago
- [ ] Ver cursos disponibles
- [ ] Ver reportes

### 4. Probar Creación de Campaña
- [ ] Login como cliente
- [ ] Ir a "Crear Campaña"
- [ ] Seleccionar curso
- [ ] Cargar CSV de empleados
- [ ] O agregar manualmente
- [ ] Configurar fechas
- [ ] Crear campaña
- [ ] Ver en seguimiento

## 📞 Soporte

Si encuentras problemas con las credenciales o datos de prueba:
1. Verificar que MongoDB esté corriendo
2. Ejecutar script de seed: `node mongo_seed.js`
3. Limpiar localStorage del navegador
4. Reiniciar servidores (frontend y backend)

---

**IMPORTANTE**: Estas credenciales son solo para desarrollo. **NUNCA** usar en producción.

**Última actualización**: Octubre 2025  
**Mantenido por**: Equipo de Desarrollo Niblion
