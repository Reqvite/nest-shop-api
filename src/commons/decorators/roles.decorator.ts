import {SetMetadata} from '@nestjs/common';
import {UserRole} from '@/entities/auth/model/user.model';

export const HasRoles = (roles: UserRole[]) => SetMetadata('roles', roles);
