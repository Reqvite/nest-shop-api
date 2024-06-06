import {ErrorMessages} from '@/const/errors.const';
import {Product} from '@/entities/product/model/product.model';
import {CustomErrors} from '@/services/customErrors.service';

export const isProductExist = (product: Product): void => {
  if (!product) {
    throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Product'));
  }
};
