import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {PassportModule} from '@nestjs/passport';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {User, UserSchema} from './model/user.model';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), PassportModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
