import { Socket } from "socket.io";
import { messageToken } from "./Tokens";
import { Message } from "../internal-message/schemas/message.schema";

export class Messenger {
  _socket: Socket

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
