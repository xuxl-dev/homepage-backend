import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { SocketIoService } from './socket-io.service';
import { Server, Socket } from 'socket.io';
import { InternalMessage } from '../internal-message/entities/internal-message.entity';

@WebSocketGateway(3001, {
  cors: true,
  transports: ['websocket']
})
export class SocketIoGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketIoService: SocketIoService,
  ) {}

  afterInit(server: any) {
  }
  handleDisconnect(client: any) {
  }

  async handleConnection(socket: Socket) {
    try {
      const user = await this.socketIoService.getUserFromSocket(socket);
      socket.emit('connected', user);
    } catch (e) {
      console.log(`invalid token: ${e}`);
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

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: InternalMessage,
    @ConnectedSocket() client: Socket,
  ): string {
    console.log("Message received: " + JSON.stringify(data));
    this.socketIoService.create(data);
    return 'received';
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

}
