import { Socket } from "socket.io";

export class RoomManager {
  /**
   * Set of all room ids
   */
  private rooms = new Set<string>();
  /**
   * Map from room id to socket ids
   */
  private roomToSocketMap = new Map<string, Set<string>>();

  public createRoom(roomId: string) {
    if (this.rooms.has(roomId)) {
      throw new Error('room already exists');
    }
    this.rooms.add(roomId);
    this.roomToSocketMap.set(roomId, new Set<string>());
  }

  public getRoom(roomId: string) {
    return this.roomToSocketMap.get(roomId);
  }

  public deleteRoom(roomId: string) {
    this.rooms.delete(roomId);
    this.roomToSocketMap.delete(roomId);
  }

  public joinRoom(roomId: string, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      throw new Error('room does not exist');
    }
    this.roomToSocketMap.get(roomId).add(socket.id);
  }

  public leaveRoom(roomId: string, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      throw new Error('room does not exist');
    }
    this.roomToSocketMap.get(roomId).delete(socket.id);
  }

  /**
   * You shall not call this
   * @param socket 
   * @returns 
   */
  public getRoomsOfSocket(socket: Socket) {
    const rooms = new Set<string>();
    for (const [roomId, socketIds] of this.roomToSocketMap) {
      if (socketIds.has(socket.id)) {
        rooms.add(roomId);
      }
    }
    return rooms;
  }

  public getRooms() {
    return this.rooms;
  }

  public getRoomToSocketMap() {
    return this.roomToSocketMap;
  }

  public getSocketIdsInRoom(roomId: string) {
    return this.roomToSocketMap.get(roomId);
  }
}