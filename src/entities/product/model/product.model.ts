import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MongooseSchema} from 'mongoose';
import {CategoriesEnum} from '@/enums/categories.enum';
import {TagsEnum} from '@/enums/tags.enum';

export type ProductDocument = HydratedDocument<Product>;

export class Option {
  @Prop({required: true})
  label: string;

  @Prop({required: true})
  value: string;
}

export class Img {
  @Prop({required: true})
  src: string;
}

@Schema({timestamps: true, versionKey: false})
export class Product {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({type: [{src: String}], required: true, _id: true})
  images: {_id: MongooseSchema.Types.ObjectId | number; src: string}[];

  @Prop({required: true})
  title: string;

  @Prop({type: [{label: String, value: String}], required: true, _id: true})
  description: Option[];

  @Prop({default: 0})
  rating: number;

  @Prop({required: true})
  price: number;

  @Prop({default: 0})
  quantity: number;

  @Prop({required: true})
  brand: number;

  @Prop({required: true, enum: CategoriesEnum})
  category: number;

  @Prop({required: true})
  subCategory: number;

  @Prop({type: [{type: Number, enum: TagsEnum}], required: true})
  tags: number[];

  @Prop({type: [{label: String, value: String}], required: true, _id: true})
  characteristics: Option[];

  @Prop({default: 0})
  discount?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
