import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from '../auth/model/user.model';
import {Product, ProductSchema} from './model/product.model';
import {ProductController} from './product.controller';
import {ProductService} from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Product.name, schema: ProductSchema},
      {name: User.name, schema: UserSchema}
    ])
  ],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}
