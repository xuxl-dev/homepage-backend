import { Module } from '@nestjs/common';
import { TasksService } from './cron.service';

@Module({
  imports: [],
  providers: [TasksService],
})
export class CronModule {}
