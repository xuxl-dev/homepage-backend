import { Module } from '@nestjs/common';
import { ChatgroupService } from './chatgroup.service';
import { ChatgroupController } from './chatgroup.controller';

@Module({
  controllers: [ChatgroupController],
  providers: [ChatgroupService]
})
export class ChatgroupModule {}
