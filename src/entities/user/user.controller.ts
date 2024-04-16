import {Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {YupValidationPipe} from '@/pipes/yupValidation.pipe';
import {JwtPayloadI, JwtPayloadWithRefreshI, TokensI} from '@/types/jwt.interface';
import {AccessAuthGuard, RefreshAuthGuard} from '../../commons/guards/jwt.guard';
import {createUserDto} from './dto/createUser.dto';
import {loginUserDto} from './dto/loginUser.dto';
import {UserSwagger} from './swagger/user.swagger';
import {UserService} from './user.service';
import {createUserSchema} from './validation/createUser.schema';
import {loginUserSchema} from './validation/loginUser.schema';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly authService: UserService) {}

  @UsePipes(new YupValidationPipe(createUserSchema))
  @Post('register')
  @UserSwagger.register()
  async register(@Body() dto: createUserDto): Promise<TokensI> {
    return this.authService.register(dto);
  }

  @UsePipes(new YupValidationPipe(loginUserSchema))
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UserSwagger.login()
  async login(@Body() dto: loginUserDto): Promise<TokensI> {
    const user = await this.authService.validateUser(dto);

    return this.authService.login(user);
  }

  @UseGuards(AccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @UserSwagger.logout()
  async logout(@GetCurrentUser() user: JwtPayloadI): Promise<void> {
    return await this.authService.logout(user._id);
  }

  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UserSwagger.refresh()
  async refreshTokens(@GetCurrentUser() user: JwtPayloadWithRefreshI) {
    return this.authService.refreshTokens(user._id, user.refreshToken);
  }

  @UseGuards(AccessAuthGuard)
  @Get('current')
  @UserSwagger.current()
  async currentUser(@GetCurrentUser() user: JwtPayloadI): Promise<JwtPayloadI> {
    return user;
  }
}
