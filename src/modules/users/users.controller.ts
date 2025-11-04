import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Controlador de Usuarios
 * Gestiona endpoints REST para administración de usuarios/clientes
 * Solo super_admin puede crear/modificar/eliminar usuarios
 */
@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Crear nuevo usuario
   * Solo super_admin
   */
  @Post()
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Crear nuevo usuario',
    description: 'Solo super_admin puede crear usuarios',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * Obtener todos los usuarios
   * Accesible por super_admin y admin
   */
  @Get()
  @Roles('super_admin', 'admin')
  @ApiOperation({
    summary: 'Listar todos los usuarios',
    description: 'Obtiene lista de usuarios con filtros opcionales',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['super_admin', 'admin', 'client'],
    description: 'Filtrar por rol',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'suspended'],
    description: 'Filtrar por estado',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Búsqueda de texto en nombre, email y empresa',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente' })
  async findAll(
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    if (role) filters.role = role;
    if (status) filters.status = status;
    if (search) filters.search = search;

    return this.usersService.findAll(filters);
  }

  /**
   * Obtener estadísticas de usuarios
   * Accesible por super_admin y admin
   */
  @Get('stats')
  @Roles('super_admin', 'admin')
  @ApiOperation({
    summary: 'Obtener estadísticas de usuarios',
    description: 'Estadísticas agregadas de todos los usuarios',
  })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  async getStats() {
    return this.usersService.getStats();
  }

  /**
   * Obtener un usuario por ID
   * Accesible por super_admin y admin
   */
  @Get(':id')
  @Roles('super_admin', 'admin')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description: 'Obtiene detalles completos de un usuario específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario (MongoDB ObjectId)',
  })
  @ApiResponse({ status: 200, description: 'Usuario encontrado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Actualizar usuario
   * Solo super_admin
   */
  @Put(':id')
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Actualizar usuario',
    description: 'Solo super_admin puede actualizar usuarios',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Eliminar usuario (soft delete)
   * Solo super_admin
   */
  @Delete(':id')
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Eliminar usuario (desactivar)',
    description: 'Realiza soft delete marcando el usuario como inactivo. Solo super_admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
  })
  @ApiResponse({ status: 200, description: 'Usuario desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  /**
   * Agregar créditos a un usuario
   * Solo super_admin y admin
   */
  @Post(':id/credits/add')
  @Roles('super_admin', 'admin')
  @ApiOperation({
    summary: 'Agregar créditos a un usuario',
    description: 'Incrementa el saldo de créditos del usuario',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
  })
  @ApiResponse({ status: 200, description: 'Créditos agregados exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async addCredits(
    @Param('id') id: string,
    @Body('credits') credits: number,
  ) {
    return this.usersService.addCredits(id, credits);
  }
}
