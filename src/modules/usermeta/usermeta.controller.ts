import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsermetaService } from './usermeta.service';
import { CreateUsermetaDto } from './dto/create-usermeta.dto';
import { UpdateUsermetaDto } from './dto/update-usermeta.dto';

@Controller('usermeta')
export class UsermetaController {
  constructor(private readonly usermetaService: UsermetaService) {}

  @Post()
  create(@Body() createUsermetaDto: CreateUsermetaDto) {
    return this.usermetaService.create(createUsermetaDto);
  }

  @Get()
  findAll() {
    return this.usermetaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usermetaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsermetaDto: UpdateUsermetaDto) {
    return this.usermetaService.update(+id, updateUsermetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usermetaService.remove(+id);
  }
}
