import {defaultTax} from '@/const/defaultValues';
import {PriceI} from '@/types/price';
import {ProductWithOrderedQuantity} from '@/types/product.interface';

class PriceService {
  getFixedPrice(price: number): number {
    return parseFloat(price.toFixed(2));
  }

  getDiscountPrice({discount, price}: PriceI): number {
    return this.getFixedPrice(price - (price * discount) / 100);
  }

  getSubtotal(items: ProductWithOrderedQuantity[]): number {
    return this.getFixedPrice(
      items?.reduce((acc, {price, discount, orderedQuantity}) => {
        const finalDiscount = discount ?? 0;
        const finalPrice = finalDiscount ? this.getDiscountPrice({discount: finalDiscount, price}) : price;
        return acc + finalPrice * orderedQuantity;
      }, 0)
    );
  }

  getTax({price, tax = defaultTax}: {price: number; tax?: number}): number {
    return this.getFixedPrice(price * tax);
  }
}

export const priceService = new PriceService();
