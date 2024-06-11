import {NestFactory} from '@nestjs/core';
import {SwaggerModule} from '@nestjs/swagger';
import {HttpExceptionFilter} from '@/commons/filters/http-exception.filter';
import {ResponseInterceptor} from '@/commons/interceptors/response.interceptor';
import {swaggerConfig} from '@/configuration/swagger.config';
import {AppModule} from '@/entities/app/app.module';
import rawBodyMiddleware from './commons/middlewares/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(rawBodyMiddleware());
  const document = SwaggerModule.createDocument(app, swaggerConfig(process.env.API_URL));
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(process.env.PORT || 3000, process.env.HOST);
}
bootstrap();
