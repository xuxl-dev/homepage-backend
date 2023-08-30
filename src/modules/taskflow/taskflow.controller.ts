import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskflowService } from './taskflow.service';
import { CreateTaskflowDto } from './dto/create-taskflow.dto';
import { UpdateTaskflowDto } from './dto/update-taskflow.dto';

@Controller('taskflow')
export class TaskflowController {
  constructor(private readonly taskflowService: TaskflowService) {}


}
