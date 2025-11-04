import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../database/schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

/**
 * Servicio de Gestión de Cursos
 * Maneja CRUD completo de cursos de capacitación
 */
@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  /**
   * Crear un nuevo curso
   * Solo super_admin puede crear cursos
   */
  async create(createCourseDto: CreateCourseDto, userId: string) {
    try {
      const newCourse = new this.courseModel({
        ...createCourseDto,
        createdBy: userId,
        enrolledCount: 0,
        completedCount: 0,
      });

      const saved = await newCourse.save();
      this.logger.log(`Nuevo curso creado: ${saved.title} (ID: ${saved._id})`);

      return {
        success: true,
        message: 'Curso creado exitosamente',
        course: saved,
      };
    } catch (error) {
      this.logger.error(`Error creando curso: ${error.message}`, error.stack);
      throw new BadRequestException('Error al crear el curso');
    }
  }

  /**
   * Obtener todos los cursos
   * Con filtros opcionales
   */
  async findAll(filters?: {
    level?: string;
    language?: string;
    isActive?: boolean;
    search?: string;
  }) {
    try {
      const query: any = {};

      if (filters?.level) {
        query.level = filters.level;
      }

      if (filters?.language) {
        query.language = filters.language;
      }

      if (filters?.isActive !== undefined) {
        query.isActive = filters.isActive;
      }

      if (filters?.search) {
        query.$text = { $search: filters.search };
      }

      const courses = await this.courseModel
        .find(query)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .exec();

      this.logger.log(`Cursos obtenidos: ${courses.length}`);

      return {
        success: true,
        count: courses.length,
        courses,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo cursos: ${error.message}`, error.stack);
      throw new BadRequestException('Error al obtener cursos');
    }
  }

  /**
   * Obtener un curso por ID
   */
  async findOne(id: string) {
    try {
      const course = await this.courseModel
        .findById(id)
        .populate('createdBy', 'name email')
        .exec();

      if (!course) {
        throw new NotFoundException(`Curso con ID ${id} no encontrado`);
      }

      return {
        success: true,
        course,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error obteniendo curso: ${error.message}`, error.stack);
      throw new BadRequestException('Error al obtener el curso');
    }
  }

  /**
   * Actualizar un curso
   * Solo super_admin puede actualizar
   */
  async update(id: string, updateCourseDto: UpdateCourseDto, userId: string) {
    try {
      const course = await this.courseModel.findById(id).exec();

      if (!course) {
        throw new NotFoundException(`Curso con ID ${id} no encontrado`);
      }

      // Actualizar curso
      Object.assign(course, updateCourseDto);
      const updated = await course.save();

      this.logger.log(`Curso actualizado: ${id}`);

      return {
        success: true,
        message: 'Curso actualizado exitosamente',
        course: updated,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error actualizando curso: ${error.message}`, error.stack);
      throw new BadRequestException('Error al actualizar el curso');
    }
  }

  /**
   * Eliminar un curso (soft delete)
   * Solo super_admin puede eliminar
   */
  async remove(id: string) {
    try {
      const course = await this.courseModel.findById(id).exec();

      if (!course) {
        throw new NotFoundException(`Curso con ID ${id} no encontrado`);
      }

      // Soft delete: marcar como inactivo en lugar de eliminar
      course.isActive = false;
      await course.save();

      this.logger.log(`Curso desactivado: ${id}`);

      return {
        success: true,
        message: 'Curso desactivado exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error eliminando curso: ${error.message}`, error.stack);
      throw new BadRequestException('Error al eliminar el curso');
    }
  }

  /**
   * Obtener estadísticas de cursos
   */
  async getStats() {
    try {
      const [total, active, byLevel, byLanguage] = await Promise.all([
        this.courseModel.countDocuments().exec(),
        this.courseModel.countDocuments({ isActive: true }).exec(),
        this.courseModel.aggregate([
          { $group: { _id: '$level', count: { $sum: 1 } } }
        ]).exec(),
        this.courseModel.aggregate([
          { $group: { _id: '$language', count: { $sum: 1 } } }
        ]).exec(),
      ]);

      return {
        success: true,
        stats: {
          total,
          active,
          inactive: total - active,
          byLevel: byLevel.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          byLanguage: byLanguage.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
        },
      };
    } catch (error) {
      this.logger.error(`Error obteniendo estadísticas: ${error.message}`, error.stack);
      throw new BadRequestException('Error al obtener estadísticas');
    }
  }

  /**
   * Incrementar contador de inscritos
   */
  async incrementEnrolled(courseId: string) {
    await this.courseModel.findByIdAndUpdate(
      courseId,
      { $inc: { enrolledCount: 1 } }
    ).exec();
  }

  /**
   * Incrementar contador de completados
   */
  async incrementCompleted(courseId: string) {
    await this.courseModel.findByIdAndUpdate(
      courseId,
      { $inc: { completedCount: 1 } }
    ).exec();
  }
}
