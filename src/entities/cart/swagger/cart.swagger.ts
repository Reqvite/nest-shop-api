import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {GetCartResponseI, GetOrdersResponseI} from '@/types/cart.interface';
import {AddToCartDto} from '../dto/addToCart.dto';

export const CartSwagger = {
  getOrders: () =>
    applyDecorators(
      ApiOperation({summary: 'Get orders statistics'}),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: GetOrdersResponseI}),
      ApiQuery({name: 'page', type: 'string', required: false})
    ),
  getCart: () =>
    applyDecorators(
      ApiOperation({summary: 'Get cart'}),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: GetCartResponseI}),
      ApiBody({type: GetCartResponseI})
    ),
  addToCart: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS, type: AddToCartDto}),
      ApiBody({type: AddToCartDto}),
      ApiOperation({summary: 'Add product to cart'})
    ),
  completeOrder: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.CREATED, description: SuccessMessages.SUCCESS}),
      ApiOperation({summary: 'Complete order'})
    ),
  updateCart: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS, type: AddToCartDto}),
      ApiBody({type: AddToCartDto}),
      ApiOperation({summary: 'Update product in cart'})
    ),
  deleteItemFromCart: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiResponse({status: HttpStatus.OK, description: SuccessMessages.SUCCESS}),
      ApiOperation({summary: 'Delete product from cart'})
    )
};
