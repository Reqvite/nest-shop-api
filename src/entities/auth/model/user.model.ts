import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, ObjectId, Schema as MongooseSchema} from 'mongoose';
import {nameMaxLength, nameMinLength} from '../const/validation';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Schema({timestamps: true, versionKey: false})
export class User {
  _id: ObjectId;

  @Prop({
    type: [String],
    enum: UserRole,
    default: [UserRole.USER]
  })
  roles: UserRole[];

  @Prop({required: true, minlength: nameMinLength, maxlength: nameMaxLength})
  firstName: string;

  @Prop({required: true, minlength: nameMinLength, maxlength: nameMaxLength})
  lastName: string;

  @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref: 'Product'}], default: []})
  wishlist: ObjectId[];

  @Prop({
    type: [
      {
        _id: {type: MongooseSchema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, required: true, min: 1}
      }
    ],
    default: []
  })
  cart: {_id: MongooseSchema.Types.ObjectId; quantity: number}[];

  @Prop({unique: true, required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
