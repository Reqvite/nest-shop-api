import {Body, Controller, Headers, Post, Req, UseGuards} from '@nestjs/common';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/services/customErrors.service';
import {JwtPayloadI} from '@/types/jwt.interface';
import {RequestWithRawBody} from '@/types/stripe.interface';
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

  @Post('webhook')
  async handleIncomingEvents(@Headers('stripe-signature') signature: string, @Req() request: RequestWithRawBody) {
    if (!signature) {
      throw CustomErrors.BadRequestError(ErrorMessages.MISSING_HEADER('stripe-signature'));
    }
    const event = await this.stripeService.constructEventFromPayload(signature, request.rawBody);
    this.stripeService.handleWebhookEvent(event);
  }
}
