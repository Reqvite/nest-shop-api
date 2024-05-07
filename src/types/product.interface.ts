import {ApiProperty} from '@nestjs/swagger';
import {Product} from '@/entities/product/model/product.model';

export class GetProductsResponseI {
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
  results: Product[];

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

export class GetProductsQuantityByCategoryResponseI {
  @ApiProperty({
    example: 1
  })
  _id: number;
  @ApiProperty({
    example: 30
  })
  quantity: number;
}

interface ProductParamsI {
  brand?: {$in: number[]};
  price?: {$gte: number; $lt: number};
  category?: {$in: number[]};
  subCategory?: {$in: number[]};
  rating?: {$gte: number; $lt: number};
  tags?: {$in: number[]};
  $or?: {
    [key: string]: {$regex: string; $options: string};
  }[];
}

interface ProductParamsI {
  brand?: {$in: number[]};
  price?: {$gte: number; $lt: number};
  category?: {$in: number[]};
  subCategory?: {$in: number[]};
  rating?: {$gte: number; $lt: number};
  tags?: {$in: number[]};
  $or?: {
    [key: string]: {$regex: string; $options: string};
  }[];
}

type ProductFilterKeys = {
  page?: number;
  limit?: number;
  brand?: number[];
  price?: number[];
  category?: number[];
  subCategory?: number[];
  rating?: number;
  search?: string;
  tags?: number[];
  $or?: {
    [key: string]: {$regex: string; $options: string};
  }[];
};

export {type ProductFilterKeys, type ProductParamsI};
