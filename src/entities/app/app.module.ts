import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {LoggerModule} from 'nestjs-pino';
import {envConfiguration} from '@/configuration/env.config';
import {loggerConfiguration} from '@/configuration/logger.config';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [LoggerModule.forRoot(loggerConfiguration), ConfigModule.forRoot(envConfiguration)],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
