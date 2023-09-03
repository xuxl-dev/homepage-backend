import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { SocketIoService } from './socket-io.service';
import { Server, Socket } from 'socket.io';
import { InternalMessage } from '../internal-message/entities/internal-message.entity';
import { Logger } from '@nestjs/common';
import { ACKMessage, ACKMessageType } from '../internal-message/entities/ack-message.entity';
import { messageToken } from './Tokens';
import { Snowflake } from './utils';

const logger = new Logger('SocketIoGateway')

const workerId = 1; // 机器 ID
const dataCenterId = 1; // 数据中心 ID
const snowflake = new Snowflake(workerId, dataCenterId);

@WebSocketGateway(3001, {
  cors: true,
})
export class SocketIoGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketIoService: SocketIoService,
  ) {}

  afterInit(server) {
  }
  handleDisconnect(client) {
    logger.debug(`user disconnected: ${client.user.id}`);
    this.socketIoService.removeSocket(client.user.id);
  }

  async handleConnection(socket: Socket) {
    try {
      const user = await this.socketIoService.getUserFromSocket(socket);
      socket.emit('connected', user, (val: any) => {
        logger.debug(`connected ack received: ${val}`);
      });
      socket.user = user
      this.socketIoService.addSocket(user.id, socket);
      logger.debug(`user connected: ${user.id}`);
    } catch (e) {
      logger.debug(`invalid token: ${e}`);
      socket.emit('connected', 'invalid token');
      socket.disconnect(); // invalid token
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
  handleMessage(
    @MessageBody() data: InternalMessage,
    @ConnectedSocket() client: Socket,
  ) {
    console.log("Message sent: " + JSON.stringify(data));
    this.socketIoService.sendMessageOrThrow(data);
    return new ACKMessage(
      snowflake.nextId(),
      data.msgId,
      -1,
      data.receiverId,
      ACKMessageType.SERVER_RECEIVED
    );
  }

  @SubscribeMessage('ackMessage')
  handleAckMessage(
    @MessageBody() data: ACKMessage,
    @ConnectedSocket() client: Socket){
    console.log("Message ack: " + JSON.stringify(data));
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    //TODO check if room exists
    //TODO check if user is in room
    //TODO check if user is allowed to join room
    console.log("Join room: " + data);
    this.socketIoService.joinRoom(data, client);
    return 'joined';
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    //TODO check if room exists
    //TODO check if user is in room
    //TODO check if user is allowed to leave room
    console.log("Leave room: " + data);
    this.socketIoService.leaveRoom(data, client);
    return 'left';
  }
}
