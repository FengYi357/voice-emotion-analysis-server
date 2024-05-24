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
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/types';
import { ShareService } from './share.service';
import { CreateShareDto } from './dto/create-share.dto';

@Controller('shares')
export class ShareController {
  constructor(private readonly shareService: ShareService) {}

  @Post()
  create(@Body() createShareDto: CreateShareDto, @Req() req) {
    return this.shareService.create(createShareDto, req.user._id);
  }

  @Get()
  findAll(@Req() req) {
    return this.shareService.findAllByUser(req.user._id).populate('user');
  }

  @Get('admin')
  @Roles(Role.SysAdmin, Role.Admin)
  findAllAdmin(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.shareService.findAllByAdmin({
      page,
      pageSize,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shareService.findOne(+id);
  }

  @Put(':id/reply')
  @Roles(Role.SysAdmin, Role.Admin)
  updateReply(@Param('id') id: string, @Body() { reply }: { reply: string }) {
    return this.shareService.updateReply(id, reply);
  }

  @Delete(':id')
  @Roles(Role.SysAdmin, Role.Admin)
  remove(@Param('id') id: string) {
    return this.shareService.remove(id);
  }
}
