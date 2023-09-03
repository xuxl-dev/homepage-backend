import { Module } from '@nestjs/common';
import { SocketIoService } from './socket-io.service';
import { SocketIoGateway } from './socket-io.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatgroupModule } from '../chatgroup/chatgroup.module';
import { OfflineMessageModule } from '../offline-message/offline-message.module';

@Module({
  imports: [AuthModule, ChatgroupModule, OfflineMessageModule],
  providers: [SocketIoGateway, SocketIoService],
  exports: [SocketIoService]
})
export class SocketIoModule {}
