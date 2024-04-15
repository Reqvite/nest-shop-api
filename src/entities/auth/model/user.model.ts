import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Schema as MongooseSchema} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true, versionKey: false})
export class User {
  @Prop()
  _id: MongooseSchema.Types.ObjectId;

  @Prop({required: true})
  firstName: string;

  @Prop({required: true})
  lastName: string;

  @Prop({unique: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop()
  phoneNumber: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
