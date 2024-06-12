import {priceService} from '@/services/price.service';
import {ProductWithOrderedQuantity} from '@/types/product.interface';

export const getLineItems = (products: ProductWithOrderedQuantity[]) =>
  products.map((product) => {
    const unitAmount = priceService.getPriceWithTax(product);

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.title,
          images: [product.images[0].src]
        },
        unit_amount: unitAmount
      },
      quantity: product.orderedQuantity
    };
  });
