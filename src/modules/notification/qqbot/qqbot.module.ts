import { Module } from '@nestjs/common';
import { QqbotService } from './qqbot.service';
import { QqbotController } from './qqbot.controller';

@Module({
  controllers: [QqbotController],
  providers: [QqbotService]
})
export class QqbotModule {}
