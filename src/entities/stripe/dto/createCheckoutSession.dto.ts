import {BillingInfo} from '@/types/cart.interface';

export class CreateCheckoutSessionDto {
  userId: string;
  orderInformation: BillingInfo;
}
