import { Module } from '@nestjs/common';
import { InternalMessageService } from './internal-message.service';
import { InternalMessageController } from './internal-message.controller';
import { UsermetaModule } from '../usermeta/usermeta.module';

@Module({
  imports: [UsermetaModule],
  controllers: [InternalMessageController],
  providers: [InternalMessageService]
})
export class InternalMessageModule {}
