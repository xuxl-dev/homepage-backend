import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { IncomingMessage } from 'http';

@WebSocketGateway(17030, {
  transports: ['websocket']
})
export class SocioGateway {

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    console.log(request.url);
  }

  handleDisconnect(client: WebSocket) {
    console.log(client);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
