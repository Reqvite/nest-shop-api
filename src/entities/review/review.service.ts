import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import mongoose, {Model, ObjectId as ObjectIdType} from 'mongoose';
import {isProductExist} from '@/lib/helpers/isProductExist.helper';
import {Product} from '../product/model/product.model';
import {CreateReviewDto} from './dto/createReview.dto';
import {Review} from './model/review.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>
  ) {}

  async createReview({parentId, productId, message}: CreateReviewDto, userId: ObjectIdType): Promise<Review> {
    const product = await this.productModel.findById(productId);
    isProductExist(product);
    const session = await this.connection.startSession();
    session.startTransaction();
    let review;

    try {
      review = await this.reviewModel.create([{message, productId, userId}], {session});
      await this.productModel.findByIdAndUpdate(productId, {$push: {reviews: review[0]?._id}}, {session});

      if (parentId) {
        await this.reviewModel.findByIdAndUpdate(parentId, {$push: {children: review[0]?._id}}, {session});
      }

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

    return review[0];
  }
}
