import { Document, Types } from 'mongoose';
export declare class CourseModule {
    title: string;
    content?: string;
    videoUrl?: string;
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
        feedback?: Record<string, string>;
    }[];
    order: number;
}
export declare class Course extends Document {
    title: string;
    description: string;
    level: string;
    language: string;
    modules: CourseModule[];
    durationMinutes: number;
    thumbnailUrl?: string;
    tags: string[];
    isActive: boolean;
    createdBy: Types.ObjectId;
    enrolledCount: number;
    completedCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course, any, {}> & Course & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Course> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
