import { Injectable } from '@nestjs/common';
import { CreateQqbotDto } from './dto/create-qqbot.dto';
import { UpdateQqbotDto } from './dto/update-qqbot.dto';

@Injectable()
export class QqbotService {
  create(createQqbotDto: CreateQqbotDto) {
    return 'This action adds a new qqbot';
  }

  findAll() {
    return `This action returns all qqbot`;
  }

  findOne(id: number) {
    return `This action returns a #${id} qqbot`;
  }

  update(id: number, updateQqbotDto: UpdateQqbotDto) {
    return `This action updates a #${id} qqbot`;
  }

  remove(id: number) {
    return `This action removes a #${id} qqbot`;
  }
}
