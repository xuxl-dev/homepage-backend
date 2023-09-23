import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ChatgroupService } from '../chatgroup/chatgroup.service';


class Room {
  id: RoomId
  name: string;
  /**
   * Set of all sockets in this room, may contains invalid sockets
   */
  sockets: Set<Socket>;
  constructor(id: RoomId, name: string) {
    this.id = id;
    this.name = name;
    this.sockets = new Set<Socket>();
  }
}

type RoomId = number

// TODO: rewrite this class
@Injectable()
export class RoomManager {

  constructor(
    private readonly chatgroupService: ChatgroupService, //TODO: rewrite this class with chatgroupService
  ) { }

  io: Server

  bindIoServer(server: Server) {
    this.io = server
  }
  /**
   * room id to room
   */
  private rooms = new Map<RoomId, Room>();
  /**
   * Map from room to socket ids
   */
  private roomToSocketMap = new Map<Room, Set<string>>();

  public createRoom(roomId: RoomId, name: string) {
    if (this.rooms.has(roomId)) {
      throw new Error('room already exists');
    }
    const room = new Room(roomId, name)
    this.rooms.set(roomId, room);
    this.roomToSocketMap.set(room, new Set<string>());
  }

  public getRoom(roomId: RoomId) {
    return this.rooms.get(roomId);
  }

  public deleteRoom(roomId: RoomId) {
    // remove all sockets in this room
    this.roomToSocketMap.get(this.getRoom(roomId)).forEach(socketId => {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.leave(this.getRoomName(roomId));
      }
    })

    this.roomToSocketMap.delete(this.getRoom(roomId));
    this.rooms.delete(roomId);
  }

  public joinRoom(roomId: number, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      throw new Error('room does not exist');
    }
    this.roomToSocketMap.get(this.rooms.get(roomId)).add(socket.id);
    socket.join(this.getRoomName(roomId))
  }

  public leaveRoom(roomId: RoomId, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      throw new Error('room does not exist');
    }
    this.roomToSocketMap.get(this.rooms.get(roomId)).delete(socket.id);
    socket.leave(this.getRoomName(roomId))
  }

  public getRooms() {
    return this.rooms;
  }

  public getRoomToSocketMap() {
    return this.roomToSocketMap;
  }

  public getSocketIdsInRoom(roomId: RoomId) {
    return this.roomToSocketMap.get(this.getRoom(roomId));
  }

  public getRoomName(roomId: RoomId) {
    return this.getRoom(roomId).name;
  }
}