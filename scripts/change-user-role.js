/**
 * Script para cambiar el rol de un usuario
 * Uso: node scripts/change-user-role.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  companyName: String,
  credits: Number,
  status: String,
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function changeUserRole() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(process.env.DATABASE_URI);
    console.log('✅ Conectado a MongoDB');

    const email = 'admin@niblion.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ Usuario ${email} no encontrado`);
      process.exit(1);
    }

    console.log('\n📋 Usuario actual:');
    console.log('   Email:', user.email);
    console.log('   Nombre:', user.name);
    console.log('   Rol actual:', user.role);

    user.role = 'super_admin';
    await user.save();

    console.log('\n✅ Rol actualizado exitosamente!');
    console.log('   Nuevo rol:', user.role);
    console.log('\n💡 Ahora puedes hacer login y acceder a /admin');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

changeUserRole();
