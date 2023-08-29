import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InternalMessageService } from './internal-message.service';
import { CreateInternalMessageDto } from './dto/create-internal-message.dto';
import { UpdateInternalMessageDto } from './dto/update-internal-message.dto';

@Controller('internal-message')
export class InternalMessageController {
  constructor(private readonly internalMessageService: InternalMessageService) {}

  @Post()
  create(@Body() createInternalMessageDto: CreateInternalMessageDto) {
    return this.internalMessageService.create(createInternalMessageDto);
  }

  @Get()
  findAll() {
    return this.internalMessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internalMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInternalMessageDto: UpdateInternalMessageDto) {
    return this.internalMessageService.update(+id, updateInternalMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.internalMessageService.remove(+id);
  }
}
