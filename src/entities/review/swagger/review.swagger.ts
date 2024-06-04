import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {CreateReviewDto} from '../dto/createReview.dto';

export const ReviewSwagger = {
  createReview: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS, type: CreateReviewDto}),
      ApiBearerAuth(),
      ApiOperation({summary: 'Review create'}),
      ApiBody({type: CreateReviewDto})
    )
};
