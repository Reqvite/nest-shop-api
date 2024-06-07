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

  async updateReview({_id, message, rating}: UpdateReviewDto, userId: ObjectIdType): Promise<Review> {
    const review = await this.reviewModel.findById(_id);

    if (!review) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Review'));
    }

    if (review.userId.toString() !== userId.toString()) {
      throw CustomErrors.AuthenticationError();
    }

    review.message = message;
    review.rating = rating;
    await review.save();
    return review;
  }

  async deleteReview(reviewId: ObjectIdType, userId: ObjectIdType): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const deletedReview = await this.reviewModel.findOneAndDelete({_id: reviewId, userId: userId}, {session});

      if (!deletedReview) {
        throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Review'));
      }

      if (deletedReview.children.length !== 0) {
        await this.reviewModel.deleteMany({_id: {$in: deletedReview.children}}, {session});
      }

      const reviewsToRemove = [reviewId, ...deletedReview.children];
      await this.productModel.findOneAndUpdate(
        {_id: deletedReview.productId},
        {$pull: {reviews: {$in: reviewsToRemove}}},
        {session}
      );

      await this.reviewModel.updateOne({children: reviewId}, {$pull: {children: reviewId}}, {session});

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
