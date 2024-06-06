import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import {ObjectId} from 'mongodb';
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

  async getProductReviews(productId: string): Promise<Review[]> {
    const reviews = await this.reviewModel.aggregate([
      {$match: {productId: new ObjectId(productId)}},
      {
        $graphLookup: {
          from: 'reviews',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'parentId',
          as: 'children',
          maxDepth: 1
        }
      },
      {$match: {parentId: null}},
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $addFields: {
          username: {$concat: ['$user.firstName', ' ', '$user.lastName']}
        }
      },
      {
        $project: {
          user: 0
        }
      }
    ]);

    return reviews;
  }

  async createReview({parentId, productId, rating, message}: CreateReviewDto, userId: ObjectIdType): Promise<Review> {
    const product = await this.productModel.findById(productId);
    isProductExist(product);
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const review = await this.reviewModel.create([{message, productId, rating, userId, parentId}], {session});
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
      throw CustomErrors.AuthorizationError();
    }

    review.message = message;
    review.rating = rating;
    await review.save();
    return review;
  }

  async deleteReview(reviewId: ObjectIdType, userId: ObjectIdType): Promise<void> {
    const deletedReview = await this.reviewModel.findOneAndDelete({_id: reviewId, userId: userId});

    if (!deletedReview) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Review'));
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
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
