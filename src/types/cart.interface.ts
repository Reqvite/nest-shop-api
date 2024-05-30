import {ApiProperty} from '@nestjs/swagger';
import * as yup from 'yup';
import {orderInformationSchema} from '@/entities/cart/validation/completeOrder.schema';
import {ProductWithOrderedQuantity} from './product.interface';

export type BillingInfo = yup.InferType<typeof orderInformationSchema>;

export class GetCartResponseI {
  @ApiProperty({
    example: {
      image: ['https://example.com/product-image1.jpg', 'https://example.com/product-image2.jpg'],
      title: 'Example Product',
      description: [
        {
          label: 'Title',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'
        }
      ],
      rating: 0,
      price: 100,
      quantity: 100,
      orderedQuantity: 10,
      brand: 'Brand',
      category: '1',
      subCategory: 2,
      tags: [1, 2, 3],
      characteristics: [
        {
          label: 'Size',
          value: 'Large'
        }
      ],
      discount: 50
    },
    required: true
  })
  products: ProductWithOrderedQuantity[];
  orderInformation: BillingInfo;
}
