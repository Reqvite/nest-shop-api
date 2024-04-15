import {NestFactory} from '@nestjs/core';
import {SwaggerModule} from '@nestjs/swagger';
import {swaggerConfig} from '@/configuration/swagger.config';
import {AppModule} from '@/entities/app/app.module';
import {HttpExceptionFilter} from '@/filters/http-exception.filter';
import {ResponseInterceptor} from '@/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  const document = SwaggerModule.createDocument(app, swaggerConfig(process.env.API_URL));
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
