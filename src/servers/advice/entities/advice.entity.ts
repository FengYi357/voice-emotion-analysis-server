import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { AdviceEvaluation } from 'src/types';

export type AdviceDocument = Advice & Document;

@Schema({ timestamps: true })
export class Advice {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;

  @Prop()
  reply: string;

  @Prop()
  evaluation: AdviceEvaluation;
}

const AdviceSchema = SchemaFactory.createForClass(Advice);

export { AdviceSchema };
