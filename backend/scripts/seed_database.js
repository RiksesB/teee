// Script de inicialización de base de datos con datos de prueba
// Ejecutar con: node scripts/seed_database.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/niblion_dev';

async function seedDatabase() {
  console.log('🌱 Iniciando seed de base de datos...\n');

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db();

  try {
    // Limpiar colecciones existentes
    console.log('🧹 Limpiando colecciones existentes...');
    await db.collection('users').deleteMany({});
    await db.collection('organizations').deleteMany({});
    await db.collection('courses').deleteMany({});
    await db.collection('payments').deleteMany({});
    await db.collection('campaigns').deleteMany({});
    console.log('✅ Colecciones limpiadas\n');

    // Crear organizaciones
    console.log('🏢 Creando organizaciones...');
    const org1 = await db.collection('organizations').insertOne({
      name: 'Empresa Demo S.A.',
      email: 'contacto@empresa1.com',
      rif: 'J-12345678-9',
      peopleCredits: 100,
      totalPurchased: 100,
      paymentMethods: ['paypal', 'mobile', 'bank'],
      subscriptionTier: 'professional',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const org2 = await db.collection('organizations').insertOne({
      name: 'Tech Solutions Corp',
      email: 'contacto@empresa2.com',
      rif: 'J-98765432-1',
      peopleCredits: 50,
      totalPurchased: 50,
      paymentMethods: ['paypal'],
      subscriptionTier: 'basic',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Organizaciones creadas\n');

    // Crear usuarios
    console.log('👤 Creando usuarios...');
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
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'cliente@empresa1.com',
        password: clientPassword1,
        name: 'Cliente Empresa 1',
        role: 'client',
        organizationId: org1.insertedId,
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'cliente@empresa2.com',
        password: clientPassword2,
        name: 'Cliente Empresa 2',
        role: 'client',
        organizationId: org2.insertedId,
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ Usuarios creados\n');

    // Crear cursos de prueba
    console.log('📚 Creando cursos...');
    await db.collection('courses').insertMany([
      {
        _id: 'course_001',
        title: {
          es: 'Introducción al Phishing',
          en: 'Introduction to Phishing'
        },
        description: {
          es: 'Curso básico sobre identificación y prevención de phishing. Aprende a reconocer correos sospechosos y proteger tu información.',
          en: 'Basic course on phishing identification and prevention. Learn to recognize suspicious emails and protect your information.'
        },
        level: 'basic',
        durationMinutes: 30,
        moduleCount: 4,
        modules: [
          {
            order: 1,
            title: { es: '¿Qué es el Phishing?', en: 'What is Phishing?' },
            content: { 
              es: 'El phishing es un tipo de ataque de ingeniería social donde los atacantes intentan engañarte para obtener información confidencial.',
              en: 'Phishing is a type of social engineering attack where attackers try to trick you into revealing confidential information.'
            },
            videoUrl: 'https://www.youtube.com/watch?v=example1',
            questions: [
              {
                text: { es: '¿Qué es el phishing?', en: 'What is phishing?' },
                options: {
                  es: [
                    'Un ataque de ingeniería social',
                    'Un virus informático',
                    'Un tipo de spam',
                    'Un firewall'
                  ],
                  en: [
                    'A social engineering attack',
                    'A computer virus',
                    'A type of spam',
                    'A firewall'
                  ]
                },
                correctAnswer: 0,
                explanation: {
                  es: 'El phishing es un ataque de ingeniería social que busca engañar a las personas para obtener información confidencial.',
                  en: 'Phishing is a social engineering attack that seeks to trick people into revealing confidential information.'
                }
              }
            ]
          },
          {
            order: 2,
            title: { es: 'Tipos de Phishing', en: 'Types of Phishing' },
            content: { 
              es: 'Existen varios tipos: email phishing, smishing (SMS), vishing (voz), y spear phishing (dirigido).',
              en: 'There are several types: email phishing, smishing (SMS), vishing (voice), and spear phishing (targeted).'
            },
            videoUrl: 'https://www.youtube.com/watch?v=example2',
            questions: []
          },
          {
            order: 3,
            title: { es: 'Señales de Alerta', en: 'Warning Signs' },
            content: { 
              es: 'Aprende a identificar URLs sospechosas, remitentes desconocidos, y solicitudes urgentes de información.',
              en: 'Learn to identify suspicious URLs, unknown senders, and urgent requests for information.'
            },
            videoUrl: 'https://www.youtube.com/watch?v=example3',
            questions: []
          },
          {
            order: 4,
            title: { es: 'Cómo Protegerte', en: 'How to Protect Yourself' },
            content: { 
              es: 'Verifica siempre el remitente, no hagas click en enlaces sospechosos, y reporta intentos de phishing.',
              en: 'Always verify the sender, don\'t click suspicious links, and report phishing attempts.'
            },
            videoUrl: 'https://www.youtube.com/watch?v=example4',
            questions: []
          }
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'course_002',
        title: {
          es: 'Técnicas Avanzadas de Detección',
          en: 'Advanced Detection Techniques'
        },
        description: {
          es: 'Curso intermedio para identificar ataques sofisticados de phishing y spear phishing.',
          en: 'Intermediate course to identify sophisticated phishing and spear phishing attacks.'
        },
        level: 'intermediate',
        durationMinutes: 45,
        moduleCount: 6,
        modules: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'course_003',
        title: {
          es: 'Ingeniería Social y Protección Corporativa',
          en: 'Social Engineering and Corporate Protection'
        },
        description: {
          es: 'Curso avanzado sobre técnicas de ingeniería social y cómo proteger a tu organización.',
          en: 'Advanced course on social engineering techniques and how to protect your organization.'
        },
        level: 'advanced',
        durationMinutes: 60,
        moduleCount: 8,
        modules: [],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ Cursos creados\n');

    // Crear algunos pagos de prueba (pendientes de aprobación)
    console.log('💳 Creando pagos de prueba...');
    await db.collection('payments').insertMany([
      {
        organizationId: org1.insertedId,
        method: 'mobile',
        amount: 220,
        currency: 'VES',
        peopleCredits: 1,
        status: 'pending',
        referenceNumber: '12345678',
        bankName: 'Banesco',
        phoneNumber: '0414-1234567',
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        organizationId: org2.insertedId,
        method: 'bank',
        amount: 29.95,
        currency: 'USD',
        peopleCredits: 5,
        status: 'pending',
        referenceNumber: '87654321',
        bankName: 'Bancaribe',
        accountHolder: 'Tech Solutions Corp',
        receiptUrl: '/uploads/receipt_001.pdf',
        transferDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    console.log('✅ Pagos de prueba creados\n');

    // Crear campaña de ejemplo
    console.log('📢 Creando campaña de ejemplo...');
    await db.collection('campaigns').insertOne({
      organizationId: org1.insertedId,
      courseId: 'course_001',
      name: 'Capacitación Q4 2024',
      people: [
        {
          name: 'Juan Pérez',
          phone: '+58 414 1234567',
          email: 'juan.perez@empresa1.com',
          department: 'IT',
          status: 'pending'
        },
        {
          name: 'María García',
          phone: '+58 424 9876543',
          email: 'maria.garcia@empresa1.com',
          department: 'Marketing',
          status: 'in-progress'
        },
        {
          name: 'Carlos Rodríguez',
          phone: '+58 412 5554321',
          email: 'carlos.rodriguez@empresa1.com',
          department: 'Ventas',
          status: 'completed'
        }
      ],
      status: 'active',
      startDate: new Date('2024-10-25'),
      endDate: new Date('2024-11-15'),
      creditsUsed: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Campaña de ejemplo creada\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('✨ Base de datos inicializada exitosamente!\n');
    console.log('🔐 Credenciales de acceso:\n');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ ADMIN                                               │');
    console.log('│ Email:    admin@niblion.com                         │');
    console.log('│ Password: Admin123!                                 │');
    console.log('└─────────────────────────────────────────────────────┘\n');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ CLIENTE 1 (Empresa Demo S.A.)                       │');
    console.log('│ Email:    cliente@empresa1.com                      │');
    console.log('│ Password: Cliente123!                               │');
    console.log('│ Créditos: 100 personas                              │');
    console.log('└─────────────────────────────────────────────────────┘\n');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ CLIENTE 2 (Tech Solutions Corp)                     │');
    console.log('│ Email:    cliente@empresa2.com                      │');
    console.log('│ Password: Cliente456!                               │');
    console.log('│ Créditos: 50 personas                               │');
    console.log('└─────────────────────────────────────────────────────┘\n');
    console.log('📊 Datos adicionales:');
    console.log('   - 3 cursos creados');
    console.log('   - 2 pagos pendientes de aprobación');
    console.log('   - 1 campaña activa con 3 personas\n');
    console.log('🚀 Puedes empezar a probar en: http://localhost:5174');
    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Ejecutar seed
seedDatabase()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
