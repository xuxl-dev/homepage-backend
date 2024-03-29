import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { SocketIoService } from './socket-io.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { messageToken } from './Tokens';
import { CreateMessageDto } from '../internal-message/dto/create-message.dto';
import { QueryMessageDto } from '../offline-message/dto/queryMessage.dto';
import { RetriveMessageDto } from '../offline-message/dto/retriveMessage.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Dispatcher } from './dispatcher';
import {
  ACKMsgType,
  Message,
} from '../internal-message/schemas/message.schema';
import { JoinRoomDto } from './dto/join-room.dto';
import { UsermetaService } from '../usermeta/usermeta.service';

const logger = new Logger('SocketIoGateway');

@WebSocketGateway(3001, {
  cors: true,
})
export class SocketIoGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(
    @InjectQueue('message')
    private readonly messageQueue: Queue<Message>,
    private readonly socketIoService: SocketIoService,
    private readonly dispatcher: Dispatcher, // only refered to bind Io server
    private readonly usermetaService : UsermetaService
  ) {}

  afterInit(server: Server) {
    this.socketIoService.bindIoServer(server);
    this.dispatcher.bindIoServer(server);
  }

  handleDisconnect(client: Socket) {
    if (!client.user) return
    if (!client.user.id) return
    logger.debug(`user disconnected: `, client.user.id)
    this.socketIoService.removeSocket(client.user.id)
    this.usermetaService.offline(client.user.id)
  }

  async handleConnection(socket: Socket) {
    try {
      const user = await this.socketIoService.getUserFromSocket(socket);
      socket.emit('connected', user);
      socket.user = user;
      await this.socketIoService.addSocket(user.id, socket);
      logger.debug(`user connected: ${user.id}`);
      this.usermetaService.online(user.id)
    } catch (e) {
      logger.debug(`invalid token: ${e}`);
      socket.emit('connected', 'invalid token');
      socket.disconnect(); // invalid token
    }
  }

  /**
   * for all message, forward if possible, track acks, if fail, fall back to offline message
   * but ack needs no ack to it
   * @param data
   * @param client
   * @returns
   */
  @SubscribeMessage(messageToken)
  async handleMessage(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const msg = Message.new(data, client.user.id);
    await this.messageQueue.add('send', msg);
    return Message.ServerACK(msg, ACKMsgType.DELIVERED);
  }

  @SubscribeMessage('syncMessage')
  async syncMessage(
    @MessageBody() data: QueryMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.socketIoService.syncMessage(data, client.user.id);
  }

  @SubscribeMessage('retrive')
  async retriveMessage(
    @MessageBody() data: RetriveMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.socketIoService.retriveAndSync(data, client.user.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: JoinRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    //TODO check if room exists
    //TODO check if user is in room
    //TODO check if user is allowed to join room
    console.log('Join room: ' + data);
    this.socketIoService.joinRoom(data, client);
    return {
      room: data,
    };
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    //TODO check if room exists
    //TODO check if user is in room
    //TODO check if user is allowed to leave room
    console.log('Leave room: ' + data);
    this.socketIoService.leaveRoom(data, client);
    return 'left';
  }
}
