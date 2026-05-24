import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { TokenUser } from '../types/token-user.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokenUser => {
    return ctx.switchToHttp().getRequest().user;
  },
);
