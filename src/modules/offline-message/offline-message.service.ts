import { Injectable } from '@nestjs/common';
import { CreateOfflineMessageDto } from './dto/create-offline-message.dto';
import { UpdateOfflineMessageDto } from './dto/update-offline-message.dto';

@Injectable()
export class OfflineMessageService {
  create(createOfflineMessageDto: CreateOfflineMessageDto) {
    return 'This action adds a new offlineMessage';
  }

  findAll() {
    return `This action returns all offlineMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} offlineMessage`;
  }

  update(id: number, updateOfflineMessageDto: UpdateOfflineMessageDto) {
    return `This action updates a #${id} offlineMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} offlineMessage`;
  }
}
