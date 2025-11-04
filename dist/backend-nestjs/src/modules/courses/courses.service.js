"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CoursesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_schema_1 = require("../database/schemas/course.schema");
let CoursesService = CoursesService_1 = class CoursesService {
    courseModel;
    logger = new common_1.Logger(CoursesService_1.name);
    constructor(courseModel) {
        this.courseModel = courseModel;
    }
    async create(createCourseDto, userId) {
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
        }
        catch (error) {
            this.logger.error(`Error creando curso: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Error al crear el curso');
        }
    }
    async findAll(filters) {
        try {
            const query = {};
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
        }
        catch (error) {
            this.logger.error(`Error obteniendo cursos: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Error al obtener cursos');
        }
    }
    async findOne(id) {
        try {
            const course = await this.courseModel
                .findById(id)
                .populate('createdBy', 'name email')
                .exec();
            if (!course) {
                throw new common_1.NotFoundException(`Curso con ID ${id} no encontrado`);
            }
            return {
                success: true,
                course,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error obteniendo curso: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Error al obtener el curso');
        }
    }
    async update(id, updateCourseDto, userId) {
        try {
            const course = await this.courseModel.findById(id).exec();
            if (!course) {
                throw new common_1.NotFoundException(`Curso con ID ${id} no encontrado`);
            }
            Object.assign(course, updateCourseDto);
            const updated = await course.save();
            this.logger.log(`Curso actualizado: ${id}`);
            return {
                success: true,
                message: 'Curso actualizado exitosamente',
                course: updated,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error actualizando curso: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Error al actualizar el curso');
        }
    }
    async remove(id) {
        try {
            const course = await this.courseModel.findById(id).exec();
            if (!course) {
                throw new common_1.NotFoundException(`Curso con ID ${id} no encontrado`);
            }
            course.isActive = false;
            await course.save();
            this.logger.log(`Curso desactivado: ${id}`);
            return {
                success: true,
                message: 'Curso desactivado exitosamente',
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error eliminando curso: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Error al eliminar el curso');
        }
    }
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
        }
        catch (error) {
            this.logger.error(`Error obteniendo estadísticas: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Error al obtener estadísticas');
        }
    }
    async incrementEnrolled(courseId) {
        await this.courseModel.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } }).exec();
    }
    async incrementCompleted(courseId) {
        await this.courseModel.findByIdAndUpdate(courseId, { $inc: { completedCount: 1 } }).exec();
    }
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = CoursesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CoursesService);
//# sourceMappingURL=courses.service.js.map