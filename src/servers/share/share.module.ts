import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShareSchema } from './entities/share.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Share', schema: ShareSchema }]),
  ],
  controllers: [ShareController],
  providers: [ShareService],
})
export class ShareModule {}
