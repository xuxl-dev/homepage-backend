import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FourmService } from './fourm.service';
import { CreateFourmDto } from './dto/create-fourm.dto';
import { UpdateFourmDto } from './dto/update-fourm.dto';

@Controller('fourm')
export class FourmController {
  constructor(private readonly fourmService: FourmService) {}

  @Post()
  create(@Body() createFourmDto: CreateFourmDto) {
    return this.fourmService.create(createFourmDto);
  }

  @Get()
  findAll() {
    return this.fourmService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fourmService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFourmDto: UpdateFourmDto) {
    return this.fourmService.update(+id, updateFourmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fourmService.remove(+id);
  }
}
