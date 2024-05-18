import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ErrorCode } from 'src/constants/error-code';
import { Public } from 'src/decorators/public.decorator';
import { CommonError } from 'src/errors/common.error';
import { AuthService } from 'src/servers/auth/auth.service';
import { LocalAuthGuard } from 'src/servers/auth/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { Role } from 'src/types';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {
    // 检测数据中是否有超级管理员,没有则创建一个
    this.userService.checkSysAdmin();
  }

  @Get()
  async queryUserList(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.userService.queryUserList({
      page,
      pageSize,
    });
  }

  @Put()
  @Roles(Role.SysAdmin, Role.Admin)
  async resetPassword(@Body() body: { id: string; password: string }) {
    return this.userService.resetPassword(body.id, body.password);
  }

  @Delete(':id')
  @Roles(Role.SysAdmin, Role.Admin)
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/admin/login')
  async adminLogin(@Req() req) {
    return this.authService.adminLogin(req.user);
  }

  @Public()
  @Post('/register')
  async register(@Body() body: CreateUserDto) {
    return this.userService.register(body);
  }

  @Get('/profile')
  async getProfile(@Req() req) {
    return req.user;
  }

  @Public()
  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      throw new CommonError(ErrorCode.UserNotFound, '用户不存在');
    }
    return user.toObject();
  }

  @Put(':id')
  @Roles(Role.SysAdmin, Role.Admin)
  async update(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.userService.update(id, body);
  }

  @Put(':id/password')
  @Roles(Role.SysAdmin, Role.Admin)
  async updatePassword(
    @Param('id') id: string,
    @Body() body: { password: string },
  ) {
    return this.userService.updatePassword(id, body.password);
  }

  // @Public()
  // @Post('create')
  // async createUsers() {
  //   let avatarNumber = 8266075;
  //   for (let i = 0; i < 3000; i++) {
  //     this.userService.register({
  //       username: `user${i}`,
  //       password: 'HmxZxy99!',
  //       avatar: `https://avatars.githubusercontent.com/u/${avatarNumber}?v=4`,
  //       role: Role.User,
  //     });
  //     avatarNumber += 2;
  //   }
  // }
}
