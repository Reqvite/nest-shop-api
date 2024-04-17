import {Body, Controller, HttpCode, HttpStatus, Post, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {YupValidationPipe} from '@/pipes/yupValidation.pipe';
import {JwtI} from '@/types/jwt.interface';
import {AuthService} from './auth.service';
import {createUserDto} from './dto/createUser.dto';
import {loginUserDto} from './dto/loginUser.dto';
import {User} from './model/user.model';
import {AuthSwagger} from './swagger/auth.swagger';
import {createUserSchema} from './validation/createUser.schema';
import {loginUserSchema} from './validation/loginUser.schema';

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

  @Post('login')
  @UsePipes(new YupValidationPipe(loginUserSchema))
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.login()
  async login(@Body() dto: loginUserDto): Promise<JwtI> {
    const user = await this.authService.validateUser(dto);

    return this.authService.login(user);
  }
}
