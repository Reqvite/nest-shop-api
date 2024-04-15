import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt.guard';
import {AppService} from './app.service';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
