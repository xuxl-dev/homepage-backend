import { Socket } from "socket.io";
import { messageToken } from "./Tokens";
import { SocketManager } from "./socket-mamager";
import { Message } from "../internal-message/entities/message-new.entity";

export class Messenger {
  _socket: Socket
  socketManager: SocketManager = SocketManager.instance()

  constructor(socket: Socket) {
    this._socket = socket
  }

  /**
   * this is a fire and forget method, no ack is required
   * @param message 
   */
  castMessage(message: Message) {
    this._socket.emit(messageToken, message)
  }
}

export class MessageTimeoutException extends Error {
  constructor() {
    super('Message timed out')
  }
}
