import {Body, Controller, Param, Post, Put, UseGuards, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {ObjectIdValidationPipe} from '@/commons/pipes/objectIdValidation.pipe';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
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
  @UsePipes(new YupValidationPipe(productSchema))
  @ProductSwagger.create()
  async create(@Body() dto: Omit<CreateProductDto, '_id'>): Promise<Product> {
    return this.productService.create(dto);
  }

  @Put(':id')
  @UseGuards(AccessAuthGuard)
  @ProductSwagger.updateById()
  async updateById(
    @Body(new YupValidationPipe(productSchema)) dto: Omit<CreateProductDto, '_id'>,
    @Param('id', new ObjectIdValidationPipe()) id: string
  ): Promise<Product> {
    return this.productService.updateById(dto, id);
  }
}
