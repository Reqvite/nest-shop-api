import {Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Request} from 'express';
import {YupValidationPipe} from '@/pipes/yupValidation.pipe';
import {JwtI, JwtPayloadI} from '@/types/jwt.interface';
import {AuthService} from './auth.service';
import {createUserDto} from './dto/createUser.dto';
import {loginUserDto} from './dto/loginUser.dto';
import {JwtAuthGuard} from './guards/jwt.guard';
import {User} from './model/user.model';
import {AuthSwagger} from './swagger/auth.swagger';
import {createUserSchema} from './validation/createUser.schema';
import {loginUserSchema} from './validation/loginUser.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new YupValidationPipe(createUserSchema))
  @Post('register')
  @AuthSwagger.register()
  async register(@Body() dto: createUserDto): Promise<User> {
    return this.authService.register(dto);
  }

  @UsePipes(new YupValidationPipe(loginUserSchema))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @AuthSwagger.login()
  async login(@Body() dto: loginUserDto): Promise<JwtI> {
    const user = await this.authService.validateUser(dto);

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  @AuthSwagger.current()
  async currentUser(@Req() req: Request): Promise<JwtPayloadI> {
    return req.user as JwtPayloadI;
  }
}
