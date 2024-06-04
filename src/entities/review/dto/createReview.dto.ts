import {ApiProperty} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';

export class CreateReviewDto {
  @ApiProperty({
    example: '6649e05e1c375dd68fffe7b4',
    required: false
  })
  parentId: ObjectId;

  @ApiProperty({
    example: '6649e05e1c375dd68fffe7b4',
    required: true
  })
  productId: ObjectId;

  @ApiProperty({
    example: 'Review message',
    required: true
  })
  message: string;
}
