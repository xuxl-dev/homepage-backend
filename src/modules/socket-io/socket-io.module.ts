import { Module } from '@nestjs/common';
import { SocketIoService } from './socket-io.service';
import { SocketIoGateway } from './socket-io.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatgroupModule } from '../chatgroup/chatgroup.module';
import { OfflineMessageModule } from '../offline-message/offline-message.module';
import { BullModule } from '@nestjs/bull';
import { Dispatcher } from './dispatcher';
import { MessageQueue } from './message.consumer';
import { RoomManager } from './room-manager';
import { SocketManager } from './socket-mamager';

@Module({
  imports: [
    AuthModule,
    ChatgroupModule,
    OfflineMessageModule,
    BullModule.registerQueue({
      name: 'message',
    }),
    ChatgroupModule,
  ],
  providers: [SocketIoGateway, SocketIoService, Dispatcher, MessageQueue, RoomManager, SocketManager],
  exports: [SocketIoService]
})
export class SocketIoModule { }
