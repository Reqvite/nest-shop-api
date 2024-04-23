import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {GetProductsResponseI} from '@/types/product.interface';
import {CreateProductDto} from '../dto/createProduct.dto';

export const ProductSwagger = {
  getProductById: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: CreateProductDto}),
      ApiOperation({summary: 'Get product by id'})
    ),
  getProducts: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: GetProductsResponseI}),
      ApiOperation({summary: 'Get products'})
    ),
  create: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS, type: CreateProductDto}),
      ApiBearerAuth(),
      ApiOperation({summary: 'Product create'}),
      ApiBody({type: CreateProductDto})
    ),
  updateById: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: CreateProductDto}),
      ApiOperation({summary: 'Product update'}),
      ApiBody({type: CreateProductDto})
    )
};
