import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatsessService } from './chatsess.service';
import { CreateChatsessDto } from './dto/create-chatsess.dto';
import { UpdateChatsessDto } from './dto/update-chatsess.dto';

@Controller('chatsess')
export class ChatsessController {
  constructor(private readonly chatsessService: ChatsessService) {}

  @Post()
  create(@Body() createChatsessDto: CreateChatsessDto) {
    return this.chatsessService.create(createChatsessDto);
  }

  @Get()
  findAll() {
    return this.chatsessService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsessService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatsessDto: UpdateChatsessDto) {
    return this.chatsessService.update(+id, updateChatsessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsessService.remove(+id);
  }
}
