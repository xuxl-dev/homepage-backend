import { Injectable } from '@nestjs/common';
import { CreateSocketIoDto } from './dto/create-socket-io.dto';
import { UpdateSocketIoDto } from './dto/update-socket-io.dto';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketIoService {

  constructor() {}

  @WebSocketServer()
  io: Server;

  create(createSocketIoDto: CreateSocketIoDto) {
    
  }

  joinRoom(room: string, socket: Socket) {
    socket.join(room);
  }
  
}
