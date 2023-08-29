import { Injectable } from '@nestjs/common';
import { CreateTaskflowDto } from './dto/create-taskflow.dto';
import { UpdateTaskflowDto } from './dto/update-taskflow.dto';

@Injectable()
export class TaskflowService {
  create(createTaskflowDto: CreateTaskflowDto) {
    return 'This action adds a new taskflow';
  }

  findAll() {
    return `This action returns all taskflow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskflow`;
  }

  update(id: number, updateTaskflowDto: UpdateTaskflowDto) {
    return `This action updates a #${id} taskflow`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskflow`;
  }
}
