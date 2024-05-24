import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import {ObjectId} from 'mongodb';
import mongoose, {Model, ObjectId as ObjectIdType} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/services/customErrors.service';
import {ProductWithOrderedQuantity} from '@/types/product.interface';
import {CartItem} from '@/types/user.interface';
import {User} from '../auth/model/user.model';
import {Product} from '../product/model/product.model';
import {AddToCartDto} from './dto/addToCart.dto';
import {Order} from './model/order.model';

@Injectable()
export class CartService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Order.name) private readonly orderModel: Model<User>
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

  async completeOrder(products: CartItem[], userId: ObjectIdType): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const productsIds = products.map(({_id}) => _id);
      const foundedProducts = await this.productModel.find({_id: {$in: productsIds}}).session(session);

      for (const foundedProduct of foundedProducts) {
        const orderedProduct = products.find(({_id}) => String(_id) === String(foundedProduct._id));
        if (foundedProduct.quantity < orderedProduct.quantity) {
          throw CustomErrors.BadRequestError(ErrorMessages.INSUFFICIENT_QUANTITY);
        }
      }

      const updatedProducts = products.map(({_id, quantity}) => ({
        updateOne: {
          filter: {
            _id
          },
          update: [
            {
              $set: {
                quantity: {
                  $max: [0, {$subtract: ['$quantity', quantity]}]
                }
              }
            }
          ]
        }
      }));

      await Promise.all([
        this.productModel.bulkWrite(updatedProducts, {session}),
        this.userModel.findByIdAndUpdate({_id: userId}, {cart: []}, {session}),
        this.orderModel.create([{products, userId}], {session})
      ]);

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
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
