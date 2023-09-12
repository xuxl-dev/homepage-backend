import { Module } from '@nestjs/common';
import { InternalMessageService } from './internal-message.service';
import { InternalMessageController } from './internal-message.controller';
import { UsermetaModule } from '../usermeta/usermeta.module';
import { SocketIoModule } from '../socket-io/socket-io.module';
import { OfflineMessageModule } from '../offline-message/offline-message.module';

@Module({
  imports: [UsermetaModule, SocketIoModule, OfflineMessageModule],
  controllers: [InternalMessageController],
  providers: [InternalMessageService]
})
export class InternalMessageModule {}
