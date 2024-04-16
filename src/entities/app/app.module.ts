import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {LoggerModule} from 'nestjs-pino';
import {envConfiguration} from '@/configuration/env.config';
import {loggerConfiguration} from '@/configuration/logger.config';
import {mongoConfig} from '@/configuration/mongo.config';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [
    MongooseModule.forRootAsync(mongoConfig),
    LoggerModule.forRoot(loggerConfiguration),
    ConfigModule.forRoot(envConfiguration)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
