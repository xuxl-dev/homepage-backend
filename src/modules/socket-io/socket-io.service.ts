import { Injectable } from '@nestjs/common';
import { CreateSocketIoDto } from './dto/create-socket-io.dto';
import { UpdateSocketIoDto } from './dto/update-socket-io.dto';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatgroupService } from '../chatgroup/chatgroup.service';
import { InternalMessage } from '../internal-message/entities/internal-message.entity';

@Injectable()
export class SocketIoService {

  sockets: { [key: string]: Socket } = {}

  constructor(
    private readonly authservice: AuthService,
    private readonly chatGroupService: ChatgroupService,
  ) { }

  @WebSocketServer()
  io: Server;

  sendMessage(message: InternalMessage) {
    const socket = this.getSocketFromId(message.receiverId);
    if (socket) {
      socket.emit('message', message);
    } else {
      throw new Error('socket not found');
    }
  }

  createRoom(createSocketIoDto: CreateRoomDto) {
    this.chatGroupService.create(createSocketIoDto);
  }

  joinRoom(room: string, socket: Socket) {
    socket.join(room);
  }

  leaveRoom(room: string, socket: Socket) {
    socket.leave(room);
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

  getSocketFromId(userId: number) {
    return this.sockets[userId];
  }

}
