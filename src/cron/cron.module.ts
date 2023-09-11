import { Module } from '@nestjs/common';
import { TasksService } from './cron.service';
import { OfflineMessageModule } from 'src/modules/offline-message/offline-message.module';

@Module({
  imports: [OfflineMessageModule],
  providers: [TasksService],
})
export class CronModule {}
