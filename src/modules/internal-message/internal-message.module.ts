import { Module } from '@nestjs/common';
import { InternalMessageService } from './internal-message.service';
import { InternalMessageController } from './internal-message.controller';

@Module({
  controllers: [InternalMessageController],
  providers: [InternalMessageService]
})
export class InternalMessageModule {}
