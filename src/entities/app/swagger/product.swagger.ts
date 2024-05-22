import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiOperation, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';

export const AppSwagger = {
  healthCheck: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS}),
      ApiOperation({summary: 'Health check'})
    )
};
