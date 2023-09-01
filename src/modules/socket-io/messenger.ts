import { Socket } from "socket.io";
import { InternalMessage, MsgId } from "../internal-message/entities/internal-message.entity";
import { ACKToken, messageToken } from "./Tokens";
import { ACKMessage, ACKMessageType } from "../internal-message/entities/ack-message.entity";
import { backOff } from "src/utils/utils";
import { SocketManager } from "./socket-mamager";

export class Messenger {
  private pendingMessages: Map<MsgId, { resolve: (msg: ACKMessage) => void; reject: (error: Error) => void }> = new Map()
  _socket: Socket
  socketManager: SocketManager = SocketManager.instance()
  constructor(private socket: Socket) {
    this.socket.on(ACKToken, this.handleMessage.bind(this))
    this._socket = socket
  }

  /**
   * Alice --- InternalMessage  --> server                --> Bob
   * 
   * Alice <-- server           <-- ACKMessage(delivered) --- Bob
   * 
   * Alice <-- server           <-- ACKMessage(read)      --- Bob
   * @param response 
   */
  private handleMessage(response: ACKMessage) {
    try {
      if (!response) {
        throw new Error('Invalid message received') //TODO: add more validation
      }
      const msgId = response.ackMsgId
      console.log('ACK Message received for msg: ', msgId, 'from ', response.senderId, 'to', response.receiverId)
      if (this.pendingMessages.has(msgId)) {
        const { resolve } = this.pendingMessages.get(msgId)
        this.pendingMessages.delete(msgId)
        resolve(response)
      }
      const sender = this.socketManager.getSocket(response.receiverId);
      if (sender) {
        sender.emit('ack', response);
      }
    } catch (error) {
      console.error('Error while handling message:', error)
    }
  }

  sendMessageWithTimeout(message: InternalMessage, timeout: number = 1000): Promise<ACKMessage> {
    return new Promise<ACKMessage>((resolve, reject) => {
      setTimeout(() => {
        this.pendingMessages.delete(message.msgId)
        reject(new Error('Message timed out'))
      }, timeout)

      this.pendingMessages.set(message.msgId, { resolve, reject })
      this.socket.emit(messageToken, message)
    });
  }

  sendMessageBackoffWithTimeout(message: InternalMessage, timeout: number = 1000, maxRetries = 3, retryInterval = 100): Promise<ACKMessage> {
    return backOff(() => this.sendMessageWithTimeout(message, timeout), retryInterval, maxRetries)
  }
}
