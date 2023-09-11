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

const logger = new Logger('InternalMessageService')

@Injectable()
export class InternalMessageService {
  constructor(
    private readonly usermetaService: UsermetaService,
    private readonly socketIoService: SocketIoService,
    private readonly offlineMessageService: OfflineMessageService,
  ) {}

  // async send(message: InternalMessage) {
  //   // check if receiver is online, 
  //   // if online, send message to receiver
  //   //  Note that even if receiver is online, it may be disconnected but not yet timeout
  //   //  so online message may fail, when fail, set status to offline and convert into offline message
  //   // if offline, convert into offline message
        
  //   const status = this.usermetaService.getStatus(message.receiverId)

  //   try {
  //     if (status === UserStatus.ONLINE) {
  //       this.socketIoService.sendMessageOrThrow(message);
  //     } else {
  //       throw new UserOfflineException();
  //     }
  //   } catch (e) {
  //     if (e instanceof UserOfflineException || e instanceof MessageTimeoutException) {
  //       try {
  //         await this.usermetaService.setStatus(message.receiverId, UserStatus.OFFLINE);
  //         this.offlineMessageService.sendMessageOrFail(message);
  //       } catch (e) {
  //         // this shall never happen
  //         // but if it does, we have a problem
  //         logger.fatal(`Unknown error when sending offline message: ${e}`);
  //         throw new Error('failed to send offline message');
  //       }
  //     } else {
  //       logger.fatal(`Unknown error when sending online message: ${e}`);
  //       throw new Error('failed to send online message');
  //     }
  //   }
  // }
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
