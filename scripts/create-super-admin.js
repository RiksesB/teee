const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

/**
 * Script para crear un usuario super_admin
 * Uso: node scripts/create-super-admin.js
 */
async function createSuperAdmin() {
  const uri = process.env.DATABASE_URI;

  if (!uri) {
    console.error('❌ ERROR: DATABASE_URI no está configurada en .env');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const database = client.db();
    const users = database.collection('users');

    // Datos del super admin
    const superAdminEmail = 'super@niblion.com';
    const superAdminPassword = 'super123'; // CAMBIAR EN PRODUCCIÓN

    // Verificar si ya existe
    const existing = await users.findOne({ email: superAdminEmail });

    if (existing) {
      console.log('');
      console.log('❌ El usuario super_admin ya existe');
      console.log('   Email:', existing.email);
      console.log('   Role:', existing.role);
      console.log('   Name:', existing.name);
      console.log('');
      return;
    }

    // Crear hash de contraseña
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);

    // Crear super admin
    const superAdmin = {
      email: superAdminEmail,
      password: hashedPassword,
      name: 'Super Administrador',
      role: 'super_admin',
      status: 'active',
      credits: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await users.insertOne(superAdmin);

    console.log('');
    console.log('✅ Usuario super_admin creado exitosamente!');
    console.log('');
    console.log('   📧 Email:', superAdminEmail);
    console.log('   🔑 Password:', superAdminPassword);
    console.log('   👤 Role:', superAdmin.role);
    console.log('   🆔 ID:', result.insertedId);
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('✅ Conexión cerrada');
  }
}

createSuperAdmin();
