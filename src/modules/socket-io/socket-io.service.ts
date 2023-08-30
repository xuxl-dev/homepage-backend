import { Injectable } from '@nestjs/common';
import { CreateSocketIoDto } from './dto/create-socket-io.dto';
import { UpdateSocketIoDto } from './dto/update-socket-io.dto';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class SocketIoService {
  @WebSocketServer()
  server: Server;

  
}
