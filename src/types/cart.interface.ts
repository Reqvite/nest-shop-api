import {ApiProperty} from '@nestjs/swagger';
import * as yup from 'yup';
import {orderInformationSchema} from '@/entities/cart/validation/completeOrder.schema';
import {TimeLine} from '@/enums/timeLine.enum';
import {ProductWithOrderedQuantity} from './product.interface';

export type BillingInfo = yup.InferType<typeof orderInformationSchema>;

export class GetOrdersResponseI {
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
  results: ProductWithOrderedQuantity[];
  @ApiProperty({
    example: 200
  })
  totalResults: number;
  @ApiProperty({
    example: 1
  })
  currentPage: number;

  @ApiProperty({
    example: 10
  })
  totalPages: number;

  @ApiProperty({
    example: 2000
  })
  totalItems: number;
}

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

export class GetCartQueryParamsI {
  @ApiProperty({
    example: TimeLine.Quarter,
    description: 'Specifies the timeline for fetching cart data.'
  })
  timeline: TimeLine;
}
