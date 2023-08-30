import { Injectable } from '@nestjs/common';
import { CreateChatgroupDto } from './dto/create-chatgroup.dto';
import { UpdateChatgroupDto } from './dto/update-chatgroup.dto';
import { Repository } from 'typeorm';
import { Chatgroup } from './entities/chatgroup.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatgroupService {

  constructor(
    @InjectRepository(Chatgroup)
    private readonly chatgroupRepository: Repository<Chatgroup>,
  ) { }

  create(createChatgroupDto: CreateChatgroupDto) {
    return 'This action adds a new chatgroup';
  }

  findAll() {
    return `This action returns all chatgroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatgroup`;
  }

  update(id: number, updateChatgroupDto: UpdateChatgroupDto) {
    return `This action updates a #${id} chatgroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatgroup`;
  }

  async hasRoom(id: number) {
    try {
      return await this.chatgroupRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return false;
    }
  }
}
