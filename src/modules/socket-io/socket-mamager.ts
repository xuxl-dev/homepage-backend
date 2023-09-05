import { Socket } from "socket.io";
import { Messenger } from "./messenger";
import { UserOfflineException } from "../internal-message/internal-message.service";
import { UnknownError } from "./utils";

/**
 * SocketManager
 * 
 * This class is responsible for managing all socket connections
 * mapping user id to socket id
 */
export class SocketManager {

  private static _instance: SocketManager = new SocketManager()

  public static instance() {
    return this._instance
  }

  private constructor() { }

  /**
   * Map from user id to socket id
   */
  private userToMessengerMap: Map<number, Messenger> = new Map()

  /**
   * Map from socket id to user id
   */

  private messengerToUserMap: Map<Messenger, number> = new Map()

  set(user: number, socket: Socket) {
    const messgener = new Messenger(socket)
    socket.messenger = messgener
    this.userToMessengerMap.set(user, messgener)
    this.messengerToUserMap.set(messgener, user)
  }

  delete(user: number) {
    const socket = this.userToMessengerMap.get(user)
    this.userToMessengerMap.delete(user)
    this.messengerToUserMap.delete(socket)
  }

  clear() {
    this.userToMessengerMap.clear()
    this.messengerToUserMap.clear()
  }

  getSocket(user: number) {
    return this.userToMessengerMap.get(user)._socket
  }

  getMessenger(user: number) {
    const ret = this.userToMessengerMap.get(user)
    if (ret) return ret
    else throw new UserOfflineException()
  }
}