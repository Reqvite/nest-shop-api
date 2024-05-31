import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MongooseSchema} from 'mongoose';
import {Option} from '@/entities/product/model/product.model';

export type OrderDocument = HydratedDocument<Order>;

@Schema({timestamps: true, versionKey: false})
export class Order {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({required: true, type: MongooseSchema.Types.ObjectId})
  userId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: [
      {
        _id: {type: MongooseSchema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, required: true, min: 1}
      }
    ],
    default: []
  })
  products: {_id: MongooseSchema.Types.ObjectId; quantity: number}[];

  @Prop({type: [{label: String, value: String}], required: true, _id: true})
  billingInfo: Option[];

  @Prop({required: true, type: Number})
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
