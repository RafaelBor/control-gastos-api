import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-role.interface';

export const META_ROLE = 'role'

export const RoleProtected = (...args: ValidRoles[]) => {

    console.log(args)
    return SetMetadata(META_ROLE, args)
};
