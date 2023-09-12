import { Injectable, Logger } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatgroupService } from '../chatgroup/chatgroup.service';
import { OfflineMessageService } from '../offline-message/offline-message.service';  
import { RoomManager } from './room-manager';
import { SocketManager } from './socket-mamager';
import { UserOfflineException } from '../internal-message/internal-message.service';
import { UnknownError } from './utils';
import { MessageTimeoutException } from './messenger';
import { ACKMsgType, Message, MessageType } from '../internal-message/entities/message-new.entity';

const logger = new Logger('SocketIoService')
@Injectable()
export class SocketIoService {
  constructor(
    private readonly authService: AuthService,
    private readonly chatGroupService: ChatgroupService,
    private readonly offlineMessageService: OfflineMessageService,
  ) { }
  
  roomManager = new RoomManager()
  socketManager = SocketManager.instance().init(async (msg: Message) => { //TODO use strategy pattern
    try {
      await this.safeSendMessage(msg, false)
      // update read count
      if (typeof msg.content != 'string' && msg.content.type === ACKMsgType.READ) { //clean this
        await this.offlineMessageService.updateReadCount(msg.content.ackMsgId, msg.receiverId)
      }
    } catch (e) {
      console.error(`Sending offline message ${msg.msgId} failed: `, e)
      throw e
    }
  });

  @WebSocketServer()
  io: Server;

  /**
   * send message to one user, this is safe to send to offline user
   * if it is offline, an error will be thrown
   * @param message 
   * @throws UserOfflineException
   * @throws MessageTimeoutException
   * @throws UnknownError
   */
  async sendMessageOrFail(message: Message, requireAck = true) {
    const messenger = this.socketManager.getMessenger(message.receiverId)

    if (messenger._socket.user) {
      message.senderId = messenger._socket.user?.id
    } else throw new UnknownError()


    if (messenger) {
      console.log(`Sending online message ${message.msgId}`)
      await messenger.sendMessageWithTimeout(message, 3000, requireAck);
    } else {
      throw new UserOfflineException();
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

  async safeSendMessage(msg: Message, requireAck = true){
    try {
      if(msg.type === MessageType.ACK) {
        requireAck = false
      }
      await this.sendMessageOrFail(msg, requireAck)
    } catch (e) {
      if (e instanceof UserOfflineException || e instanceof MessageTimeoutException) {
        console.log(`Sending online message ${msg.msgId} failed, convert to offline message`)
        await this.offlineMessageService.sendMessageOrFail(msg)
        console.log(`Sending offline message ${msg.msgId} success`)
      } else {
        console.error(`Sending online message ${msg.msgId} failed: `, e)
        throw e
      }
    }
  }

}
