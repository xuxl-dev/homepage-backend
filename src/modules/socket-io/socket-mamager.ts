import { Socket } from "socket.io";

/**
 * SocketManager
 * 
 * This class is responsible for managing all socket connections
 * mapping user id to socket id
 */
export class SocketManager {

  private static _instance: SocketManager = new SocketManager();

  public static instance() {
    return this._instance;
  }

  private constructor() { }

  /**
   * Map from user id to socket id
   */
  private userToSocketMap : Map<number, Socket> = new Map();

  /**
   * Map from socket id to user id
   */

  private socketToUserMap : Map<Socket, number> = new Map();

  set(user: number, socket: Socket) {
    this.userToSocketMap.set(user, socket);
    this.socketToUserMap.set(socket, user);
  }

  delete(user: number) {
    const socket = this.userToSocketMap.get(user);
    this.userToSocketMap.delete(user);
    this.socketToUserMap.delete(socket);
  }

  clear() {
    this.userToSocketMap.clear();
    this.socketToUserMap.clear();
  }

  getSocket(user: number) {
    return this.userToSocketMap.get(user);
  }

  getUser(socket: Socket) {
    return this.socketToUserMap.get(socket);
  }
}