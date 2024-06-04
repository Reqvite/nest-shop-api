import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Product, ProductSchema} from '../product/model/product.model';
import {Review, ReviewSchema} from './model/review.model';
import {ReviewController} from './review.controller';
import {ReviewService} from './review.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Review.name, schema: ReviewSchema},
      {name: Product.name, schema: ProductSchema}
    ])
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
