import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ErrorCode } from 'src/constants/error-code';
import { CommonError } from 'src/errors/common.error';
import { encryptPassword, makeSalt } from 'src/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async queryUserList(config: { page: number; pageSize: number }) {
    const { page, pageSize } = config;
    const users = await this.userModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return {
      list: users.map((user) => user.toObject()),
      total: await this.userModel.countDocuments(),
    };
  }

  async resetPassword(id: string, psw: string) {
    const user = await this.userModel.findById(id);
    if (user) {
      const { password, salt } = await this.generatePassword(psw);
      user.password = password;
      user.salt = salt;
      await user.save();
      return true;
    } else {
      return false;
    }
  }

  async delete(id: string) {
    try {
      await this.userModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  }

  async generatePassword(psw: string) {
    if (
      psw.length < 6 ||
      psw.length > 20 ||
      !/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/.test(
        psw,
      )
    ) {
      throw new CommonError(ErrorCode.UserPasswordError, '密码不符合要求');
    }
    const salt = makeSalt();
    const password = encryptPassword(psw, salt);
    return {
      password,
      salt,
    };
  }

  async register(body: CreateUserDto) {
    const isExist = Boolean(await this.findOneByUsername(body.username));
    if (isExist) {
      throw new CommonError(ErrorCode.UserAlreadyExist, '用户名已存在');
    }
    const { password, salt } = await this.generatePassword(body.password);
    const user = new this.userModel(body);
    user.password = password;
    user.salt = salt;

    await user.save();
    return user.toObject();
  }

  async findOneByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      return null;
    }
    return user;
  }

  async findOneById(id: ObjectId) {
    const user = await this.userModel.findById(id);
    if (!user) {
      return null;
    }
    return user;
  }
}
