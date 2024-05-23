import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MongooseSchema} from 'mongoose';

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
}

export const OrderSchema = SchemaFactory.createForClass(Order);
