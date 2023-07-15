import { SetMetadata, createParamDecorator, ExecutionContext, UseInterceptors, applyDecorators } from '@nestjs/common';
import { TIMEOUT_KEY } from '../interceptors/interceptors.constants';
import { TimeoutInterceptor } from '../interceptors/interceptors';
import { User as UserType } from 'src/user/entities/user.entity';
import { NoRestrictKey } from './decorators.contants';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserType;
  },
);

export function Timeouts(timeout_ms: number) {
  return applyDecorators(
    SetMetadata(TIMEOUT_KEY, timeout_ms),
    UseInterceptors(TimeoutInterceptor),
  )
};

export function NoRestrict() {
  return applyDecorators(
    SetMetadata(NoRestrictKey, true)
  )
}