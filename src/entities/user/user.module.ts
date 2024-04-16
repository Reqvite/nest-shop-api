import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {MongooseModule} from '@nestjs/mongoose';
import {PassportModule} from '@nestjs/passport';
import {jwtConfig} from '@/configuration/jwt.config';
import {User, UserSchema} from './model/user.model';
import {AccessTokenStrategy} from './strategies/accessToken.strategy';
import {RefreshTokenStrategy} from './strategies/refreshToken.strategy';
import {UserController} from './user.controller';
import {UserService} from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule.registerAsync(jwtConfig),
    PassportModule,
    ConfigModule
  ],
  controllers: [UserController],
  providers: [UserService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class UserModule {}
