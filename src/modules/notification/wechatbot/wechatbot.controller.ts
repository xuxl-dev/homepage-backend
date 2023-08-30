import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WechatbotService } from './wechatbot.service';
import { CreateWechatbotDto } from './dto/create-wechatbot.dto';
import { UpdateWechatbotDto } from './dto/update-wechatbot.dto';

@Controller('wechatbot')
export class WechatbotController {
  constructor(private readonly wechatbotService: WechatbotService) {}
}
