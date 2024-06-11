import {priceService} from '@/services/price.service';
import {ProductWithOrderedQuantity} from '@/types/product.interface';

interface LineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      images: string[];
    };
    unit_amount: number;
  };
  quantity: number;
}

export const getLineItems = (products: ProductWithOrderedQuantity[]): LineItem[] =>
  products.map((product) => {
    const discountedPrice = priceService.getDiscountPrice({discount: product.discount, price: product.price});
    const priceWithTax = priceService.getTax({price: discountedPrice});
    const unit_amount = priceService.getFixedPrice(priceWithTax * 100);

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
