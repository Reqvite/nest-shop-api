import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {ObjectIdValidationPipe} from '@/commons/pipes/objectIdValidation.pipe';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
import {JwtPayloadI} from '@/types/jwt.interface';
import {ProductWithOrderedQuantity} from '@/types/product.interface';
import {CartItem} from '@/types/user.interface';
import {CartService} from './cart.service';
import {AddToCartDto} from './dto/addToCart.dto';
import {CartSwagger} from './swagger/cart.swagger';
import {addToCartSchema} from './validation/addToCart.schema';
import {completeOrderSchema} from './validation/completeOrder.schema';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AccessAuthGuard)
  @CartSwagger.getCart()
  async getCart(@GetCurrentUser() {_id}: {_id: string}): Promise<ProductWithOrderedQuantity[]> {
    return this.cartService.getCart(_id);
  }

  @Post()
  @UseGuards(AccessAuthGuard)
  @CartSwagger.addToCart()
  async addToCart(
    @Body(new YupValidationPipe(addToCartSchema)) dto: AddToCartDto,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<CartItem[]> {
    return this.cartService.addToCart(dto, userId);
  }

  @Post('/complete')
  @UseGuards(AccessAuthGuard)
  @CartSwagger.completeOrder()
  async completeOrder(
    @Body(new YupValidationPipe(completeOrderSchema)) dto: {products: CartItem[]},
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<void> {
    return this.cartService.completeOrder(dto.products, userId);
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
