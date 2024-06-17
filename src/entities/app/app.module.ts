import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {LoggerModule} from 'nestjs-pino';
import {envConfiguration} from '@/configuration/env.config';
import {loggerConfiguration} from '@/configuration/logger.config';
import {mongoConfig} from '@/configuration/mongo.config';
import {AuthModule} from '../auth/auth.module';
import {CartModule} from '../cart/cart.module';
import {DashboardModule} from '../dashboard/dashboard.module';
import {ProductModule} from '../product/product.module';
import {ReviewModule} from '../review/review.module';
import {StripeModule} from '../stripe/stripe.module';
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
  imports: [
    DashboardModule,
    AuthModule,
    ProductModule,
    CartModule,
    ReviewModule,
    StripeModule.forRootAsync(),
    MongooseModule.forRootAsync(mongoConfig),
    LoggerModule.forRoot(loggerConfiguration),
    ConfigModule.forRoot(envConfiguration)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
