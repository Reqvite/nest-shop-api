import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {CreateProductDto} from '../dto/createProduct.dto';

export const ProductSwagger = {
  create: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS, type: CreateProductDto}),
      ApiBearerAuth(),
      ApiOperation({summary: 'Product create'}),
      ApiBody({type: CreateProductDto})
    )
};
