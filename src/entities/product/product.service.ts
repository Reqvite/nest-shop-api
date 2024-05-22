import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, ObjectId} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {CategoriesEnum} from '@/enums/categories.enum';
import {SortOrder} from '@/enums/sortBy.enum';
import {CustomErrors} from '@/services/customErrors.service';
import {
  GetProductsQuantityByCategoryResponseI,
  GetProductsResponseI,
  GetWishlistResponseI
} from '@/types/product.interface';
import {UserWishlistResponseDto} from '../auth/dto/userResponse.dto';
import {User} from '../auth/model/user.model';
import {discountedPriceAddField, minMaxPricesGroup} from './const/pipelines.const';
import {CreateProductDto} from './dto/createProduct.dto';
import {getQueryParams} from './helpers/getQueryParams';
import {getProductsSortBy} from './helpers/getSortBy';
import {Product} from './model/product.model';
import {ProductsQueryParamsSchemaType} from './validation/getProductsQueryParams.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async getProductById(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).lean();
    if (!product) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Product'));
    }

    return product;
  }

  async getUserWishlist(params: ProductsQueryParamsSchemaType, userId: ObjectId): Promise<GetWishlistResponseI> {
    const {query, skip, pageIdx, itemsLimit} = getQueryParams(params);
    const user = await this.userModel.findOne({_id: userId}).select('wishlist');

    const aggregationPipeline = [
      {$match: {_id: {$in: user.wishlist}, ...query}},
      discountedPriceAddField,
      {
        $facet: {
          products: [{$skip: skip}, {$limit: itemsLimit}],
          totalCount: [
            {
              $group: {
                _id: null,
                count: {$sum: 1}
              }
            }
          ]
        }
      }
    ];

    const [{products, totalCount}] = await this.productModel.aggregate(aggregationPipeline);
    const totalPages = Math.ceil(totalCount[0]?.count / itemsLimit);

    return {
      results: products,
      currentPage: pageIdx,
      totalPages
    };
  }

  async getProducts(params: ProductsQueryParamsSchemaType): Promise<GetProductsResponseI> {
    const {query, skip, pageIdx, itemsLimit} = getQueryParams(params);
    const sort = getProductsSortBy(params.orderBy, Number(params.order) as SortOrder);

    const aggregationPipeline = [discountedPriceAddField, sort, {$match: query}, {$skip: skip}, {$limit: itemsLimit}];
    const productsPromise = this.productModel.aggregate(aggregationPipeline);
    const totalResultsPromise = this.productModel.aggregate([
      discountedPriceAddField,
      {$match: query},
      {
        $group: {
          _id: null,
          count: {$sum: 1}
        }
      }
    ]);
    const totalProductsPromise = this.productModel.countDocuments();
    const minMaxPricesPromise = this.productModel.aggregate([discountedPriceAddField, minMaxPricesGroup]);
    const [products, totalResults, totalProducts, minMaxPrices] = await Promise.all([
      productsPromise,
      totalResultsPromise,
      totalProductsPromise,
      minMaxPricesPromise
    ]);
    const totalPages = Math.ceil(totalResults[0]?.count / itemsLimit);

    return {
      results: products,
      totalResults: totalResults[0]?.count,
      currentPage: pageIdx,
      totalPages,
      totalItems: totalProducts,
      minMaxPrices: [minMaxPrices[0]?.minPrice, minMaxPrices[0]?.maxPrice]
    };
  }

  async getProductsQuantityByCategories(
    params: ProductsQueryParamsSchemaType
  ): Promise<GetProductsQuantityByCategoryResponseI[]> {
    const {query} = getQueryParams(params);

    const aggregationPipeline = [
      discountedPriceAddField,
      {$match: {...query, category: {$in: Object.values(CategoriesEnum)}}},
      {
        $group: {
          _id: '$category',
          quantity: {$sum: 1}
        }
      }
    ];

    const productQuantities = await this.productModel.aggregate(aggregationPipeline);
    return productQuantities;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    return await this.productModel.create(dto);
  }

  async updateById(body: CreateProductDto, id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(id, body, {new: true});
    if (!product) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Product'));
    }
    return product;
  }
  async updateWishlist(productId: ObjectId, userId: ObjectId): Promise<UserWishlistResponseDto> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Product'));
    }

    let user = null;

    const userWithNewWishlistId = await this.userModel.findOneAndUpdate(
      {_id: userId, wishlist: {$ne: productId}},
      {$addToSet: {wishlist: productId}},
      {new: true}
    );

    if (!userWithNewWishlistId) {
      const userWithDeletedWishlistId = await this.userModel.findByIdAndUpdate(
        userId,
        {$pull: {wishlist: productId}},
        {new: true}
      );
      if (!userWithDeletedWishlistId) {
        throw CustomErrors.AuthorizationError();
      }
      user = userWithDeletedWishlistId;
    } else {
      user = userWithNewWishlistId;
    }

    return user.wishlist;
  }
}
