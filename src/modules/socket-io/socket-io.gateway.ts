import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { SocketIoService } from './socket-io.service';
import { Server, Socket } from 'socket.io';
import { InternalMessage } from '../internal-message/entities/internal-message.entity';
import { Logger } from '@nestjs/common';
import { ACKMessage, ACKMessageType } from '../internal-message/entities/ack-message.entity';
import { messageToken } from './Tokens';
import { UserOfflineException } from '../internal-message/internal-message.service';
import { OfflineMessage } from '../offline-message/entities/offline-message.entity';
import { snowflake } from './snowflake';
import { OfflineMessageService } from '../offline-message/offline-message.service';
import { CreateInternalMessageDto } from '../internal-message/dto/create-internal-message.dto';


const logger = new Logger('SocketIoGateway')

@WebSocketGateway(3001, {
  cors: true,
})
export class SocketIoGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketIoService: SocketIoService,
    private readonly offlineMessageService : OfflineMessageService
  ) {}

  afterInit(server) {}
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
  async handleMessage(
    @MessageBody() data: CreateInternalMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const msg = new InternalMessage(data).setSender(client.user.id)
    try {
      logger.log("Try send message: ", data);
      await this.socketIoService.sendMessageOrThrow(msg);
      console.log("Message sent");
    } catch (e) {
      if (e instanceof UserOfflineException) {
        logger.log("Failed to send online message, trying offline msg ");
        // convert into offline message
        await this.offlineMessageService.sendMessageOrFail(msg);
        logger.log("Offline message sent");
      } else {
        logger.error(`Unknown error when sending online message: ${e}`);
      }
    }
    
    return new ACKMessage(
      msg.msgId,
      msg.senderId,
      ACKMessageType.SERVER_RECEIVED
    )
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
