import { Injectable, Logger } from '@nestjs/common';
import { CreateSocketIoDto } from './dto/create-socket-io.dto';
import { UpdateSocketIoDto } from './dto/update-socket-io.dto';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatgroupService } from '../chatgroup/chatgroup.service';
import { BrocastMessage, InternalMessage, MultiCastMessage } from '../internal-message/entities/internal-message.entity';
import { RoomManager } from './room-manager';
import { SocketManager } from './socket-mamager';
import { sendMessageOrThrow } from './utils';
import { OfflineMessageService } from '../offline-message/offline-message.service';
const logger = new Logger('SocketIoService')
@Injectable()
export class SocketIoService {

  roomManager = new RoomManager()
  socketManager = SocketManager.instance();

  constructor(
    private readonly authService: AuthService,
    private readonly chatGroupService: ChatgroupService,
    private readonly offlineMessageService: OfflineMessageService,
  ) { }

  @WebSocketServer()
  io: Server;
  
  /**
   * send message to one user
   * @param message 
   */
  sendMessage(message: InternalMessage) {
    const socket = this.socketManager.getSocket(message.receiverId);
    if (socket) {
      try {
        sendMessageOrThrow(socket, message);
      } catch (e) {
        // convert to offline message
        // TODO implement offline message
        try {
          this.offlineMessageService.sendMessageOrThrow(message);
        } catch (e) {
          // this shall never happen
          // but if it does, we have a problem
          logger.fatal(`failed to send message: ${e}`);
          throw new Error('failed to send message');
        }
      }
    } else {
      throw new Error('socket not found');
    }
  }

  createRoom(createSocketIoDto: CreateRoomDto) {
    this.chatGroupService.create(createSocketIoDto);
  }

  joinRoom(room: string, socket: Socket) {
    this.roomManager.joinRoom(room, socket);
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
    return await this.authService.getUserByToken(this.getJwtTokenFromSocket(socket));
  }

}
