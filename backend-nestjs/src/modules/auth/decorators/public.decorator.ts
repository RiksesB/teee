import { SetMetadata } from '@nestjs/common';

/**
 * Decorador @Public()
 * Marca una ruta como pública (sin autenticación requerida)
 */
export const Public = () => SetMetadata('isPublic', true);
