import { Document } from 'mongoose';
export declare class UserSession extends Document {
    numeroUsuario: string;
    evento: string;
    iniciadoEn: Date;
    usarPlantilla: boolean;
    timestamp: Date;
    fecha_inicio: Date;
}
export declare const UserSessionSchema: import("mongoose").Schema<UserSession, import("mongoose").Model<UserSession, any, any, any, Document<unknown, any, UserSession, any, {}> & UserSession & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserSession, Document<unknown, {}, import("mongoose").FlatRecord<UserSession>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserSession> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
