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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../database/schemas/user.schema");
let AuthService = AuthService_1 = class AuthService {
    userModel;
    jwtService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        try {
            const user = await this.userModel.findOne({ email }).exec();
            if (!user) {
                this.logger.warn(`Intento de login fallido - Usuario no encontrado: ${email}`);
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            if (user.status !== 'active') {
                this.logger.warn(`Intento de login - Cuenta inactiva: ${email}`);
                throw new common_1.UnauthorizedException('Cuenta inactiva o suspendida');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                this.logger.warn(`Intento de login fallido - Contraseña incorrecta: ${email}`);
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            user.lastLoginAt = new Date();
            await user.save();
            const tokens = await this.generateTokens(user);
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
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Error en login: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Error al procesar login');
        }
    }
    async register(registerDto) {
        const { email, password, name, companyName, phone, employees } = registerDto;
        try {
            const existingUser = await this.userModel.findOne({ email }).exec();
            if (existingUser) {
                this.logger.warn(`Intento de registro - Email ya existe: ${email}`);
                throw new common_1.ConflictException('Este correo electrónico ya está registrado');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new this.userModel({
                email,
                password: hashedPassword,
                name,
                companyName: companyName || name,
                phone,
                employees: employees || 0,
                role: 'client',
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
        }
        catch (error) {
            if (error instanceof common_1.ConflictException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            this.logger.error(`Error en registro: ${error.message}`, error.stack);
            throw new common_1.BadRequestException('Error al procesar registro');
        }
    }
    async validateUser(userId) {
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
        }
        catch (error) {
            this.logger.error(`Error validando usuario: ${error.message}`);
            return null;
        }
    }
    async generateTokens(user) {
        const payload = {
            sub: String(user._id),
            email: user.email,
            role: user.role,
        };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '1d',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            expiresIn: '7d',
        });
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);
            const user = await this.userModel.findById(payload.sub).exec();
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Token inválido');
            }
            const tokens = await this.generateTokens(user);
            user.refreshToken = tokens.refreshToken;
            await user.save();
            return {
                success: true,
                ...tokens,
            };
        }
        catch (error) {
            this.logger.error(`Error refrescando token: ${error.message}`);
            throw new common_1.UnauthorizedException('Token inválido o expirado');
        }
    }
    async logout(userId) {
        try {
            await this.userModel.findByIdAndUpdate(userId, {
                refreshToken: null,
            }).exec();
            this.logger.log(`Usuario logout: ${userId}`);
            return {
                success: true,
                message: 'Sesión cerrada exitosamente',
            };
        }
        catch (error) {
            this.logger.error(`Error en logout: ${error.message}`);
            throw new common_1.BadRequestException('Error al cerrar sesión');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map