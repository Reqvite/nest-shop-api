import {Body, Controller, Headers, Post, Req, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import Stripe from 'stripe';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/services/customErrors.service';
import {JwtPayloadI} from '@/types/jwt.interface';
import {RequestWithRawBody} from '@/types/stripe.interface';
import {CreateCheckoutSessionDto} from './dto/createCheckoutSession.dto';
import {StripeService} from './stripe.service';
import {StripeSwagger} from './swagger/stripe.swagger';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('create-checkout-session')
  @UseGuards(AccessAuthGuard)
  @StripeSwagger.createCheckoutSession()
  async createCheckoutSession(
    @Body() dto: CreateCheckoutSessionDto,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<Stripe.Checkout.Session> {
    return this.stripeService.createCheckoutSession(dto, String(userId));
  }

  @Post('webhook')
  @StripeSwagger.webhook()
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody
  ): Promise<void> {
    if (!signature) {
      throw CustomErrors.BadRequestError(ErrorMessages.MISSING_HEADER('stripe-signature'));
    }
    const event = await this.stripeService.constructEventFromPayload(signature, request.rawBody);
    this.stripeService.handleWebhookEvent(event);
  }
}
