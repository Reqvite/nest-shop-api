import {ApiProperty} from '@nestjs/swagger';
import {BillingInfo} from '@/types/cart.interface';
import {CartItem} from '@/types/user.interface';

export class CompleteOrderDto {
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
  products: CartItem[];
  orderInformation: BillingInfo;
  totalPrice: number;
}
