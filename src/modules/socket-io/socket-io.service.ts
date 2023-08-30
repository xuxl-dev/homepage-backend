import { Injectable } from '@nestjs/common';
import { CreateSocketIoDto } from './dto/create-socket-io.dto';
import { UpdateSocketIoDto } from './dto/update-socket-io.dto';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SocketIoService {

  constructor(
    private readonly authservice: AuthService,
  ) { }

  @WebSocketServer()
  io: Server;

  create(createSocketIoDto: CreateSocketIoDto) {

  }

  joinRoom(room: string, socket: Socket) {
    socket.join(room);
  }

  disconnect(socket: Socket) {
    socket.disconnect();
  }

  getJwtTokenFromSocket(socket: Socket) {
    return socket.handshake.headers.authorization;
  }

  async getUserFromSocket(socket: Socket) {
    return await this.authservice.getUserByToken(this.getJwtTokenFromSocket(socket));
  }

}
