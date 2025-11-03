import { SetMetadata } from '@nestjs/common';

/**
 * Decorador @Roles()
 * Especifica qué roles pueden acceder a una ruta
 * Ejemplo: @Roles('admin', 'client')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
