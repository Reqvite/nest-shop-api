import {BillingInfo} from '@/types/cart.interface';
import {CartItem} from '@/types/user.interface';

export class CreateCheckoutSessionDto {
  products: CartItem[];
  orderInformation: BillingInfo;
  totalPrice: number;
}
