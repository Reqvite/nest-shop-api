import {DocumentBuilder, OpenAPIObject} from '@nestjs/swagger';

export const swaggerConfig = (url: string): Omit<OpenAPIObject, 'paths'> =>
  new DocumentBuilder()
    .setTitle('Shop-api')
    .setDescription('Shop api')
    .setVersion('0.1')
    .addServer(url)
    .addTag('Your API Tag')
    .build();
