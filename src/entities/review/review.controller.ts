import {Body, Controller, Delete, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {ObjectIdValidationPipe} from '@/commons/pipes/objectIdValidation.pipe';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
import {JwtPayloadI} from '@/types/jwt.interface';
import {CreateReviewDto} from './dto/createReview.dto';
import {UpdateReviewDto} from './dto/updateReview.dto';
import {Review} from './model/review.model';
import {ReviewService} from './review.service';
import {ReviewSwagger} from './swagger/review.swagger';
import {createReviewSchema} from './validation/createReview.schema';
import {updateReviewSchema} from './validation/updateReview.schema';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AccessAuthGuard)
  @ReviewSwagger.createReview()
  async createReview(
    @Body(new YupValidationPipe(createReviewSchema)) dto: CreateReviewDto,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<Review> {
    return this.reviewService.createReview(dto, userId);
  }

  @Put()
  @UseGuards(AccessAuthGuard)
  @ReviewSwagger.updateReview()
  async updateReview(
    @Body(new YupValidationPipe(updateReviewSchema)) dto: UpdateReviewDto,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<Review> {
    return this.reviewService.updateReview(dto, userId);
  }

  @Delete(':id')
  @UseGuards(AccessAuthGuard)
  @ReviewSwagger.deleteReview()
  async deleteReview(
    @Param('id', new ObjectIdValidationPipe()) id: ObjectId,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<void> {
    return this.reviewService.deleteReview(id, userId);
  }
}
