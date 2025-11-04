import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    private readonly logger;
    constructor(authService: AuthService);
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
    getProfile(user: any): Promise<{
        success: boolean;
        user: any;
    }>;
    logout(user: any): Promise<{
        success: boolean;
        message: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        success: boolean;
    }>;
}
