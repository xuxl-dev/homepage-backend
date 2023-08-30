import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { SocketIoService } from './socket-io.service';
import { CreateSocketIoDto } from './dto/create-socket-io.dto';
import { UpdateSocketIoDto } from './dto/update-socket-io.dto';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketIoGateway {


  constructor(private readonly socketIoService: SocketIoService) {}

  // @SubscribeMessage('createSocketIo')
  
  
}
