import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MongooseSchema} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true, versionKey: false})
export class User {
  _id: MongooseSchema.Types.ObjectId;

  @Prop({required: true, minlength: 3, maxlength: 30})
  firstName: string;

  @Prop({required: true, minlength: 3, maxlength: 30})
  lastName: string;

  @Prop({unique: true, required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({minlength: 3, maxlength: 30})
  phoneNumber: string;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
