import { Injectable } from '@nestjs/common';
import { CreateInternalMessageDto } from './dto/create-internal-message.dto';
import { UpdateInternalMessageDto } from './dto/update-internal-message.dto';

@Injectable()
export class InternalMessageService {
  create(createInternalMessageDto: CreateInternalMessageDto) {
    return 'This action adds a new internalMessage';
  }

  findAll() {
    return `This action returns all internalMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} internalMessage`;
  }

  update(id: number, updateInternalMessageDto: UpdateInternalMessageDto) {
    return `This action updates a #${id} internalMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} internalMessage`;
  }
}
