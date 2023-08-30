import { Injectable } from '@nestjs/common';
import { CreateInternalMessageDto } from './dto/create-internal-message.dto';
import { UpdateInternalMessageDto } from './dto/update-internal-message.dto';
import { UsermetaService } from '../usermeta/usermeta.service';
import { UserStatus } from '../usermeta/entities/usermeta.entity';
import { NOT_IMPLEMENTED, backOff } from 'src/utils/utils';

@Injectable()
export class InternalMessageService {
  constructor(
    private readonly usermetaService: UsermetaService,
  ) {}
  send(message: CreateInternalMessageDto) {
    // check if receiver is online, 
    // if online, send message to receiver
    //  Note that even if receiver is online, it may be disconnected but not yet timeout
    //  so online message may fail, when fail, set status to offline and convert into offline message
    // if offline, convert into offline message
    const status = this.usermetaService.getStatus(message.receiverId)
    const sendMessage = async () => {
      // send message to receiver
      NOT_IMPLEMENTED()
    }
    try {
      backOff(sendMessage, 1000, 3) //CHECKTHIS
      // set status to offline
      this.usermetaService.setStatus(message.receiverId, UserStatus.OFFLINE)
      // convert into offline message
      NOT_IMPLEMENTED()
    } catch (e) {
      if (e instanceof UserStatusExpiredException) {
        // convert into offline message
        NOT_IMPLEMENTED()
      }
      throw e //this should not happen
    }
  }
}

export class UserStatusExpiredException extends Error {
  constructor(message: string) {
    super(message);
  }
}
