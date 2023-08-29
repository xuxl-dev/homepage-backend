import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskflowService } from './taskflow.service';
import { CreateTaskflowDto } from './dto/create-taskflow.dto';
import { UpdateTaskflowDto } from './dto/update-taskflow.dto';

@Controller('taskflow')
export class TaskflowController {
  constructor(private readonly taskflowService: TaskflowService) {}

  @Post()
  create(@Body() createTaskflowDto: CreateTaskflowDto) {
    return this.taskflowService.create(createTaskflowDto);
  }

  @Get()
  findAll() {
    return this.taskflowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskflowService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskflowDto: UpdateTaskflowDto) {
    return this.taskflowService.update(+id, updateTaskflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskflowService.remove(+id);
  }
}
