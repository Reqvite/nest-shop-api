import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {HasRoles} from '@/commons/decorators/roles.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {RolesGuard} from '@/commons/guards/roles.guard';
import {ObjectIdValidationPipe} from '@/commons/pipes/objectIdValidation.pipe';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
import {GetOrdersResponseI} from '@/types/cart.interface';
import {JwtPayloadI} from '@/types/jwt.interface';
import {ProductWithOrderedQuantity} from '@/types/product.interface';
import {CartItem} from '@/types/user.interface';
import {UserRole} from '../auth/model/user.model';
import {getProductsQueryParamsSchema} from '../product/validation/getProductsQueryParams.schema';
import {CartService} from './cart.service';
import {AddToCartDto} from './dto/addToCart.dto';
import {CompleteOrderDto} from './dto/completeOrder.dto';
import {CartSwagger} from './swagger/cart.swagger';
import {addToCartSchema} from './validation/addToCart.schema';
import {completeOrderSchema} from './validation/completeOrder.schema';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/orders-statistic')
  @HasRoles([UserRole.ADMIN])
  @UseGuards(AccessAuthGuard, RolesGuard)
  @CartSwagger.getCart()
  async getOrdersStatistic(
    @Query(new YupValidationPipe(getProductsQueryParamsSchema)) {timeline}: any
  ): Promise<GetOrdersResponseI> {
    return this.cartService.getOrdersStatistic(timeline);
  }

  @Get()
  @UseGuards(AccessAuthGuard)
  @CartSwagger.getCart()
  async getCart(@GetCurrentUser() {_id}: {_id: string}): Promise<ProductWithOrderedQuantity[]> {
    return this.cartService.getCart(_id);
  }

  @Get('/orders')
  @UseGuards(AccessAuthGuard)
  @CartSwagger.getCart()
  async getOrders(
    @GetCurrentUser() {_id}: {_id: string},
    @Query(new YupValidationPipe(getProductsQueryParamsSchema)) params: {[key: string]: string}
  ): Promise<GetOrdersResponseI> {
    return this.cartService.getOrders(_id, params);
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
    @Body(new YupValidationPipe(completeOrderSchema)) dto: CompleteOrderDto,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<void> {
    return this.cartService.completeOrder(dto, String(userId));
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
