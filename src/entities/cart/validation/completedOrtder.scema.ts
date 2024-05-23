import * as yup from 'yup';
import {addToCartSchema} from './addToCart.schema';

export const completedOrderSchema = yup.object().shape({
  products: yup.array().of(addToCartSchema).min(1).required()
});
