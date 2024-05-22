import {ApiProperty} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';
import {CartItem} from '@/types/user.interface';

export class AddToCartDto {
  @ApiProperty({
    example: '6649e05e1c375dd68fffe7b4',
    required: true
  })
  _id: ObjectId;

  @ApiProperty({
    example: 5,
    required: true
  })
  quantity: number;
}

export class AddToCartResponseDto {
  @ApiProperty({
    example: [{_id: '663cda9190ba9b627e6f729d', quantity: 1}]
  })
  cart: CartItem[];
}
