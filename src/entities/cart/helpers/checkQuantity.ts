import {ErrorMessages} from '@/const/errors.const';
import {Product} from '@/entities/product/model/product.model';
import {CustomErrors} from '@/services/customErrors.service';
import {CartItem} from '@/types/user.interface';

export const checkProductsQuantity = (products: CartItem[], foundedProducts: Product[]): void => {
  for (const foundedProduct of foundedProducts) {
    const orderedProduct = products.find(({_id}) => String(_id) === String(foundedProduct._id));
    if (foundedProduct.quantity < orderedProduct.quantity) {
      throw CustomErrors.BadRequestError(ErrorMessages.INSUFFICIENT_QUANTITY);
    }
  }
};

export const checkProductQuantity = (product: Product, foundedProduct: CartItem): void => {
  if (product.quantity < foundedProduct.quantity) {
    throw CustomErrors.BadRequestError(ErrorMessages.INSUFFICIENT_QUANTITY);
  }
};
