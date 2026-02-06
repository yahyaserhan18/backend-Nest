import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../auth.types';

export const CurrentUser = createParamDecorator((data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | unknown => {
  const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
  const user = request.user;
  if (data) return user?.[data];
  return user;
});
