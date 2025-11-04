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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const courses_service_1 = require("./courses.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
let CoursesController = class CoursesController {
    coursesService;
    constructor(coursesService) {
        this.coursesService = coursesService;
    }
    async create(createCourseDto, user) {
        return this.coursesService.create(createCourseDto, user.userId);
    }
    async findAll(level, language, isActive, search) {
        const filters = {};
        if (level)
            filters.level = level;
        if (language)
            filters.language = language;
        if (isActive !== undefined)
            filters.isActive = isActive;
        if (search)
            filters.search = search;
        return this.coursesService.findAll(filters);
    }
    async getStats() {
        return this.coursesService.getStats();
    }
    async findOne(id) {
        return this.coursesService.findOne(id);
    }
    async update(id, updateCourseDto, user) {
        return this.coursesService.update(id, updateCourseDto, user.userId);
    }
    async remove(id) {
        return this.coursesService.remove(id);
    }
};
exports.CoursesController = CoursesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('super_admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear nuevo curso',
        description: 'Solo super_admin puede crear cursos',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - requiere rol super_admin' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_course_dto_1.CreateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Listar todos los cursos',
        description: 'Obtiene lista de cursos con filtros opcionales',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'level',
        required: false,
        enum: ['basic', 'intermediate', 'advanced'],
        description: 'Filtrar por nivel',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'language',
        required: false,
        description: 'Filtrar por idioma (ej: es, en)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isActive',
        required: false,
        type: Boolean,
        description: 'Filtrar por estado activo/inactivo',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'search',
        required: false,
        description: 'Búsqueda de texto en título y descripción',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Query)('level')),
    __param(1, (0, common_1.Query)('language')),
    __param(2, (0, common_1.Query)('isActive')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)('super_admin', 'admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener estadísticas de cursos',
        description: 'Estadísticas agregadas de todos los cursos',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - requiere rol super_admin o admin' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener curso por ID',
        description: 'Obtiene detalles completos de un curso específico',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del curso (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Curso no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Actualizar curso',
        description: 'Solo super_admin puede actualizar cursos',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del curso a actualizar',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Curso no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - requiere rol super_admin' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_course_dto_1.UpdateCourseDto, Object]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('super_admin'),
    (0, swagger_1.ApiOperation)({
        summary: 'Eliminar curso (desactivar)',
        description: 'Realiza soft delete marcando el curso como inactivo. Solo super_admin.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'ID del curso a eliminar',
        example: '507f1f77bcf86cd799439011',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Curso desactivado exitosamente',
        schema: {
            example: {
                success: true,
                message: 'Curso desactivado exitosamente',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Curso no encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido - requiere rol super_admin' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CoursesController.prototype, "remove", null);
exports.CoursesController = CoursesController = __decorate([
    (0, swagger_1.ApiTags)('Cursos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('courses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [courses_service_1.CoursesService])
], CoursesController);
//# sourceMappingURL=courses.controller.js.map