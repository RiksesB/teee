import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from '../database/schemas/user.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private userModel;
    private jwtService;
    private readonly logger;
    constructor(userModel: Model<User>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
        user: {
            id: unknown;
            email: string;
            name: string;
            role: string;
            companyName: string | undefined;
            credits: number;
            status: string;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        user: {
            id: unknown;
            email: string;
            name: string;
            role: string;
        };
    }>;
    validateUser(userId: string): Promise<{
        id: unknown;
        email: string;
        name: string;
        role: string;
        credits: number;
    } | null>;
    private generateTokens;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
    }>;
    logout(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
