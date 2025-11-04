import * as bcrypt from 'bcryptjs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../src/modules/database/schemas/user.schema';

/**
 * Script para crear un usuario administrador por defecto
 * Uso: npm run create-admin
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Obtener el modelo de User
    const userModel = app.get<Model<User>>('UserModel');

    // Datos del admin
    const adminEmail = 'admin@niblion.com';
    const adminPassword = 'admin123'; // Cambiar en producción

    // Verificar si ya existe
    const existingAdmin = await userModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('❌ El usuario admin ya existe:', adminEmail);
      console.log('   Email:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
      await app.close();
      return;
    }

    // Crear hash de contraseña
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Crear admin
    const admin = new userModel({
      email: adminEmail,
      password: hashedPassword,
      name: 'Administrador Niblion',
      role: 'admin',
      status: 'active',
      credits: 0,
    });

    await admin.save();

    console.log('✅ Usuario administrador creado exitosamente!');
    console.log('');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('   Role:', admin.role);
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login en producción');

  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
