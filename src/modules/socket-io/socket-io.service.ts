import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatgroupService } from '../chatgroup/chatgroup.service';
import { OfflineMessageService } from '../offline-message/offline-message.service';  
import { BrocastMessage, InternalMessage, MultiCastMessage } from '../internal-message/entities/internal-message.entity';

import { RoomManager } from './room-manager';
import { SocketManager } from './socket-mamager';
import { UserOfflineException } from '../internal-message/internal-message.service';
import { User } from '../user/entities/user.entity';
import { UnknownError } from './utils';

const logger = new Logger('SocketIoService')
@Injectable()
export class SocketIoService {
  constructor(
    private readonly authService: AuthService,
    private readonly chatGroupService: ChatgroupService,
    private readonly offlineMessageService: OfflineMessageService,
  ) { }
  
  roomManager = new RoomManager()
  socketManager = SocketManager.instance();

  @WebSocketServer()
  io: Server;

  /**
   * send message to one user, this is safe to send to offline user
   * if it is offline, an error will be thrown
   * @param message 
   */
  async sendMessageOrThrow(message: InternalMessage) {
    const messenger = this.socketManager.getMessenger(message.receiverId)

    if (messenger._socket.user) {
      message.senderId = messenger._socket.user?.id
    } else throw new UnknownError()


    if (messenger) {
      await messenger.sendMessageWithTimeout(message, 3000);
    } else {
      throw new UserOfflineException();
    }

  }

  /**
   * send archived offline message to a newly connected user
   * @param user 
   */
  async syncOfflineMsg(user: User) {
    const messenger = this.socketManager.getMessenger(user.id);
    if (messenger) {
      const offlineMsgs = await this.offlineMessageService.retrive(user.id);
    } else {
      throw new Error('unknown error');
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

  addSocket(id: number, socket: Socket) {
    this.socketManager.set(id, socket)
  }

  removeSocket(id: number) {
    this.socketManager.delete(id);
  }

}
