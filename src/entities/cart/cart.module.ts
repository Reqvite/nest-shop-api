import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from '../auth/model/user.model';
import {Product, ProductSchema} from '../product/model/product.model';
import {CartController} from './cart.controller';
import {CartService} from './cart.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Product.name, schema: ProductSchema},
      {name: User.name, schema: UserSchema}
    ])
  ],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
