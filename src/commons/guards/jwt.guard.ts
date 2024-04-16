import {AuthGuard} from '@nestjs/passport';

export class AccessAuthGuard extends AuthGuard('jwt') {}
export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {}
