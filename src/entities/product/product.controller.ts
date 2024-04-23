import {Body, Controller, Get, Param, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {ObjectIdValidationPipe} from '@/commons/pipes/objectIdValidation.pipe';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
import {GetProductsResponseI} from '@/types/product.interface';
import {CreateProductDto} from './dto/createProduct.dto';
import {Product} from './model/product.model';
import {ProductService} from './product.service';
import {ProductSwagger} from './swagger/product.swagger';
import {getProductsQueryParamsSchema} from './validation/getProductsQueryParams.schema';
import {productSchema} from './validation/product.schema';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  @ProductSwagger.getProducts()
  async getProducts(
    @Query(new YupValidationPipe(getProductsQueryParamsSchema)) params: {[key: string]: string}
  ): Promise<GetProductsResponseI> {
    return this.productService.getProducts(params);
  }

  @Get(':id')
  @ProductSwagger.getProductById()
  async getProductById(@Param('id', new ObjectIdValidationPipe()) id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Post()
  @UseGuards(AccessAuthGuard)
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
