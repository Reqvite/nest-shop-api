import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, ObjectId} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/services/customErrors.service';
import {User} from '../auth/model/user.model';
import {Product} from '../product/model/product.model';
import {AddToCartDto, AddToCartResponseDto} from './dto/addToCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async addToCart(dto: AddToCartDto, userId: ObjectId): Promise<AddToCartResponseDto> {
    const product = await this.productModel.findById({_id: dto._id});
    if (!product) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Product'));
    }
    let cart = null;
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
      throw CustomErrors.ConflictError();
    }

    cart = result.cart;
    return cart;
  }
}
