import { Injectable, Logger } from '@nestjs/common';
import { UsermetaService } from '../usermeta/usermeta.service';
import { OfflineMessageService } from '../offline-message/offline-message.service';
import { SocketIoService } from '../socket-io/socket-io.service';

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
