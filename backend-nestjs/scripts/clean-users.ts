import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { Model } from 'mongoose';
import { User } from '../src/modules/database/schemas/user.schema';

/**
 * Script para eliminar todos los usuarios excepto el super admin
 * Email del super admin: super@niblion.com
 * 
 * Uso: npx ts-node scripts/clean-users.ts
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Obtener el modelo de User
    const userModel = app.get<Model<User>>('UserModel');

    // Email del super admin que NO debe ser eliminado
    const superAdminEmail = 'super@niblion.com';

    // Contar usuarios antes de eliminar
    const totalUsersBefore = await userModel.countDocuments();
    console.log(`\n📊 Total de usuarios en la base de datos: ${totalUsersBefore}`);

    // Verificar si existe el super admin
    const superAdmin = await userModel.findOne({ email: superAdminEmail });
    
    if (!superAdmin) {
      console.log(`\n❌ ERROR: No se encontró el super admin con email: ${superAdminEmail}`);
      console.log('   Por favor, crea primero el super admin antes de ejecutar este script.');
      await app.close();
      return;
    }

    console.log(`\n✅ Super admin encontrado:`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Nombre: ${superAdmin.name}`);
    console.log(`   Role: ${superAdmin.role}`);

    // Eliminar todos los usuarios EXCEPTO el super admin
    const deleteResult = await userModel.deleteMany({
      email: { $ne: superAdminEmail }
    });

    console.log(`\n🗑️  Usuarios eliminados: ${deleteResult.deletedCount}`);

    // Contar usuarios después de eliminar
    const totalUsersAfter = await userModel.countDocuments();
    console.log(`📊 Total de usuarios restantes: ${totalUsersAfter}`);

    if (totalUsersAfter === 1) {
      console.log(`\n✅ ¡Limpieza completada exitosamente!`);
      console.log(`   Solo queda el super admin: ${superAdminEmail}`);
    } else {
      console.log(`\n⚠️  ADVERTENCIA: Quedaron ${totalUsersAfter} usuarios en la base de datos.`);
    }

  } catch (error) {
    console.error('\n❌ Error durante la limpieza de usuarios:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
