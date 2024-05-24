import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ShareDocument = Share & Document;

@Schema({ timestamps: true })
export class Share {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;
}

const ShareSchema = SchemaFactory.createForClass(Share);

export { ShareSchema };
