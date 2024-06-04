import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, ObjectId as ObjectIdType} from 'mongoose';
import {CreateReviewDto} from './dto/createReview.dto';
import {Review} from './model/review.model';

@Injectable()
export class ReviewService {
  constructor(@InjectModel(Review.name) private readonly reviewModel: Model<Review>) {}

  async createReview(dto: CreateReviewDto, userId: ObjectIdType): Promise<Review> {
    const review = await this.reviewModel.create({message: dto.message, userId});

    if (dto.parentId) {
      await this.reviewModel.findByIdAndUpdate(dto.parentId, {$push: {children: review._id}});
    }

    return review;
  }
}
