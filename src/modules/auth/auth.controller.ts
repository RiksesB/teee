import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * Auth Controller
 * Endpoints de autenticación: login, register, me, logout
 */
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Login de usuario
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`Intento de login: ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  /**
   * POST /auth/register
   * Registro de nuevo usuario (cliente)
   */
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log(`Intento de registro: ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

  /**
   * GET /auth/me
   * Obtener datos del usuario actual
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    this.logger.debug(`Usuario actual: ${user.email}`);
    return {
      success: true,
      user,
    };
  }

  /**
   * POST /auth/logout
   * Cerrar sesión
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: any) {
    this.logger.log(`Logout de usuario: ${user.email}`);
    return this.authService.logout(user.id);
  }

  /**
   * POST /auth/refresh
   * Refrescar access token
   */
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    this.logger.debug('Refreshing access token');
    return this.authService.refreshTokens(refreshToken);
  }
}
