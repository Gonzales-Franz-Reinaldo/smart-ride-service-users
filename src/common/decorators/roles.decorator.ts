import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  PASAJERO = 'pasajero',
  CONDUCTOR = 'conductor',
  ADMIN = 'admin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
