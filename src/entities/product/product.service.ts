import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ErrorMessages} from '@/const/errors.const';
import {CustomErrors} from '@/utils/customErrors.utils';
import {CreateProductDto} from './dto/createProduct.dto';
import {Product} from './model/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>
  ) {}

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
