import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
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
}
