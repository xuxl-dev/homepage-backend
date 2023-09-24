import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TasksService {

  constructor() { }

  private readonly logger = new Logger(TasksService.name);

}