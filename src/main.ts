import {NestFactory} from '@nestjs/core';
import {HttpExceptionFilter} from '@/filters/http-exception.filter';
import {ResponseInterceptor} from '@/interceptors/response.interceptor';
import {AppModule} from './entities/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
