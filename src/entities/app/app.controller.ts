import {Controller, Get} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {AppService} from './app.service';
import {AppSwagger} from './swagger/product.swagger';

@ApiTags('Application')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @AppSwagger.healthCheck()
  getHello(): string {
    return this.appService.getHello();
  }
}
