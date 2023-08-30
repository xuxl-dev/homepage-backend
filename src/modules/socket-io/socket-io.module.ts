import { Module } from '@nestjs/common';
import { SocketIoService } from './socket-io.service';
import { SocketIoGateway } from './socket-io.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatgroupModule } from '../chatgroup/chatgroup.module';

@Module({
  imports: [AuthModule, ChatgroupModule],
  providers: [SocketIoGateway, SocketIoService],
  exports: [SocketIoService]
})
export class SocketIoModule {}
