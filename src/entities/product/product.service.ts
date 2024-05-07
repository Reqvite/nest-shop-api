import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {SortOrder} from '@/enums/sortBy.enum';
import {decodeSearchParams} from '@/lib/helpers/searchParams.helper';
import {CustomErrors} from '@/services/customErrors.service';
import {GetProductsQuantityByCategoryResponseI, GetProductsResponseI} from '@/types/product.interface';
import {CreateProductDto} from './dto/createProduct.dto';
import {getQueryParams} from './helpers/getQueryParams';
import {getProductsSortBy} from './helpers/getSortBy';
import {Product} from './model/product.model';
import {ProductsQueryParamsSchemaType} from './validation/getProductsQueryParams.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>
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
    const {category} = decodeSearchParams(params);
    const aggregationPipeline = [];

    if (category) {
      aggregationPipeline.push({
        $match: {
          category: {$in: category}
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
}
