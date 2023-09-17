import { Module } from '@nestjs/common';
import { SocketIoService } from './socket-io.service';
import { SocketIoGateway } from './socket-io.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatgroupModule } from '../chatgroup/chatgroup.module';
import { OfflineMessageModule } from '../offline-message/offline-message.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    AuthModule,
    ChatgroupModule,
    OfflineMessageModule,
    BullModule.registerQueue({
      name: 'message',
    })],
  providers: [SocketIoGateway, SocketIoService],
  exports: [SocketIoService]
})
export class SocketIoModule { }
