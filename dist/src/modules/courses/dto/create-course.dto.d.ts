export declare class QuestionDto {
    question: string;
    options: string[];
    correctAnswer: string;
    feedback?: Record<string, string>;
}
export declare class ModuleDto {
    title: string;
    content?: string;
    videoUrl?: string;
    questions?: QuestionDto[];
    order?: number;
}
export declare class CreateCourseDto {
    title: string;
    description: string;
    level?: string;
    language?: string;
    modules?: ModuleDto[];
    durationMinutes?: number;
    thumbnailUrl?: string;
    tags?: string[];
    isActive?: boolean;
}
