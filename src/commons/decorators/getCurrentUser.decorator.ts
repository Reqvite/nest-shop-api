import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {JwtPayloadWithRefreshI} from '@/types/jwt.interface';

export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRefreshI | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  }
);
