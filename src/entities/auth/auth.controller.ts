import {Body, Controller, Post, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {YupValidationPipe} from '@/pipes/yupValidation.pipe';
import {AuthService} from './auth.service';
import {createUserDto} from './dto/createUser.dto';
import {User} from './model/user.model';
import {AuthSwagger} from './swagger/auth.swagger';
import {createUserSchema} from './validation/createUser.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new YupValidationPipe(createUserSchema))
  @AuthSwagger.register()
  async register(@Body() dto: createUserDto): Promise<User> {
    return this.authService.register(dto);
  }
}
