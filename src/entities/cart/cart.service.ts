import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from '@nestjs/mongoose';
import {ObjectId} from 'mongodb';
import mongoose, {Model, ObjectId as ObjectIdType} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/services/customErrors.service';
import {ProductWithOrderedQuantity} from '@/types/product.interface';
import {CartItem} from '@/types/user.interface';
import {User} from '../auth/model/user.model';
import {getQueryParams} from '../product/helpers/getQueryParams';
import {Product} from '../product/model/product.model';
import {ProductsQueryParamsSchemaType} from '../product/validation/getProductsQueryParams.schema';
import {AddToCartDto} from './dto/addToCart.dto';
import {CompleteOrderDto} from './dto/completeOrder.dto';
import {checkProductQuantity, checkProductsQuantity} from './helpers/checkQuantity';
import {getBillingInfo} from './helpers/getBillingInfo';
import {Order} from './model/order.model';

@Injectable()
export class CartService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Order.name) private readonly orderModel: Model<User>
  ) {}

  async getOrders(_id: string, params: ProductsQueryParamsSchemaType): Promise<any> {
    const {query, skip, pageIdx, itemsLimit} = getQueryParams(params);

    const aggregationPipeline = [
      {
        $facet: {
          orders: [
            {$match: {userId: new ObjectId(_id), ...query}},
            {$skip: skip},
            {$limit: itemsLimit},
            {
              $lookup: {
                from: 'products',
                localField: 'products._id',
                foreignField: '_id',
                as: 'fullProducts'
              }
            },
            {
              $addFields: {
                products: '$fullProducts',
                quantity: '$fullProducts.quantity'
              }
            },
            {
              $project: {
                fullProducts: 0
              }
            }
          ],
          totalResults: [
            {$match: {userId: new ObjectId(_id), ...query}},
            {
              $group: {
                _id: null,
                count: {$sum: 1}
              }
            }
          ],
          totalOrders: [
            {$match: {userId: new ObjectId(_id), ...query}},
            {
              $count: 'total'
            }
          ]
        }
      }
    ];

    const results = await this.orderModel.aggregate(aggregationPipeline);

    const orders = results[0]?.orders;
    const totalResults = results[0]?.totalResults?.length ? results[0]?.totalResults[0]?.count : 0;
    const totalProducts = results[0]?.totalOrders?.length ? results[0]?.totalOrders[0]?.total : 0;
    const totalPages = Math.ceil(totalResults / itemsLimit);

    return {
      results: orders,
      totalResults: totalResults[0]?.count,
      currentPage: pageIdx,
      totalPages,
      totalItems: totalProducts
    };
  }

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

  async completeOrder({products, orderInformation, totalPrice}: CompleteOrderDto, userId: ObjectIdType): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const productsIds = products.map(({_id}) => _id);
      const foundedProducts = await this.productModel.find({_id: {$in: productsIds}}).session(session);

      checkProductsQuantity(products, foundedProducts);

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

      console.log(totalPrice);
      await Promise.all([
        this.productModel.bulkWrite(updatedProducts, {session}),
        this.userModel.findByIdAndUpdate({_id: userId}, {cart: []}, {session}),
        this.orderModel.create([{products, userId, billingInfo: getBillingInfo(orderInformation), totalPrice}], {
          session
        })
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

    checkProductQuantity(product, dto);

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

    checkProductQuantity(product, dto);

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
