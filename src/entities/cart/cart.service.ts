import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, ObjectId} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/services/customErrors.service';
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

  async addToCart(dto: AddToCartDto, userId: ObjectId): Promise<CartItem[]> {
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

  async updateCart(dto: AddToCartDto, userId: ObjectId): Promise<CartItem[]> {
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

  async deleteItemFromCart(productId: ObjectId, userId: ObjectId): Promise<CartItem[]> {
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
