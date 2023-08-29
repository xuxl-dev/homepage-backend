import { Injectable } from '@nestjs/common';
import { CreateInternalMessageDto } from './dto/create-internal-message.dto';
import { UpdateInternalMessageDto } from './dto/update-internal-message.dto';
import { UsermetaService } from '../usermeta/usermeta.service';

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
  }
}
