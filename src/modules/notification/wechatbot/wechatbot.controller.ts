import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WechatbotService } from './wechatbot.service';
import { CreateWechatbotDto } from './dto/create-wechatbot.dto';
import { UpdateWechatbotDto } from './dto/update-wechatbot.dto';

@Controller('wechatbot')
export class WechatbotController {
  constructor(private readonly wechatbotService: WechatbotService) {}

  @Post()
  create(@Body() createWechatbotDto: CreateWechatbotDto) {
    return this.wechatbotService.create(createWechatbotDto);
  }

  @Get()
  findAll() {
    return this.wechatbotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wechatbotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWechatbotDto: UpdateWechatbotDto) {
    return this.wechatbotService.update(+id, updateWechatbotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wechatbotService.remove(+id);
  }
}
