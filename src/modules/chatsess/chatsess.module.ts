import { Module } from '@nestjs/common';
import { ChatsessService } from './chatsess.service';
import { ChatsessController } from './chatsess.controller';

@Module({
  controllers: [ChatsessController],
  providers: [ChatsessService]
})
export class ChatsessModule {}
