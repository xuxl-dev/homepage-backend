import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OfflineMessageService } from 'src/modules/offline-message/offline-message.service';

@Injectable()
export class TasksService {

  constructor(
    private readonly offlineMessageService: OfflineMessageService
  ) { }

  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleClean() {
    this.logger.debug('Cleaning up offline messages');

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const expiredMessages = await this.offlineMessageService.deleteBefore(thirtyDaysAgo);

      console.log(`${expiredMessages.affected} messages deleted.`);
    } catch (error) {
      console.error('Error deleting expired messages:', error);
    }
  }
}