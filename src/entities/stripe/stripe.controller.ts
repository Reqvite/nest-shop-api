import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {CreateCheckoutSessionDto} from './dto/createCheckoutSession.dto';
import {StripeService} from './stripe.service';
import {StripeSessionI} from './types/types';

@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(AccessAuthGuard)
  async createCheckoutSession(@Body() dto: CreateCheckoutSessionDto): Promise<StripeSessionI> {
    return this.stripeService.createCheckoutSession(dto);
  }
}
