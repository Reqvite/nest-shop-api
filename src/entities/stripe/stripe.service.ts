import {Inject, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Stripe from 'stripe';
import {BillingInfo} from '@/types/cart.interface';
import {CartService} from '../cart/cart.service';
import {CreateCheckoutSessionDto} from './dto/createCheckoutSession.dto';
import {StripeWebhookEvents} from './enums/webhookEvents.enum';
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

  async findOrCreateCustomer(orderInformation: BillingInfo, userId: string): Promise<Stripe.Customer> {
    const existingCustomers = await this.stripe.customers.list({
      email: orderInformation.email,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0];
    }

    return await this.stripe.customers.create({
      name: `${orderInformation.firstName} ${orderInformation.lastName}`,
      email: orderInformation.email,
      metadata: {
        userId
      }
    });
  }

  async createCheckoutSession(
    {products, orderInformation}: CreateCheckoutSessionDto,
    userId: string
  ): Promise<StripeSessionI> {
    const productsDetails = await this.cartService.getCart(userId);
    const line_items = getLineItems(productsDetails);

    const customer = await this.findOrCreateCustomer(orderInformation, userId);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer: customer.id,
      metadata: {
        products: JSON.stringify(products),
        orderInformation: JSON.stringify(orderInformation),
        userId
      },
      success_url: `${this.configService.get('CLIENT_URL')}/success`,
      cancel_url: `${this.configService.get('CLIENT_URL')}/shopping-cart`
    });

    return session;
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case StripeWebhookEvents.CheckoutSessionCompleted:
        const {metadata, amount_total} = event.data.object;
        const {products, orderInformation, userId} = metadata;
        this.cartService.completeOrder(
          {
            orderInformation: JSON.parse(orderInformation),
            products: JSON.parse(products),
            totalPrice: amount_total / 100
          },
          userId
        );
        break;
    }
  }
}
