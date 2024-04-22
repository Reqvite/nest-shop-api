import {Body, Controller, Post, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {YupValidationPipe} from '@/pipes/yupValidation.pipe';
import {CreateProductDto} from './dto/createProduct.dto';
import {ProductService} from './product.service';
import {ProductSwagger} from './swagger/product.swagger';
import {productSchema} from './validation/product.schema';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UsePipes(new YupValidationPipe(productSchema))
  @ProductSwagger.create()
  async create(@Body() dto: Omit<CreateProductDto, '_id'>) {
    return this.productService.create(dto);
  }
}
