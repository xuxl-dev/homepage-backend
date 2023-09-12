import { Module } from '@nestjs/common';
import { OfflineMessageService } from './offline-message.service';
import { OfflineMessageController } from './offline-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Message } from '../internal-message/entities/message-new.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User, Message])],
  controllers: [OfflineMessageController],
  providers: [OfflineMessageService],
  exports: [OfflineMessageService]
})
export class OfflineMessageModule {}
