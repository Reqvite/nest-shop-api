import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
import {JwtPayloadI} from '@/types/jwt.interface';
import {CartService} from './cart.service';
import {AddToCartDto, AddToCartResponseDto} from './dto/addToCart.dto';
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
  ): Promise<AddToCartResponseDto> {
    return this.cartService.addToCart(dto, userId);
  }
}
