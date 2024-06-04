import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MongooseSchema} from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({timestamps: true, versionKey: false})
export class Review {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({required: true, type: MongooseSchema.Types.ObjectId, ref: 'User'})
  userId: MongooseSchema.Types.ObjectId;

  @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Review'}], default: []})
  children: MongooseSchema.Types.ObjectId[];

  @Prop({required: true})
  message: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
