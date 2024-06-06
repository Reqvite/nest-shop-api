import {ApiProperty} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';

export class UpdateReviewDto {
  @ApiProperty({
    example: '6649e05e1c375dd68fffe7b4',
    required: true
  })
  _id: ObjectId;

  @ApiProperty({
    example: 5,
    required: true
  })
  rating: number;

  @ApiProperty({
    example: 'Updated message',
    required: true
  })
  message: string;
}
