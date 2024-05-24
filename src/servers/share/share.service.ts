import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShareDto } from './dto/create-share.dto';
import { Share } from './entities/share.entity';

@Injectable()
export class ShareService {
  constructor(
    @InjectModel('Share') private readonly shareModel: Model<Share>,
  ) {}

  create(createShareDto: CreateShareDto, userId: string) {
    // 存入数据库
    const share = new this.shareModel({
      ...createShareDto,
      user: userId,
    });
    return share.save();
  }

  findAllByUser() {
    return this.shareModel.find();
  }

  async findAllByAdmin(config: { page: number; pageSize: number }) {
    const { page, pageSize } = config;
    const shares = await this.shareModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('user');
    console.log('✨  ~ ShareService ~ findAllByAdmin ~ shares:', shares);

    return {
      list: shares,
      total: await this.shareModel.countDocuments(),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} share`;
  }

  // async update(updateShareDto: UpdateShareDto) {
  //   const { _id, ...rest } = updateShareDto;
  //   return this.shareModel.findByIdAndUpdate(_id, rest, { new: true });
  // }

  async updateReply(_id: string, reply: string) {
    return this.shareModel.findByIdAndUpdate(_id, { reply }, { new: true });
  }

  remove(id: string) {
    return this.shareModel.findByIdAndDelete(id);
  }
}
