import { SetMetadata, applyDecorators } from '@nestjs/common';
import { authedGuard } from '../guards/guards.guard';

// export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export const ROLES_KEY = 'roles'

export function SetAttrs(...attrs: string[]){
  return SetMetadata(ROLES_KEY, attrs);
}

export function Roles(...attrs: string[]){
  return applyDecorators(
    authedGuard(),
    SetAttrs(...attrs),
  );
}
