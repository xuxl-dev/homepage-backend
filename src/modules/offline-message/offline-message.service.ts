import { Injectable } from '@nestjs/common';
import { CreateOfflineMessageDto } from './dto/create-offline-message.dto';
import { UpdateOfflineMessageDto } from './dto/update-offline-message.dto';
import { NOT_IMPLEMENTED } from 'src/utils/utils';
import { InternalMessage } from '../internal-message/entities/internal-message.entity';

@Injectable()
export class OfflineMessageService {
  sendMessageOrThrow(message: InternalMessage) {
    NOT_IMPLEMENTED()
  }
}
