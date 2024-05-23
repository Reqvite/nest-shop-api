import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {ObjectId} from 'mongodb';
import {Model, ObjectId as ObjectIdType} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/services/customErrors.service';
import {ProductWithOrderedQuantity} from '@/types/product.interface';
import {CartItem} from '@/types/user.interface';
import {User} from '../auth/model/user.model';
import {Product} from '../product/model/product.model';
import {AddToCartDto} from './dto/addToCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async getCart(_id: string): Promise<ProductWithOrderedQuantity[]> {
    const cart = await this.userModel.aggregate([
      {$match: {_id: new ObjectId(_id)}},
      {$unwind: '$cart'},
      {
        $lookup: {
          from: 'products',
          localField: 'cart._id',
          foreignField: '_id',
          as: 'productDetails'
        }
      },
      {$unwind: '$productDetails'},
      {
        $addFields: {
          'productDetails.orderedQuantity': '$cart.quantity'
        }
      },
      {
        $replaceRoot: {
          newRoot: '$productDetails'
        }
      }
    ]);

    return cart;
  }

  async addToCart(dto: AddToCartDto, userId: ObjectIdType): Promise<CartItem[]> {
    const product = await this.productModel.findById({_id: dto._id});
    if (!product) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Product'));
    }
    const result = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        'cart._id': {$ne: dto._id}
      },
      {
        $push: {cart: dto}
      },
      {
        new: true
      }
    );

    if (!result) {
      throw CustomErrors.ConflictError('Product already in cart');
    }

    return result.cart;
  }

  async updateCart(dto: AddToCartDto, userId: ObjectIdType): Promise<CartItem[]> {
    const product = await this.productModel.findById({_id: dto._id});
    if (!product) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Product'));
    }

    const result = await this.userModel.findOneAndUpdate(
      {
        _id: userId,
        cart: {$elemMatch: {_id: dto._id}}
      },
      {
        $set: {
          'cart.$.quantity': dto.quantity
        }
      },
      {
        new: true
      }
    );

    if (!result) {
      throw CustomErrors.NotFoundError('This product wasn`t found in your cart.');
    }

    return result.cart;
  }

  async deleteItemFromCart(productId: ObjectIdType, userId: ObjectIdType): Promise<CartItem[]> {
    const user = await this.userModel.findOneAndUpdate(
      {
        _id: userId
      },
      {$pull: {cart: {_id: productId}}},
      {
        new: true
      }
    );

    return user.cart;
  }
}
