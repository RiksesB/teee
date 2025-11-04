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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

/**
 * Controlador de Cursos
 * Gestiona endpoints REST para administración de cursos
 * Solo super_admin puede crear/modificar/eliminar cursos
 */
@ApiTags('Cursos')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Crear nuevo curso
   * Solo super_admin
   */
  @Post()
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Crear nuevo curso',
    description: 'Solo super_admin puede crear cursos',
  })
  @ApiResponse({
    status: 201,
    description: 'Curso creado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Curso creado exitosamente',
        course: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Ciberseguridad Básica',
          description: 'Curso introductorio de ciberseguridad',
          level: 'basic',
          language: 'es',
          modules: [],
          durationMinutes: 30,
          tags: ['seguridad', 'básico'],
          isActive: true,
          createdBy: '507f1f77bcf86cd799439012',
          enrolledCount: 0,
          completedCount: 0,
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido - requiere rol super_admin' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.create(createCourseDto, user.userId);
  }

  /**
   * Obtener todos los cursos
   * Accesible por todos los usuarios autenticados
   */
  @Get()
  @ApiOperation({
    summary: 'Listar todos los cursos',
    description: 'Obtiene lista de cursos con filtros opcionales',
  })
  @ApiQuery({
    name: 'level',
    required: false,
    enum: ['basic', 'intermediate', 'advanced'],
    description: 'Filtrar por nivel',
  })
  @ApiQuery({
    name: 'language',
    required: false,
    description: 'Filtrar por idioma (ej: es, en)',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    type: Boolean,
    description: 'Filtrar por estado activo/inactivo',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Búsqueda de texto en título y descripción',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cursos obtenida exitosamente',
    schema: {
      example: {
        success: true,
        count: 5,
        courses: [
          {
            _id: '507f1f77bcf86cd799439011',
            title: 'Ciberseguridad Básica',
            description: 'Curso introductorio',
            level: 'basic',
            language: 'es',
            isActive: true,
            enrolledCount: 45,
            completedCount: 32,
            createdBy: {
              _id: '507f1f77bcf86cd799439012',
              name: 'Admin Principal',
              email: 'admin@niblion.com',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll(
    @Query('level') level?: string,
    @Query('language') language?: string,
    @Query('isActive') isActive?: boolean,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    if (level) filters.level = level;
    if (language) filters.language = language;
    if (isActive !== undefined) filters.isActive = isActive;
    if (search) filters.search = search;

    return this.coursesService.findAll(filters);
  }

  /**
   * Obtener estadísticas de cursos
   * Accesible por super_admin y admin
   */
  @Get('stats')
  @Roles('super_admin', 'admin')
  @ApiOperation({
    summary: 'Obtener estadísticas de cursos',
    description: 'Estadísticas agregadas de todos los cursos',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas obtenidas exitosamente',
    schema: {
      example: {
        success: true,
        stats: {
          total: 12,
          active: 10,
          inactive: 2,
          byLevel: {
            basic: 5,
            intermediate: 4,
            advanced: 3,
          },
          byLanguage: {
            es: 10,
            en: 2,
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido - requiere rol super_admin o admin' })
  async getStats() {
    return this.coursesService.getStats();
  }

  /**
   * Obtener un curso por ID
   * Accesible por todos los usuarios autenticados
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener curso por ID',
    description: 'Obtiene detalles completos de un curso específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del curso (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Curso encontrado exitosamente',
    schema: {
      example: {
        success: true,
        course: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Ciberseguridad Básica',
          description: 'Curso completo de introducción',
          level: 'basic',
          language: 'es',
          modules: [
            {
              title: 'Módulo 1: Contraseñas',
              content: 'Contenido del módulo...',
              videoUrl: 'https://example.com/video1.mp4',
              questions: [
                {
                  text: '¿Qué es una contraseña segura?',
                  options: ['Opción A', 'Opción B', 'Opción C'],
                  correctAnswer: 1,
                },
              ],
              order: 0,
            },
          ],
          durationMinutes: 45,
          thumbnailUrl: 'https://example.com/thumb.jpg',
          tags: ['seguridad', 'básico'],
          isActive: true,
          createdBy: {
            _id: '507f1f77bcf86cd799439012',
            name: 'Admin Principal',
            email: 'admin@niblion.com',
          },
          enrolledCount: 45,
          completedCount: 32,
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  /**
   * Actualizar curso
   * Solo super_admin
   */
  @Put(':id')
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Actualizar curso',
    description: 'Solo super_admin puede actualizar cursos',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del curso a actualizar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Curso actualizado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Curso actualizado exitosamente',
        course: {
          _id: '507f1f77bcf86cd799439011',
          title: 'Ciberseguridad Básica - Actualizado',
          description: 'Descripción actualizada',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido - requiere rol super_admin' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @CurrentUser() user: any,
  ) {
    return this.coursesService.update(id, updateCourseDto, user.userId);
  }

  /**
   * Eliminar curso (soft delete)
   * Solo super_admin
   */
  @Delete(':id')
  @Roles('super_admin')
  @ApiOperation({
    summary: 'Eliminar curso (desactivar)',
    description: 'Realiza soft delete marcando el curso como inactivo. Solo super_admin.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del curso a eliminar',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Curso desactivado exitosamente',
    schema: {
      example: {
        success: true,
        message: 'Curso desactivado exitosamente',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Curso no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido - requiere rol super_admin' })
  async remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
