import { Injectable } from '@nestjs/common';
import { CreateChatsessDto } from './dto/create-chatsess.dto';
import { UpdateChatsessDto } from './dto/update-chatsess.dto';

@Injectable()
export class ChatsessService {
  create(createChatsessDto: CreateChatsessDto) {
    return 'This action adds a new chatsess';
  }

  findAll() {
    return `This action returns all chatsess`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatsess`;
  }

  update(id: number, updateChatsessDto: UpdateChatsessDto) {
    return `This action updates a #${id} chatsess`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatsess`;
  }
}
