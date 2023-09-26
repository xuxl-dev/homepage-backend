import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatgroupService } from '../chatgroup/chatgroup.service';
import { RoomManager } from './room-manager';
import { SocketManager } from './socket-mamager';
import { OfflineMessageService } from '../offline-message/offline-message.service';
import { RetriveMessageDto } from '../offline-message/dto/retriveMessage.dto';
import { QueryMessageDto } from '../offline-message/dto/queryMessage.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { JoinRoomDto } from './dto/join-room.dto';
import { UserService } from '../user/user.service';
import { Message, MsgId } from '../internal-message/schemas/message.schema';


const logger = new Logger('SocketIoService')
@Injectable()
export class SocketIoService {
  constructor(
    @InjectQueue('message')
    private readonly messageQueue: Queue<Message>,
    private readonly authService: AuthService,
    private readonly chatGroupService: ChatgroupService,
    private readonly userService: UserService,
    private readonly offlineMessageService: OfflineMessageService,
    private readonly roomManager: RoomManager,
    private readonly socketManager: SocketManager,
  ) { }

  io: Server

  bindIoServer(server: Server) {
    this.io = server
    this.roomManager.bindIoServer(server)
  }

  async retriveAndSync(data: RetriveMessageDto, clientId: number) {
    let tot = 0
    // forward one to one messages to client
    const toClientOfflineMessages = await this.offlineMessageService.retrive(
      clientId,
      data.afterDate,
      {
        page: data.page,
        pageSize: data.pageSize
      }
    )
    tot += toClientOfflineMessages.length
    for (const msg of toClientOfflineMessages) {
      this.enqueueMessage(msg) // no wait
    }

    // forward group messages to client
    const groups = await (await this.userService.findOne(clientId)).joinedChatGroups

    for (const group of groups) {
      const toGroupMessages = await this.offlineMessageService.retrive(
        group.id,
        data.afterDate,
        {
          page: data.page,
          pageSize: data.pageSize
        }
      )
      tot += toGroupMessages.length
      for (const msg of toGroupMessages) {
        // rewrite groupId to clientId
        msg.receiverId = clientId
        this.enqueueMessage(msg)
      }
    }

    return {
      messageNoTotal: tot,
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

  joinRoom(room: JoinRoomDto, socket: Socket) {
    this.roomManager.joinRoom(room.roomId, socket);
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

  enqueueMessage(message: Message) {
    this.messageQueue.add('send', message)
  }

  withdrawMessage(messageId: MsgId) {
    //TODO remove from queue: this may not be necessary,
    // the time in queue is very short

    // remove from db
    this.offlineMessageService.delete(messageId)
  }
}
