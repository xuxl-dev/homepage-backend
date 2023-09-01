import { Socket } from "socket.io";
import { InternalMessage } from "../internal-message/entities/internal-message.entity";
import { ACKToken } from "./Tokens";
import { ACKMessage } from "../internal-message/entities/ack-message.entity";
import { backOff } from "src/utils/utils";

export class Messenger {
  private pendingMessages: Map<number, { resolve: (msg: ACKMessage) => void; reject: (error: Error) => void }> = new Map()
  _socket: Socket
  constructor(private socket: Socket) {
    this.socket.on(ACKToken, this.handleMessage.bind(this))
    this._socket = socket
  }

  private handleMessage(response: ACKMessage) {
    try {
      if (!response) {
        throw new Error('Invalid message received') //TODO: add more validation
      }
      const msgId = response.ackMsgId
      console.log('ACK Message received for msg: ', msgId)
      if (this.pendingMessages.has(msgId)) {
        const { resolve } = this.pendingMessages.get(msgId)
        this.pendingMessages.delete(msgId)
        resolve(response)
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
      this.socket.send(message)
    });
  }

  sendMessageBackoffWithTimeout(message: InternalMessage, timeout: number = 1000, maxRetries = 3, retryInterval = 100): Promise<ACKMessage> {
    return backOff(() => this.sendMessageWithTimeout(message, timeout), retryInterval, maxRetries)
  }
}
