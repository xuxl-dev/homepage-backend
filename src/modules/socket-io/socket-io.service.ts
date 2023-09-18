import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatgroupService } from '../chatgroup/chatgroup.service';
import { RoomManager } from './room-manager';
import { SocketManager } from './socket-mamager';
import { OfflineMessageService } from '../offline-message/offline-message.service';
import { Dispatcher } from './dispatcher';
import { RetriveMessageDto } from '../offline-message/dto/retriveMessage.dto';
import { QueryMessageDto } from '../offline-message/dto/queryMessage.dto';

const logger = new Logger('SocketIoService')
@Injectable()
export class SocketIoService {
  constructor(
    private readonly authService: AuthService,
    private readonly chatGroupService: ChatgroupService,
    private readonly offlineMessageService: OfflineMessageService,
    private readonly dispatcher: Dispatcher,
  ) { }

  roomManager = new RoomManager()

  @WebSocketServer()
  io: Server;

  async retriveAndSync(data: RetriveMessageDto, clientId: number) {
    const offlineMessages = await this.offlineMessageService.retrive(
      clientId,
      data.afterDate,
      {
        page: data.page,
        pageSize: data.pageSize
      }
    )
    for (const msg of offlineMessages) {
      this.dispatcher.dispatch(msg)
    }
    return {
      messageCount: offlineMessages.length
    }
  }

  async syncMessage(data: QueryMessageDto, clientId: number) {
    const msg = await this.offlineMessageService.findOne(data.id)
    if (msg && msg.receiverId === clientId) {
      return msg
    } else {
      throw new Error('Message not found or not belong to you')
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
    return socket.handshake.headers.authorization || socket.handshake.auth.token;
  }

  async getUserFromSocket(socket: Socket) {
    return await this.authService.getUserByToken(this.getJwtTokenFromSocket(socket));
  }

  socketManager = SocketManager.instance()

  addSocket(id: number, socket: Socket) {
    // if already exist, disconnect the old one
    const oldSocket = this.socketManager.getSocket(id)
    if (oldSocket) {
      oldSocket.disconnect()
    }
    this.socketManager.set(id, socket)
  }

  removeSocket(id: number) {
    this.socketManager.delete(id);
  }
}
