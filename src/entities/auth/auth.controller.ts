import {Body, Controller, Post, UsePipes} from '@nestjs/common';
import {YupValidationPipe} from '@/pipes/yupValidation.pipe';
import {AuthService} from './auth.service';
import {createUserDto} from './dto/createUser.dto';
import {createUserSchema} from './validation/createUser.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new YupValidationPipe(createUserSchema))
  @Post('register')
  async register(@Body() dto: createUserDto) {
    return this.authService.register(dto);
  }
}
