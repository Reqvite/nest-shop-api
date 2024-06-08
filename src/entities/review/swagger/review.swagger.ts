import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {CreateReviewDto} from '../dto/createReview.dto';
import {UpdateReviewDto} from '../dto/updateReview.dto';

export const ReviewSwagger = {
  createReview: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS, type: CreateReviewDto}),
      ApiBearerAuth(),
      ApiOperation({summary: 'Review create'}),
      ApiBody({type: CreateReviewDto})
    ),
  updateReview: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: UpdateReviewDto}),
      ApiBearerAuth(),
      ApiOperation({summary: 'Update review'}),
      ApiBody({type: UpdateReviewDto})
    ),
  deleteReview: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS}),
      ApiOperation({summary: 'Delete product review'})
    )
};
