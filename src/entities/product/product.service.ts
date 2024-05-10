import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, ObjectId} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {SortOrder} from '@/enums/sortBy.enum';
import {decodeSearchParams} from '@/lib/helpers/searchParams.helper';
import {CustomErrors} from '@/services/customErrors.service';
import {GetProductsQuantityByCategoryResponseI, GetProductsResponseI} from '@/types/product.interface';
import {UserWishlistResponseDto} from '../auth/dto/userResponse.dto';
import {User} from '../auth/model/user.model';
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
    const product = await this.productModel.findById(id);
    if (!product) {
      throw CustomErrors.NotFoundError(ErrorMessages.NOT_FOUND('Product'));
    }
    return product;
  }

  async getProducts(params: ProductsQueryParamsSchemaType): Promise<GetProductsResponseI> {
    const {query, skip, pageIdx, itemsLimit} = getQueryParams(params);
    const sort = getProductsSortBy(params.orderBy, Number(params.order) as SortOrder);

    const productsPromise = this.productModel.find(query).sort(sort).skip(skip).limit(itemsLimit);
    const totalResultsPromise = this.productModel.countDocuments(query);
    const totalProductsPromise = this.productModel.countDocuments();

    const [products, totalResults, totalProducts] = await Promise.all([
      productsPromise,
      totalResultsPromise,
      totalProductsPromise
    ]);
    const totalPages = Math.ceil(totalResults / itemsLimit);

    return {
      results: products,
      totalResults,
      currentPage: pageIdx,
      totalPages,
      totalItems: totalProducts
    };
  }

  async getProductsQuantityByCategories(
    params: ProductsQueryParamsSchemaType
  ): Promise<GetProductsQuantityByCategoryResponseI[]> {
    const {categories} = decodeSearchParams(params);
    const aggregationPipeline = [];

    if (categories) {
      aggregationPipeline.push({
        $match: {
          category: {$in: categories}
        }
      });
    }
    aggregationPipeline.push({
      $group: {
        _id: '$category',
        quantity: {$sum: 1}
      }
    });

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

    let updatedUser = null;

    const user = await this.userModel.findOneAndUpdate(
      {_id: userId, wishlist: {$ne: productId}},
      {$addToSet: {wishlist: productId}},
      {new: true}
    );

    if (!user) {
      updatedUser = await this.userModel.findByIdAndUpdate(userId, {$pull: {wishlist: productId}}, {new: true});
    } else {
      updatedUser = user;
    }

    return updatedUser.wishlist;
  }
}
