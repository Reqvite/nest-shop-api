import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {YupValidationPipe} from '@/pipes/yupValidation.pipe';
import {JwtPayloadI, JwtPayloadWithRefreshI, TokensI} from '@/types/jwt.interface';
import {AccessAuthGuard, RefreshAuthGuard} from '../../commons/guards/jwt.guard';
import {AuthService} from './auth.service';
import {createUserDto} from './dto/createUser.dto';
import {loginUserDto} from './dto/loginUser.dto';
import {UserResponseDto} from './dto/userResponse.dto';
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
  async register(@Body() dto: createUserDto): Promise<TokensI> {
    return await this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new YupValidationPipe(loginUserSchema))
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.login()
  async login(@Body() dto: loginUserDto) {
    const user = await this.authService.validateUser(dto);

    return this.authService.login(user);
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.refresh()
  async refreshTokens(@GetCurrentUser() user: JwtPayloadWithRefreshI) {
    return this.authService.refreshTokens(user._id, user.refreshToken);
  }

  @Get('current')
  @UseGuards(AccessAuthGuard)
  @AuthSwagger.current()
  async currentUser(@GetCurrentUser() user: JwtPayloadI): Promise<UserResponseDto> {
    return this.authService.currentUser(user._id);
  }

  @Post('logout')
  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.OK)
  @AuthSwagger.logout()
  async logout(@GetCurrentUser() user: JwtPayloadI): Promise<void> {
    return await this.authService.logout(user._id);
  }
}
