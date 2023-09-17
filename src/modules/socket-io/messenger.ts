import { Socket } from "socket.io";
import { messageToken } from "./Tokens";
import { backOff } from "src/utils/utils";
import { SocketManager } from "./socket-mamager";
import { EventEmitter } from "stream";
import { snowflake } from "./snowflake";
import { ACKMsgType, Message, MessageType, MsgId } from "../internal-message/entities/message-new.entity";

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
   * @param response 
   */
  private async handleMessage(response: Message) {
    try {
      if (!response) {
        throw new Error('Invalid message received') //TODO: add more validation
      }
      if (response.type !== MessageType.ACK) {
        return
      }
      response.msgId = snowflake.nextId().toString()
      response.senderId = this._socket.user?.id
      response.sentAt = new Date()
      let { msgId, senderId, receiverId, type: _type, content } = response
      if (typeof content === 'string') {
        content = JSON.parse(content)
      }
      const { ackMsgId, type } = content as unknown as { ackMsgId: MsgId, type: number }
      console.log(
        'ACK Message received for msg: ', ackMsgId, 
        'from ', senderId, //FIXME this is undefined, fix it
        'to', receiverId, 
        'type', ACKMsgType[type])
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
    if (!requireAck) {
      this._socket.emit(messageToken, message)
      return Promise.resolve(null)
    }
    return new Promise<Message>((resolve, reject) => {
      setTimeout(() => {
        this.pendingMessages.delete(message.msgId)
        reject(new MessageTimeoutException())
      }, timeout)

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
