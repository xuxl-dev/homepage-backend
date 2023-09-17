import { Socket } from "socket.io";
import { messageToken } from "./Tokens";
import { backOff } from "src/utils/utils";
import { SocketManager } from "./socket-mamager";
import { EventEmitter } from "stream";
import { snowflake } from "./snowflake";
import { ACKMsgType, Message, MessageType, MsgId, isValidACK } from "../internal-message/entities/message-new.entity";

export class Messenger {
  private pendingMessages: Map<MsgId, { resolve: (msg: Message) => void; reject: (error: Error) => void }> = new Map()
  _socket: Socket
  socketManager: SocketManager = SocketManager.instance()

  constructor(socket: Socket) {
    this._socket = socket
    this._socket.on(messageToken, this.handleMessage.bind(this))
    // this.onAckMsgCallback = onMsgFail
  }

  /**
   * Alice --- Message   --> server                --> Bob
   *
   * Alice <-- server    <-- ACKMessage(delivered) --- Bob
   *
   * Alice <-- server    <-- ACKMessage(read)      --- Bob
   * 
   * @param response 
   */
  private async handleMessage(response: Message) {
    try {
      if (!isValidACK(response)) {
        return
      }

      let { receiverId, content } = response
      content = JSON.parse(content as string)
      const { ackMsgId, type } = content as any
      console.log(`ACK(${ackMsgId}) to ${receiverId} type ${ACKMsgType[type]}`)

      if (this.pendingMessages.has(ackMsgId)) {
        const { resolve } = this.pendingMessages.get(ackMsgId)
        this.pendingMessages.delete(ackMsgId)
        resolve(response)
      }
    } catch (error) {
      console.error('Error while handling message:', error)
    }
  }

  sendMessageWithTimeout(message: Message, timeout: number = 3000, requireAck = true): Promise<Message> {
    // cast a message, without ack
    if (!requireAck) {
      this._socket.emit(messageToken, message)
      return Promise.resolve(null)
    }

    // send with timeout, if timeout, reject
    return new Promise<Message>((resolve, reject) => {
      setTimeout(() => {
        this.pendingMessages.delete(message.msgId)
        reject(new MessageTimeoutException())
      }, timeout) // No need to clear timeout, it won't reject if it's already resolved

      this.pendingMessages.set(message.msgId, { resolve, reject })
      this._socket.emit(messageToken, message)
    });
  }

  sendMessageBackoffWithTimeout(message: Message, timeout: number = 1000, maxRetries = 3, retryInterval = 100): Promise<Message> {
    return backOff(() => this.sendMessageWithTimeout(message, timeout), retryInterval, maxRetries)
  }
}

export class MessageTimeoutException extends Error {
  constructor() {
    super('Message timed out')
  }
}
