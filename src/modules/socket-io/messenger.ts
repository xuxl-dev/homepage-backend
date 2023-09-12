import { Socket } from "socket.io";
import { ACKToken, messageToken } from "./Tokens";
import { backOff } from "src/utils/utils";
import { SocketManager } from "./socket-mamager";
import { EventEmitter } from "stream";
import { snowflake } from "./snowflake";
import { ACKMsgType, Message, MessageType, MsgId } from "../internal-message/entities/message-new.entity";

export class Messenger {
  private pendingMessages: Map<MsgId, { resolve: (msg: Message) => void; reject: (error: Error) => void }> = new Map()
  _socket: Socket
  socketManager: SocketManager = SocketManager.instance()
  onAckMsgFailCallback: (msg: Message) => Promise<void>

  constructor(socket: Socket, onMsgFail: (msg: Message) => Promise<void>) {
    this._socket = socket
    this._socket.on(ACKToken, this.handleMessage.bind(this))
    this.onAckMsgFailCallback = onMsgFail
  }

  /**
   * Alice --- InternalMessage  --> server                --> Bob
   * 
   * Alice <-- server           <-- ACKMessage(delivered) --- Bob
   * 
   * Alice <-- server           <-- ACKMessage(read)      --- Bob
   * @param response 
   */
  private async handleMessage(response: Message) {
    try {
      if (!response) {
        throw new Error('Invalid message received') //TODO: add more validation
      }
      response.msgId = snowflake.nextId().toString()
      response.senderId = this._socket.user?.id
      response.sentAt = new Date()
      const { msgId, senderId, receiverId, type: _type, content } = response
      console.log('content:', content)
      const { ackMsgId, type } = content as unknown as { ackMsgId: MsgId, type: ACKMsgType }
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
      const sender = this.socketManager.getSocket(receiverId);
      if (sender) {
        sender.emit('ack', response);
      } else {
        // send offline ack
        console.log('User is offline, sending offline ack')
        await this.onAckMsgFailCallback(response)
      }
    } catch (error) {
      console.error('Error while handling message:', error)
    }
  }

  sendMessageWithTimeout(message: Message, timeout: number = 3000): Promise<Message> {
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
