import { Module } from '@nestjs/common';
import { OfflineMessageService } from './offline-message.service';
import { OfflineMessageController } from './offline-message.controller';

@Module({
  controllers: [OfflineMessageController],
  providers: [OfflineMessageService]
})
export class OfflineMessageModule {}
