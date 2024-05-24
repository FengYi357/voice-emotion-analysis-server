import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { Advice } from './entities/advice.entity';

@Injectable()
export class AdviceService {
  constructor(
    @InjectModel('Advice') private readonly adviceModel: Model<Advice>,
  ) {}

  create(createAdviceDto: CreateAdviceDto, userId: string) {
    // 存入数据库
    const advice = new this.adviceModel({
      ...createAdviceDto,
      user: userId,
    });
    return advice.save();
  }

  findAllByUser(userId: string) {
    return this.adviceModel.find({ user: userId });
  }

  async findAllByAdmin(config: { page: number; pageSize: number }) {
    const { page, pageSize } = config;
    const advices = await this.adviceModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('user');
    console.log('✨  ~ AdviceService ~ findAllByAdmin ~ advices:', advices);

    return {
      list: advices,
      total: await this.adviceModel.countDocuments(),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} advice`;
  }

  // async update(updateAdviceDto: UpdateAdviceDto) {
  //   const { _id, ...rest } = updateAdviceDto;
  //   return this.adviceModel.findByIdAndUpdate(_id, rest, { new: true });
  // }

  async updateReply(_id: string, reply: string) {
    return this.adviceModel.findByIdAndUpdate(_id, { reply }, { new: true });
  }

  remove(id: number) {
    return `This action removes a #${id} advice`;
  }
}
