import {Inject, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Stripe from 'stripe';
import {CartService} from '../cart/cart.service';
import {CreateCheckoutSessionDto} from './dto/createCheckoutSession.dto';
import {getLineItems} from './helpers/getLineItems';
import {StripeSessionI} from './types/types';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  constructor(
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
    private readonly configService: ConfigService,
    private readonly cartService: CartService
  ) {
    this.stripe = new Stripe(this.apiKey);
  }

  async createCheckoutSession(
    {products, orderInformation, totalPrice}: CreateCheckoutSessionDto,
    userId: string
  ): Promise<StripeSessionI> {
    const productsDetails = await this.cartService.getCart(userId);
    const line_items = getLineItems(productsDetails);

    const customer = await this.stripe.customers.create({
      name: `${orderInformation.firstName} ${orderInformation.lastName}`,
      email: orderInformation.email,
      metadata: {
        userId,
        products: JSON.stringify(products),
        orderInformation: JSON.stringify(orderInformation),
        totalPrice
      }
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer: customer.id,
      success_url: `${this.configService.get('CLIENT_URL')}/success`,
      cancel_url: `${this.configService.get('CLIENT_URL')}/shopping-cart`
    });

    return session;
  }
}
