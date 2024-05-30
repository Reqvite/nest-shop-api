import {ApiProperty} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';
import {CartItem} from '@/types/user.interface';
import {User} from '../model/user.model';

export class UserResponseDto {
  @ApiProperty({
    example: '661d1fd7fca08b6a72d2440e',
    required: true
  })
  _id: ObjectId;

  @ApiProperty({
    example: 'Reeves',
    required: true
  })
  firstName: string;

  @ApiProperty({
    example: 'Keanu',
    required: true
  })
  lastName: string;

  @ApiProperty({
    example: 'keanuReeves@gmail.com',
    required: true
  })
  email: string;

  @ApiProperty({
    example: 380604523122
  })
  phoneNumber: string;

  @ApiProperty({
    example: []
  })
  wishlist: ObjectId[];

  @ApiProperty({
    example: []
  })
  cart: CartItem[];

  constructor(model: User) {
    this._id = model._id;
    this.email = model.email;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.phoneNumber = model.phoneNumber;
    this.wishlist = model.wishlist;
    this.cart = model.cart;
  }
}

export class UserWishlistResponseDto {
  @ApiProperty({
    example: ['663cda9190ba9b627e6f729d']
  })
  wishlist: ObjectId[];
}
