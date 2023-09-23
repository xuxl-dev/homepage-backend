import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";


class Room {
  name: string;
  /**
   * Set of all sockets in this room, may contains invalid sockets
   */
  sockets: Set<Socket>;
  constructor(name: string) {
    this.name = name;
    this.sockets = new Set<Socket>();
  }
}
// TODO: rewrite this class
@Injectable()
export class RoomManager {
 
  io: Server
  
  bindIoServer(server: Server) {
    this.io = server
  }
  /**
   * room id to room
   */
  private rooms = new Map<string, Room>();
  /**
   * Map from room to socket ids
   */
  private roomToSocketMap = new Map<Room, Set<string>>();

  public createRoom(roomId: string) {
    if (this.rooms.has(roomId)) {
      throw new Error('room already exists');
    }
    const room = new Room(roomId)
    this.rooms.set(roomId, room);
    this.roomToSocketMap.set(room, new Set<string>());
  }

  public getRoom(roomId: string) {
    return this.rooms.get(roomId);
  }

  public deleteRoom(roomId: string) {
    // remove all sockets in this room
    this.roomToSocketMap.get(this.getRoom(roomId)).forEach(socketId => {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.leave(roomId);
      }
    })

    this.roomToSocketMap.delete(this.getRoom(roomId));
    this.rooms.delete(roomId);
  }

  public joinRoom(roomId: string, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      throw new Error('room does not exist');
    }
    this.roomToSocketMap.get(this.rooms.get(roomId)).add(socket.id);
    socket.join(roomId)
  }

  public leaveRoom(roomId: string, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      throw new Error('room does not exist');
    }
    this.roomToSocketMap.get(this.rooms.get(roomId)).delete(socket.id);
    socket.leave(roomId)
  }

  public getRooms() {
    return this.rooms;
  }

  public getRoomToSocketMap() {
    return this.roomToSocketMap;
  }

  public getSocketIdsInRoom(roomId: string) {
    return this.roomToSocketMap.get(this.getRoom(roomId));
  }
}