import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/types';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop()
  nickname: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  salt: string;

  @Prop({
    required: true,
    default: 'https://avatars.githubusercontent.com/u/74760541?v=4',
  })
  avatar: string;

  @Prop({
    required: true,
    default: Role.User,
  })
  role: Role;
}

const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.salt;
    delete ret.__v;
    return ret;
  },
});

export { UserSchema };
