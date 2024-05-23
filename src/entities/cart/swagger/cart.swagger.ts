import {applyDecorators, HttpStatus} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOperation, ApiResponse} from '@nestjs/swagger';
import {SuccessMessages} from '@/const/success.const';
import {GetCartResponseI} from '@/types/cart.interface';
import {AddToCartDto} from '../dto/addToCart.dto';

export const CartSwagger = {
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
