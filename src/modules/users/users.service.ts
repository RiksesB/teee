import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Servicio de Gestión de Usuarios
 * Maneja CRUD completo de usuarios (clientes y admins)
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  /**
   * Crear un nuevo usuario
   * Solo super_admin puede crear usuarios
   */
  async create(createUserDto: CreateUserDto) {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.userModel.findOne({ email: createUserDto.email });
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role || 'client',
        status: createUserDto.status || 'active',
        credits: createUserDto.credits || 0,
      });

      const saved = await newUser.save();
      this.logger.log(`Nuevo usuario creado: ${saved.email} (ID: ${saved._id})`);

      // No devolver la contraseña
      const userObject = saved.toObject();
      delete userObject.password;

      return {
        success: true,
        message: 'Usuario creado exitosamente',
        user: userObject,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error creando usuario: ${error.message}`, error.stack);
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  /**
   * Obtener todos los usuarios
   * Con filtros opcionales
   */
  async findAll(filters?: {
    role?: string;
    status?: string;
    search?: string;
  }) {
    try {
      const query: any = {};

      if (filters?.role) {
        query.role = filters.role;
      }

      if (filters?.status) {
        query.status = filters.status;
      }

      if (filters?.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { companyName: { $regex: filters.search, $options: 'i' } },
        ];
      }

      const users = await this.userModel
        .find(query)
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .exec();

      this.logger.log(`Usuarios obtenidos: ${users.length}`);

      return {
        success: true,
        count: users.length,
        users,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo usuarios: ${error.message}`, error.stack);
      throw new BadRequestException('Error al obtener usuarios');
    }
  }

  /**
   * Obtener un usuario por ID
   */
  async findOne(id: string) {
    try {
      const user = await this.userModel
        .findById(id)
        .select('-password -refreshToken')
        .exec();

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error obteniendo usuario: ${error.message}`, error.stack);
      throw new BadRequestException('Error al obtener el usuario');
    }
  }

  /**
   * Actualizar un usuario
   * Solo super_admin puede actualizar
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Si se actualiza el email, verificar que no exista
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userModel.findOne({ email: updateUserDto.email });
        if (existingUser) {
          throw new ConflictException('El email ya está registrado');
        }
      }

      // Si se actualiza la contraseña, hashearla
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      // Actualizar usuario
      Object.assign(user, updateUserDto);
      const updated = await user.save();

      this.logger.log(`Usuario actualizado: ${id}`);

      // No devolver la contraseña
      const userObject = updated.toObject();
      delete userObject.password;
      delete userObject.refreshToken;

      return {
        success: true,
        message: 'Usuario actualizado exitosamente',
        user: userObject,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Error actualizando usuario: ${error.message}`, error.stack);
      throw new BadRequestException('Error al actualizar el usuario');
    }
  }

  /**
   * Eliminar un usuario (soft delete)
   * Solo super_admin puede eliminar
   */
  async remove(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Soft delete: marcar como inactivo en lugar de eliminar
      user.status = 'inactive';
      await user.save();

      this.logger.log(`Usuario desactivado: ${id}`);

      return {
        success: true,
        message: 'Usuario desactivado exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error eliminando usuario: ${error.message}`, error.stack);
      throw new BadRequestException('Error al eliminar el usuario');
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getStats() {
    try {
      const [total, byRole, byStatus] = await Promise.all([
        this.userModel.countDocuments().exec(),
        this.userModel.aggregate([
          { $group: { _id: '$role', count: { $sum: 1 } } }
        ]).exec(),
        this.userModel.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]).exec(),
      ]);

      return {
        success: true,
        stats: {
          total,
          byRole: byRole.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {}),
          byStatus: byStatus.reduce((acc, curr) => {
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
   * Agregar créditos a un usuario
   */
  async addCredits(userId: string, credits: number) {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }

      user.credits = (user.credits || 0) + credits;
      await user.save();

      this.logger.log(`Créditos agregados a usuario ${userId}: +${credits}`);

      return {
        success: true,
        message: `${credits} créditos agregados exitosamente`,
        newBalance: user.credits,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error agregando créditos: ${error.message}`, error.stack);
      throw new BadRequestException('Error al agregar créditos');
    }
  }

  /**
   * Deducir créditos de un usuario
   */
  async deductCredits(userId: string, credits: number) {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
      }

      if (user.credits < credits) {
        throw new BadRequestException('Créditos insuficientes');
      }

      user.credits -= credits;
      await user.save();

      this.logger.log(`Créditos deducidos de usuario ${userId}: -${credits}`);

      return {
        success: true,
        message: `${credits} créditos deducidos exitosamente`,
        newBalance: user.credits,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Error deduciendo créditos: ${error.message}`, error.stack);
      throw new BadRequestException('Error al deducir créditos');
    }
  }
}
