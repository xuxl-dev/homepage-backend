import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QqbotService } from './qqbot.service';
import { CreateQqbotDto } from './dto/create-qqbot.dto';
import { UpdateQqbotDto } from './dto/update-qqbot.dto';

@Controller('qqbot')
export class QqbotController {
  constructor(private readonly qqbotService: QqbotService) {}

  @Post()
  create(@Body() createQqbotDto: CreateQqbotDto) {
    return this.qqbotService.create(createQqbotDto);
  }

  @Get()
  findAll() {
    return this.qqbotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.qqbotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQqbotDto: UpdateQqbotDto) {
    return this.qqbotService.update(+id, updateQqbotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.qqbotService.remove(+id);
  }
}
