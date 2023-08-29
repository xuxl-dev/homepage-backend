import { Injectable } from '@nestjs/common';
import { CreateInternalMessageDto } from './dto/create-internal-message.dto';
import { UpdateInternalMessageDto } from './dto/update-internal-message.dto';

@Injectable()
export class InternalMessageService {
 
  send(message: CreateInternalMessageDto) {
    // check if receiver is online, 
    // Note that even if receiver is online, it may be disconnected but not yet timeout
    // if online, send message to receiver
    // if offline, convert into offline message
  }
  
}
