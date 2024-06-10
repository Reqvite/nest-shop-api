import {Inject, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import Stripe from 'stripe';
import {priceService} from '@/services/price.service';
import {CartService} from '../cart/cart.service';
import {CreateCheckoutSessionDto} from './dto/createCheckoutSession.dto';
import {StripeSessionI} from './types/types';

const defaultTax = 1.15;

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

  async createCheckoutSession({userId, orderInformation}: CreateCheckoutSessionDto): Promise<StripeSessionI> {
    const products = await this.cartService.getCart(userId);

    const line_items = products.map((product) => {
      const discountedPrice = priceService.getDiscountPrice({discount: product.discount, price: product.price});
      const priceWithTax = discountedPrice * defaultTax;
      const unit_amount = Math.round(priceWithTax * 100);

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            images: [product.images[0].src]
          },
          unit_amount
        },
        quantity: product.orderedQuantity
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email: orderInformation.email,
      success_url: `${this.configService.get('CLIENT_URL')}/success`,
      cancel_url: `${this.configService.get('CLIENT_URL')}/shopping-cart`
    });

    return session;
  }
}
