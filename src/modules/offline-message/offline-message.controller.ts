import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OfflineMessageService } from './offline-message.service';
import { CreateOfflineMessageDto } from './dto/create-offline-message.dto';
import { UpdateOfflineMessageDto } from './dto/update-offline-message.dto';

@Controller('offline-message')
export class OfflineMessageController {
  constructor(private readonly offlineMessageService: OfflineMessageService) {}

  @Post()
  create(@Body() createOfflineMessageDto: CreateOfflineMessageDto) {
    return this.offlineMessageService.create(createOfflineMessageDto);
  }

  @Get()
  findAll() {
    return this.offlineMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offlineMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOfflineMessageDto: UpdateOfflineMessageDto) {
    return this.offlineMessageService.update(+id, updateOfflineMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offlineMessageService.remove(+id);
  }
}
