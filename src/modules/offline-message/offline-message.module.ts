import { Module } from '@nestjs/common';
import { OfflineMessageService } from './offline-message.service';
import { OfflineMessageController } from './offline-message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Message_old } from '../internal-message/entities/message-new.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../internal-message/schemas/message.schema';

@Module({
  imports:[TypeOrmModule.forFeature([User, Message_old]), MongooseModule.forFeature(
    [{name: Message.name, schema: MessageSchema}]
  )],
  controllers: [OfflineMessageController],
  providers: [OfflineMessageService],
  exports: [OfflineMessageService]
})
export class OfflineMessageModule {}
