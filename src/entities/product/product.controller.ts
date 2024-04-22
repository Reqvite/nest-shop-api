import {Body, Controller, Post, UseGuards, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {YupValidationPipe} from '@/pipes/yupValidation.pipe';
import {CreateProductDto} from './dto/createProduct.dto';
import {Product} from './model/product.model';
import {ProductService} from './product.service';
import {ProductSwagger} from './swagger/product.swagger';
import {productSchema} from './validation/product.schema';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseGuards(AccessAuthGuard)
  @UsePipes(new YupValidationPipe(productSchema))
  @ProductSwagger.create()
  async create(@Body() dto: Omit<CreateProductDto, '_id'>): Promise<Product> {
    return this.productService.create(dto);
  }
}
