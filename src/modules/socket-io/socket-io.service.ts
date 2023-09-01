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
import { sendMessageOrThrow as backOffSendMsgOrThrow } from './utils';
import { OfflineMessageService } from '../offline-message/offline-message.service';
const logger = new Logger('SocketIoService')
@Injectable()
export class SocketIoService {

  roomManager = new RoomManager()
  socketManager = SocketManager.instance();

  constructor(
    private readonly authService: AuthService,
    private readonly chatGroupService: ChatgroupService,
  ) { }

  @WebSocketServer()
  io: Server;

  /**
   * send message to one user, this is safe to send to offline user
   * if it is offline, an error will be thrown
   * @param message 
   */
  async sendMessageOrThrow(message: InternalMessage) {
    // const socket = this.socketManager.getSocket(message.receiverId);
    // if (socket) {
    //   try {
    //     await backOffSendMsgOrThrow(socket, message);
    //   } catch (e) {
    //     throw e
    //   }
    // } else {
    //   throw new Error('socket not found');
    // }
    const messenger = this.socketManager.getMessenger(message.receiverId);
    if (messenger) {
      messenger.sendMessageWithTimeout(message, 3000);
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
