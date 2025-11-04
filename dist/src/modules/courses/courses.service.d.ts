import { Model } from 'mongoose';
import { Course } from '../database/schemas/course.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private courseModel;
    private readonly logger;
    constructor(courseModel: Model<Course>);
    create(createCourseDto: CreateCourseDto, userId: string): Promise<{
        success: boolean;
        message: string;
        course: import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    findAll(filters?: {
        level?: string;
        language?: string;
        isActive?: boolean;
        search?: string;
    }): Promise<{
        success: boolean;
        count: number;
        courses: (import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        course: import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, updateCourseDto: UpdateCourseDto, userId: string): Promise<{
        success: boolean;
        message: string;
        course: import("mongoose").Document<unknown, {}, Course, {}, {}> & Course & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
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
    incrementEnrolled(courseId: string): Promise<void>;
    incrementCompleted(courseId: string): Promise<void>;
}
