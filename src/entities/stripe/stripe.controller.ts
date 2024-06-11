import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {JwtPayloadI} from '@/types/jwt.interface';
import {CreateCheckoutSessionDto} from './dto/createCheckoutSession.dto';
import {StripeService} from './stripe.service';
import {StripeSessionI} from './types/types';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(AccessAuthGuard)
  async createCheckoutSession(
    @Body() dto: CreateCheckoutSessionDto,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<StripeSessionI> {
    return this.stripeService.createCheckoutSession(dto, String(userId));
  }
}
