import { Injectable, Logger } from '@nestjs/common';
import { CreateInternalMessageDto } from './dto/create-internal-message.dto';
import { UpdateInternalMessageDto } from './dto/update-internal-message.dto';
import { UsermetaService } from '../usermeta/usermeta.service';
import { UserStatus } from '../usermeta/entities/usermeta.entity';
import { NOT_IMPLEMENTED, backOff } from 'src/utils/utils';
import { OfflineMessageService } from '../offline-message/offline-message.service';
import { SocketIoService } from '../socket-io/socket-io.service';
import { InternalMessage } from './entities/internal-message.entity';
import { MessageTimeoutException } from '../socket-io/messenger';
import { Repository } from 'typeorm';
import { Message } from './entities/message-new.entity';
import { InjectRepository } from '@nestjs/typeorm';

const logger = new Logger('InternalMessageService')

@Injectable()
export class InternalMessageService {
  constructor(
    private readonly usermetaService: UsermetaService,
    private readonly socketIoService: SocketIoService,
    private readonly offlineMessageService: OfflineMessageService,
  ) {}
}

export class UserStatusExpiredException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UserOfflineException extends Error {
  constructor(message?: string) {
    super(message);
  }
}
