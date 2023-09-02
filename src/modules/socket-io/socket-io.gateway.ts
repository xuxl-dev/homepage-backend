import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { SocketIoService } from './socket-io.service';
import { Server, Socket } from 'socket.io';
import { InternalMessage } from '../internal-message/entities/internal-message.entity';
import { Logger } from '@nestjs/common';
import { ACKMessage, ACKMessageType } from '../internal-message/entities/ack-message.entity';
import { messageToken } from './Tokens';
import { Snowflake } from './utils';
import { CreateInternalMessageDto } from '../internal-message/dto/create-internal-message.dto';
import { snowflake } from './snowflake';

const logger = new Logger('SocketIoGateway')

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
    console.log("Connection received");
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
    @MessageBody() data: CreateInternalMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = new InternalMessage(data);
    console.log("Message sent: " + JSON.stringify(message));
    this.socketIoService.sendMessageOrThrow(message);
    return new ACKMessage(
      message.msgId,
      -1,
      message.receiverId,
      ACKMessageType.SERVER_RECEIVED
    );
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
