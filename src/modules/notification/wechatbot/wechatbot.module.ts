import { Module } from '@nestjs/common';
import { WechatbotService } from './wechatbot.service';
import { WechatbotController } from './wechatbot.controller';

@Module({
  controllers: [WechatbotController],
  providers: [WechatbotService]
})
export class WechatbotModule {}
