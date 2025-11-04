import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Servicio de Autenticación
 * Maneja login, registro, validación de usuarios y generación de tokens JWT
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Login de usuario
   * Valida credenciales y genera tokens JWT
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      // Buscar usuario por email
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        this.logger.warn(`Intento de login fallido - Usuario no encontrado: ${email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar que la cuenta esté activa
      if (user.status !== 'active') {
        this.logger.warn(`Intento de login - Cuenta inactiva: ${email}`);
        throw new UnauthorizedException('Cuenta inactiva o suspendida');
      }

      // Verificar contraseña
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        this.logger.warn(`Intento de login fallido - Contraseña incorrecta: ${email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Actualizar último login
      user.lastLoginAt = new Date();
      await user.save();

      // Generar tokens
      const tokens = await this.generateTokens(user);

      // Guardar refresh token en la base de datos
      user.refreshToken = tokens.refreshToken;
      await user.save();

      this.logger.log(`Usuario logueado exitosamente: ${email}`);

      return {
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyName: user.companyName,
          credits: user.credits,
          status: user.status,
        },
        ...tokens,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Error en login: ${error.message}`, error.stack);
      throw new BadRequestException('Error al procesar login');
    }
  }

  /**
   * Registro de nuevo usuario (cliente)
   */
  async register(registerDto: RegisterDto) {
    const { email, password, name, companyName, phone, employees } = registerDto;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userModel.findOne({ email }).exec();

      if (existingUser) {
        this.logger.warn(`Intento de registro - Email ya existe: ${email}`);
        throw new ConflictException('Este correo electrónico ya está registrado');
      }

      // Hash de contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear nuevo usuario
      const newUser = new this.userModel({
        email,
        password: hashedPassword,
        name,
        companyName: companyName || name,
        phone,
        employees: employees || 0,
        role: 'client', // Por defecto todos los registros son clientes
        status: 'active',
        credits: 0,
      });

      await newUser.save();

      this.logger.log(`Nuevo usuario registrado: ${email}`);

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(`Error en registro: ${error.message}`, error.stack);
      throw new BadRequestException('Error al procesar registro');
    }
  }

  /**
   * Validar usuario para JWT strategy
   */
  async validateUser(userId: string) {
    try {
      const user = await this.userModel.findById(userId).exec();

      if (!user || user.status !== 'active') {
        return null;
      }

      return {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        credits: user.credits,
      };
    } catch (error) {
      this.logger.error(`Error validando usuario: ${error.message}`);
      return null;
    }
  }

  /**
   * Generar tokens JWT (access + refresh)
   */
  private async generateTokens(user: User) {
    const payload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d', // 1 día
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d', // 7 días
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refrescar token de acceso
   */
  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);

      const user = await this.userModel.findById(payload.sub).exec();

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Token inválido');
      }

      const tokens = await this.generateTokens(user);
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return {
        success: true,
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Error refrescando token: ${error.message}`);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * Logout - invalidar refresh token
   */
  async logout(userId: string) {
    try {
      await this.userModel.findByIdAndUpdate(userId, {
        refreshToken: null,
      }).exec();

      this.logger.log(`Usuario logout: ${userId}`);

      return {
        success: true,
        message: 'Sesión cerrada exitosamente',
      };
    } catch (error) {
      this.logger.error(`Error en logout: ${error.message}`);
      throw new BadRequestException('Error al cerrar sesión');
    }
  }
}
