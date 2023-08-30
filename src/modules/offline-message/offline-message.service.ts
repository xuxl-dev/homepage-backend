import { Injectable } from '@nestjs/common';
import { CreateOfflineMessageDto } from './dto/create-offline-message.dto';
import { UpdateOfflineMessageDto } from './dto/update-offline-message.dto';
import { NOT_IMPLEMENTED } from 'src/utils/utils';

@Injectable()
export class OfflineMessageService {
  sendMessageOrThrow(message: CreateOfflineMessageDto) {
    NOT_IMPLEMENTED()
  }
}
