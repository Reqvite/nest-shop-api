import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';

export const StripeSwagger = {
  createCheckoutSession: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS}),
      ApiOperation({summary: 'Create checkout session'})
    ),
  webhook: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS}),
      ApiOperation({summary: 'Handle stripe events'})
    )
};
