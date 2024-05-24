import { Module } from '@nestjs/common';
import { AdviceService } from './advice.service';
import { AdviceController } from './advice.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdviceSchema } from './entities/advice.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Advice', schema: AdviceSchema }]),
  ],
  controllers: [AdviceController],
  providers: [AdviceService],
})
export class AdviceModule {}
