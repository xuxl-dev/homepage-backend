import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatgroupService } from './chatgroup.service';
import { CreateChatgroupDto } from './dto/create-chatgroup.dto';
import { UpdateChatgroupDto } from './dto/update-chatgroup.dto';

@Controller('chatgroup')
export class ChatgroupController {
  constructor(private readonly chatgroupService: ChatgroupService) {}

  @Post()
  create(@Body() createChatgroupDto: CreateChatgroupDto) {
    return this.chatgroupService.create(createChatgroupDto);
  }

  @Get()
  findAll() {
    return this.chatgroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatgroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatgroupDto: UpdateChatgroupDto) {
    return this.chatgroupService.update(+id, updateChatgroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatgroupService.remove(+id);
  }
}
