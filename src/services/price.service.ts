import {defaultTax} from '@/const/defaultValues';
import {PriceI} from '@/types/price';
import {ProductWithOrderedQuantity} from '@/types/product.interface';

class PriceService {
  getFixedPrice(price: number): number {
    return parseFloat(price.toFixed(2));
  }

  getDiscountPrice({discount, price}: PriceI): number {
    const discountedPrice = this.getFixedPrice(price - (price * discount) / 100);
    return discountedPrice;
  }

  getTax({price, tax = defaultTax}: {price: number; tax?: number}): number {
    return (price / 100) * tax;
  }

  getPriceWithTax(product: ProductWithOrderedQuantity): number {
    const discountedPrice = this.getDiscountPrice({
      discount: product.discount,
      price: product.price
    });
    const tax = this.getTax({price: discountedPrice});
    const priceWithTax = discountedPrice + tax;
    return this.getFixedPrice(priceWithTax * 100);
  }
}

export const priceService = new PriceService();
