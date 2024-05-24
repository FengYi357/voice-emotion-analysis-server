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
import { AdviceService } from './advice.service';
import { CreateAdviceDto } from './dto/create-advice.dto';

@Controller('advices')
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @Post()
  create(@Body() createAdviceDto: CreateAdviceDto, @Req() req) {
    return this.adviceService.create(createAdviceDto, req.user._id);
  }

  @Get()
  findAll(@Req() req) {
    return this.adviceService.findAllByUser(req.user._id);
  }

  @Get('admin')
  @Roles(Role.SysAdmin, Role.Admin)
  findAllAdmin(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.adviceService.findAllByAdmin({
      page,
      pageSize,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adviceService.findOne(+id);
  }

  @Put(':id/reply')
  @Roles(Role.SysAdmin, Role.Admin)
  updateReply(@Param('id') id: string, @Body() { reply }: { reply: string }) {
    return this.adviceService.updateReply(id, reply);
  }

  @Delete(':id')
  @Roles(Role.SysAdmin, Role.Admin)
  remove(@Param('id') id: string) {
    return this.adviceService.remove(id);
  }
}
