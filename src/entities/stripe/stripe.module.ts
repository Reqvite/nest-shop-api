import {DynamicModule, Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from '../auth/model/user.model';
import {CartService} from '../cart/cart.service';
import {Order, OrderSchema} from '../cart/model/order.model';
import {Product, ProductSchema} from '../product/model/product.model';
import {StripeController} from './stripe.controller';
import {StripeService} from './stripe.service';

@Module({})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      controllers: [StripeController],
      imports: [
        ConfigModule,
        MongooseModule.forFeature([
          {name: Product.name, schema: ProductSchema},
          {name: User.name, schema: UserSchema},
          {name: Order.name, schema: OrderSchema}
        ])
      ],
      providers: [
        CartService,
        StripeService,
        {
          provide: 'STRIPE_API_KEY',
          useFactory: async (configService: ConfigService) => configService.get('STRIPE_API_KEY'),
          inject: [ConfigService]
        }
      ]
    };
  }
}
