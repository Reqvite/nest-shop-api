import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {UserWishlistResponseDto} from '@/entities/auth/dto/userResponse.dto';
import {GetProductsQuantityByCategoryResponseI} from '@/types/product.interface';
import {CreateProductDto} from '../dto/createProduct.dto';

const queryParams = (): (typeof ApiQuery)[] => [
  ApiQuery({name: 'page', type: 'string', required: false}),
  ApiQuery({name: 'limit', type: 'string', required: false}),
  ApiQuery({name: 'categories', type: 'string', required: false}),
  ApiQuery({name: 'brands', type: 'string', required: false}),
  ApiQuery({name: 'prices', type: 'string', required: false}),
  ApiQuery({name: 'subCategory', type: 'string', required: false}),
  ApiQuery({name: 'rating', type: 'string', required: false}),
  ApiQuery({name: 'tags', type: 'string', isArray: true, required: false}),
  ApiQuery({name: 'sortBy', type: 'string', required: false}),
  ApiQuery({name: 'search', type: 'string', required: false})
];

export const ProductSwagger = {
  getProductById: () =>
    applyDecorators(
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: CreateProductDto}),
      ApiOperation({summary: 'Get product by id'})
    ),
  getUserWishlist: () =>
    applyDecorators(ApiBearerAuth(), ...queryParams(), ApiOperation({summary: 'Get user wishlist'})),
  getProducts: () => applyDecorators(...queryParams(), ApiOperation({summary: 'Get products'})),
  getProductsQuantityByCategories: () =>
    applyDecorators(
      ApiResponse({
        status: HttpStatus.OK,
        description: SuccessMessages.SUCCESS,
        type: GetProductsQuantityByCategoryResponseI
      }),
      ApiQuery({name: 'category', type: 'number', required: false}),
      ApiOperation({summary: 'Get products quantity by category'})
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
    ),
  updateWishlist: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: UserWishlistResponseDto}),
      ApiOperation({summary: 'Wishlist update'})
    )
};
