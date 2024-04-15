import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {MongooseModule} from '@nestjs/mongoose';
import {PassportModule} from '@nestjs/passport';
import {jwtConfig} from '@/configuration/jwt.config';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {User, UserSchema} from './model/user.model';
import {JwtStrategy} from './strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule.registerAsync(jwtConfig),
    PassportModule,
    ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
