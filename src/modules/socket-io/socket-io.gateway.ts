import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { SocketIoService } from './socket-io.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { messageToken } from './Tokens';
import { UserOfflineException } from '../internal-message/internal-message.service';
import { OfflineMessageService } from '../offline-message/offline-message.service';
import { ACKMsgType, Message } from '../internal-message/entities/message-new.entity';
import { CreateMessageDto } from '../internal-message/dto/create-message.dto';
import { QueryMessageDto } from '../offline-message/dto/queryMessage.dto';


const logger = new Logger('SocketIoGateway')

@WebSocketGateway(3001, {
  cors: true,
})
export class SocketIoGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server

  constructor(
    private readonly socketIoService: SocketIoService,
    private readonly offlineMessageService : OfflineMessageService
  ) {}

  afterInit(server) {}
  handleDisconnect(client) {
    logger.debug(`user disconnected: ${client.user.id}`)
    this.socketIoService.removeSocket(client.user.id)
  }

  async handleConnection(socket: Socket) {
    try {
      const user = await this.socketIoService.getUserFromSocket(socket);
      socket.emit('connected', user)
      socket.user = user
      this.socketIoService.addSocket(user.id, socket)
      logger.debug(`user connected: ${user.id}`)
      // try retrieve offline messages
      const offlineMessages = await this.offlineMessageService.retrive(user.id)
      console.log(`user ${user.id} has ${offlineMessages.length} offline messages, trying resending`)
      for (const msg of offlineMessages) {
        console.log(msg)
        this.socketIoService.safeSendMessage(msg)
      }
    } catch (e) {
      logger.debug(`invalid token: ${e}`)
      socket.emit('connected', 'invalid token')
      socket.disconnect() // invalid token
    }
  }

  @SubscribeMessage('events')
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    return {
      data
    };
  }

  @SubscribeMessage(messageToken)
  async handleMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const msg = Message.new(data, client.user.id)
    this.socketIoService.safeSendMessage(msg)
    return Message.ServerACK(msg, ACKMsgType.DELIVERED)
  }

  @SubscribeMessage('syncMessage')
  async syncMessage(
    @MessageBody() data: QueryMessageDto,
  ){
    const msg = await this.offlineMessageService.findOne(data.id)
    if (msg) {
      return msg
    } else {
      throw new Error('Message not found')
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    //TODO check if room exists
    //TODO check if user is in room
    //TODO check if user is allowed to join room
    console.log("Join room: " + data)
    this.socketIoService.joinRoom(data, client)
    return 'joined'
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    //TODO check if room exists
    //TODO check if user is in room
    //TODO check if user is allowed to leave room
    console.log("Leave room: " + data)
    this.socketIoService.leaveRoom(data, client)
    return 'left'
  }
}
