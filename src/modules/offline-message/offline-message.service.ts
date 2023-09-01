import { Injectable } from '@nestjs/common';
import { CreateOfflineMessageDto } from './dto/create-offline-message.dto';
import { UpdateOfflineMessageDto } from './dto/update-offline-message.dto';
import { NOT_IMPLEMENTED } from 'src/utils/utils';
import { InternalMessage } from '../internal-message/entities/internal-message.entity';


/**
 * feature:
 * 通过回执计数来避免恶意的客户端修改回执逻辑，
 * 当送达回执未收到时，不发送下一条消息
 * （用户自行设置）当已读回执未收到时，不发送下一条消息
 */

@Injectable()
export class OfflineMessageService {
  sendMessageOrThrow(message: InternalMessage) {
    NOT_IMPLEMENTED()
  }
}
