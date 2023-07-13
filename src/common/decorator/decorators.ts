import { SetMetadata, createParamDecorator, ExecutionContext, UseInterceptors } from '@nestjs/common';
import { TIMEOUT_KEY } from '../interceptors/interceptors.constants';
import { TimeoutInterceptor } from '../interceptors/interceptors';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export function Timeouts(timeout_ms: number) {
  SetMetadata(TIMEOUT_KEY, timeout_ms)
  UseInterceptors(TimeoutInterceptor)
};