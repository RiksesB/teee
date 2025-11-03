import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from '../database/schemas/user.schema';

/**
 * Auth Module
 * Módulo de autenticación con JWT
 */
@Module({
  imports: [
    // Importar el schema de User
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    // Configurar Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configurar JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'niblion-secret-key-change-in-production',
        signOptions: {
          expiresIn: '1d', // 1 día por defecto
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
