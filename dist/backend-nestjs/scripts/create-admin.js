"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    try {
        const userModel = app.get('UserModel');
        const adminEmail = 'admin@niblion.com';
        const adminPassword = 'admin123';
        const existingAdmin = await userModel.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('❌ El usuario admin ya existe:', adminEmail);
            console.log('   Email:', existingAdmin.email);
            console.log('   Role:', existingAdmin.role);
            await app.close();
            return;
        }
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
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
    }
    catch (error) {
        console.error('❌ Error creando usuario admin:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=create-admin.js.map