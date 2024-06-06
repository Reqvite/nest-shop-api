import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
import {JwtPayloadI} from '@/types/jwt.interface';
import {CreateReviewDto} from './dto/createReview.dto';
import {Review} from './model/review.model';
import {ReviewService} from './review.service';
import {ReviewSwagger} from './swagger/review.swagger';
import {createReviewSchema} from './validation/createReview.schema';

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
}
