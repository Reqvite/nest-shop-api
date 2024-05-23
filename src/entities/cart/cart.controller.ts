import {Body, Controller, Delete, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {ObjectIdValidationPipe} from '@/commons/pipes/objectIdValidation.pipe';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
import {JwtPayloadI} from '@/types/jwt.interface';
import {CartItem} from '@/types/user.interface';
import {CartService} from './cart.service';
import {AddToCartDto} from './dto/addToCart.dto';
import {CartSwagger} from './swagger/cart.swagger';
import {addToCartSchema} from './validation/addToCart.schema';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @UseGuards(AccessAuthGuard)
  @CartSwagger.addToCart()
  async addToCart(
    @Body(new YupValidationPipe(addToCartSchema)) dto: AddToCartDto,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<CartItem[]> {
    return this.cartService.addToCart(dto, userId);
  }

  @Put()
  @UseGuards(AccessAuthGuard)
  @CartSwagger.addToCart()
  async updateCart(
    @Body(new YupValidationPipe(addToCartSchema)) dto: AddToCartDto,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<CartItem[]> {
    return this.cartService.updateCart(dto, userId);
  }

  @Delete(':id')
  @UseGuards(AccessAuthGuard)
  @CartSwagger.deleteItemFromCart()
  async deleteItemFromCart(
    @Param('id', new ObjectIdValidationPipe()) id: ObjectId,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<CartItem[]> {
    return this.cartService.deleteItemFromCart(id, userId);
  }
}
