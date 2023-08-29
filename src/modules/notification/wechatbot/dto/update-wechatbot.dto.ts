import { PartialType } from '@nestjs/swagger';
import { CreateWechatbotDto } from './create-wechatbot.dto';

export class UpdateWechatbotDto extends PartialType(CreateWechatbotDto) {}
