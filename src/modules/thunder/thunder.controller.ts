import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThunderService } from './thunder.service';
import { CreateThunderDto } from './dto/create-thunder.dto';
import { UpdateThunderDto } from './dto/update-thunder.dto';

@Controller('thunder')
export class ThunderController {
  constructor(private readonly thunderService: ThunderService) {}

  // @Post()
  // create(@Body() createThunderDto: CreateThunderDto) {
  //   return this.thunderService.create(createThunderDto);
  // }

  // @Get()
  // findAll() {
  //   return this.thunderService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.thunderService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateThunderDto: UpdateThunderDto) {
  //   return this.thunderService.update(+id, updateThunderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.thunderService.remove(+id);
  // }
}
