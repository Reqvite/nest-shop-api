import {ApiProperty} from '@nestjs/swagger';

class Option {
  label: string;
  value: string;
}

export class CreateProductDto {
  @ApiProperty({
    example: ['https://example.com/product-image1.jpg', 'https://example.com/product-image2.jpg'],
    required: true
  })
  image: string[];

  @ApiProperty({
    example: 'Example Product',
    required: true
  })
  title: string;

  @ApiProperty({
    example: [
      {
        label: 'Title',
        value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed'
      }
    ],
    required: true
  })
  description: Option[];

  @ApiProperty({
    example: 0,
    required: true
  })
  rating: number;

  @ApiProperty({
    example: 100,
    required: true
  })
  price: number;

  @ApiProperty({
    example: 100,
    required: true
  })
  quantity: number;

  @ApiProperty({
    example: 'Brand',
    required: true
  })
  brand: string;

  @ApiProperty({
    example: 1,
    required: true
  })
  category: string;

  @ApiProperty({
    example: 2,
    required: true
  })
  subCategory: number;

  @ApiProperty({
    example: [1, 2, 3],
    required: true
  })
  tags: number[];

  @ApiProperty({
    example: [
      {
        label: 'Size',
        value: 'Large'
      }
    ],
    required: true
  })
  characteristics: Option[];

  @ApiProperty({
    example: 50,
    required: true
  })
  discount?: number;
}
