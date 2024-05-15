import {Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards, UsePipes} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {ObjectId} from 'mongoose';
import {GetCurrentUser} from '@/commons/decorators/getCurrentUser.decorator';
import {AccessAuthGuard} from '@/commons/guards/jwt.guard';
import {ObjectIdValidationPipe} from '@/commons/pipes/objectIdValidation.pipe';
import {YupValidationPipe} from '@/commons/pipes/yupValidation.pipe';
import {JwtPayloadI} from '@/types/jwt.interface';
import {
  GetProductsQuantityByCategoryResponseI,
  GetProductsResponseI,
  GetWishlistResponseI
} from '@/types/product.interface';
import {UserWishlistResponseDto} from '../auth/dto/userResponse.dto';
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
  @Get('/wishlist')
  @UseGuards(AccessAuthGuard)
  @ProductSwagger.getUserWishlist()
  async getUserWishlist(
    @Query(new YupValidationPipe(getProductsQueryParamsSchema)) params: {[key: string]: string},
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<GetWishlistResponseI> {
    return this.productService.getUserWishlist(params, userId);
  }

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

  @Get('categories/quantity')
  @ProductSwagger.getProductsQuantityByCategories()
  async getProductsQuantityByCategories(
    @Query(new YupValidationPipe(getProductsQueryParamsSchema)) params: {[key: string]: string}
  ): Promise<GetProductsQuantityByCategoryResponseI[]> {
    return this.productService.getProductsQuantityByCategories(params);
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

  @Patch(':id')
  @UseGuards(AccessAuthGuard)
  @ProductSwagger.updateWishlist()
  async updateWishlist(
    @Param('id', new ObjectIdValidationPipe()) id: ObjectId,
    @GetCurrentUser() {_id: userId}: JwtPayloadI
  ): Promise<UserWishlistResponseDto> {
    return this.productService.updateWishlist(id, userId);
  }
}
