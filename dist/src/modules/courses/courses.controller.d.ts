import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    create(createCourseDto: CreateCourseDto, user: any): Promise<{
        success: boolean;
        message: string;
        course: import("mongoose").Document<unknown, {}, import("../database/schemas/course.schema").Course, {}, {}> & import("../database/schemas/course.schema").Course & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    findAll(level?: string, language?: string, isActive?: boolean, search?: string): Promise<{
        success: boolean;
        count: number;
        courses: (import("mongoose").Document<unknown, {}, import("../database/schemas/course.schema").Course, {}, {}> & import("../database/schemas/course.schema").Course & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    getStats(): Promise<{
        success: boolean;
        stats: {
            total: number;
            active: number;
            inactive: number;
            byLevel: any;
            byLanguage: any;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        course: import("mongoose").Document<unknown, {}, import("../database/schemas/course.schema").Course, {}, {}> & import("../database/schemas/course.schema").Course & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto, user: any): Promise<{
        success: boolean;
        message: string;
        course: import("mongoose").Document<unknown, {}, import("../database/schemas/course.schema").Course, {}, {}> & import("../database/schemas/course.schema").Course & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
