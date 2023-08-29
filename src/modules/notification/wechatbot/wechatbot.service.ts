import { Injectable } from '@nestjs/common';
import { CreateWechatbotDto } from './dto/create-wechatbot.dto';
import { UpdateWechatbotDto } from './dto/update-wechatbot.dto';

@Injectable()
export class WechatbotService {
  create(createWechatbotDto: CreateWechatbotDto) {
    return 'This action adds a new wechatbot';
  }

  findAll() {
    return `This action returns all wechatbot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wechatbot`;
  }

  update(id: number, updateWechatbotDto: UpdateWechatbotDto) {
    return `This action updates a #${id} wechatbot`;
  }

  remove(id: number) {
    return `This action removes a #${id} wechatbot`;
  }
}
