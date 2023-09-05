import { Module } from '@nestjs/common';
import { OfflineMessageService } from './offline-message.service';
import { OfflineMessageController } from './offline-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfflineMessage } from './entities/offline-message.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([OfflineMessage, User])],
  controllers: [OfflineMessageController],
  providers: [OfflineMessageService],
  exports: [OfflineMessageService]
})
export class OfflineMessageModule {}
