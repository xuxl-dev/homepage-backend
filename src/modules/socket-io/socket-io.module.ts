import { Module } from '@nestjs/common';
import { SocketIoService } from './socket-io.service';
import { SocketIoGateway } from './socket-io.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SocketIoGateway, SocketIoService],
  exports: [SocketIoService]
})
export class SocketIoModule {}
