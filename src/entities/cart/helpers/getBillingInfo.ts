import {Option} from '@/entities/product/model/product.model';
import {BillingInfo} from '@/types/cart.interface';
import {labels} from '../const/validation.const';

export const getBillingInfo = (orderInformation: BillingInfo): Option[] => [
  {label: labels.firstName, value: orderInformation.firstName},
  {label: labels.lastName, value: orderInformation.lastName},
  {label: labels.email, value: orderInformation.email},
  {label: labels.address, value: orderInformation.address},
  {label: labels.phoneNumber, value: orderInformation.phoneNumber},
  {label: labels.country, value: orderInformation.country},
  {label: labels.city, value: orderInformation.city},
  {label: labels.zip, value: orderInformation.zip},
  {label: labels.notes, value: orderInformation.notes}
];
