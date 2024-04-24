import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
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
      ApiQuery({name: 'page', type: 'number', required: false}),
      ApiQuery({name: 'limit', type: 'number', required: false}),
      ApiQuery({name: 'category', type: 'string', required: false}),
      ApiQuery({name: 'subCategory', type: 'string', required: false}),
      ApiQuery({name: 'rating', type: 'number', required: false}),
      ApiQuery({name: 'tags', type: 'string', isArray: true, required: false}),
      ApiQuery({name: 'sortBy', type: 'string', required: false}),
      ApiQuery({name: 'search', type: 'string', required: false}),
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
