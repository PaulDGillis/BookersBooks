import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Username = createParamDecorator(
  (data: any, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.username;
  },
);
