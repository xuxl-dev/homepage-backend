import { Injectable } from '@nestjs/common';
import { CreateChatgroupDto } from './dto/create-chatgroup.dto';
import { UpdateChatgroupDto } from './dto/update-chatgroup.dto';
import { Repository } from 'typeorm';
import { ChatGroup } from './entities/chatgroup.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatgroupService {

  constructor(
    @InjectRepository(ChatGroup)
    private readonly chatgroupRepository: Repository<ChatGroup>,
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

  findGroupsById(userId: number) {
    throw new Error('Method not implemented.');
  }

  async hasRoom(id: number) {
    try {
      return await this.chatgroupRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return false;
    }
  }
}
