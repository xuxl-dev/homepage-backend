import { Module } from '@nestjs/common';
import { TaskflowService } from './taskflow.service';
import { TaskflowController } from './taskflow.controller';

@Module({
  controllers: [TaskflowController],
  providers: [TaskflowService]
})
export class TaskflowModule {}
