import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {GetProductsResponseI, ProductParamsI} from '@/types/product.interface';
import {CustomErrors} from '@/utils/customErrors.utils';
import {CreateProductDto} from './dto/createProduct.dto';
import {getProductsSortBy} from './helpers/getSortBy';
import {Product} from './model/product.model';
import {ProductsQueryParamsSchemaType} from './validation/getProductsQueryParams.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>
  ) {}

  async getProducts({
    page,
    limit,
    category,
    subCategory,
    rating,
    tags,
    sortBy,
    search
  }: ProductsQueryParamsSchemaType): Promise<GetProductsResponseI> {
    const pageIdx = Number(page) || 1;
    const itemsLimit = Number(limit) || 10;
    const numberRating = Number(rating);
    const skip = (pageIdx - 1) * itemsLimit;
    const query: ProductParamsI = {};
    const sort = getProductsSortBy(Number(sortBy));

    try {
      if (category) query.category = category;
      if (subCategory) query.subCategory = subCategory;
      if (rating) query.rating = {$gte: numberRating, $lt: numberRating + 1};
      if (tags && Array.isArray(JSON.parse(tags))) {
        query.tags = {$in: JSON.parse(tags)};
      }
      if (search) {
        query.$or = [
          {title: {$regex: search, $options: 'i'}},
          {brand: {$regex: search, $options: 'i'}},
          {'description.label': {$regex: search, $options: 'i'}},
          {'characteristics.label': {$regex: search, $options: 'i'}}
        ];
      }
    } catch (error) {}

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

  async create(dto: CreateProductDto): Promise<Product> {
    return await this.productModel.create(dto);
  }

  async updateById(body: CreateProductDto, id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(id, body, {new: true});
    if (!product) {
      throw CustomErrors.NotFoundError(ErrorMessages.PRODUCT_NOT_FOUND);
    }
    return product;
  }
}
