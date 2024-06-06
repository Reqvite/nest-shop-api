import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import mongoose, {Model, ObjectId as ObjectIdType} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {isProductExist} from '@/lib/helpers/isProductExist.helper';
import {CustomErrors} from '@/services/customErrors.service';
import {Product} from '../product/model/product.model';
import {CreateReviewDto} from './dto/createReview.dto';
import {UpdateReviewDto} from './dto/updateReview.dto';
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

    try {
      const review = await this.reviewModel.create([{message, productId, userId}], {session});
      await this.productModel.findByIdAndUpdate(productId, {$push: {reviews: review[0]?._id}}, {session});

      if (parentId) {
        await this.reviewModel.findByIdAndUpdate(parentId, {$push: {children: review[0]?._id}}, {session});
      }

      await session.commitTransaction();
      session.endSession();
      return review[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async updateReview({_id, message}: UpdateReviewDto, userId: ObjectIdType): Promise<Review> {
    const review = await this.reviewModel.findById(_id);

    if (!review) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Review'));
    }

    if (review.userId.toString() !== userId.toString()) {
      throw CustomErrors.AuthorizationError();
    }

    review.message = message;
    await review.save();
    return review;
  }
}
