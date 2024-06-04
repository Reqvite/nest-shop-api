import {Body, Controller, Post, Put, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
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
}
