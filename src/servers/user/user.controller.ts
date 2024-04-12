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

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Public()
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
  @Public()
  async resetPassword(@Body() body: { id: string; password: string }) {
    return this.userService.resetPassword(body.id, body.password);
  }

  @Delete(':id')
  @Public()
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
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
