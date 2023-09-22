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
export class RoomManager {
  private static _instance: RoomManager;

  public static instance() {
    if (!this._instance) {
      this._instance = new RoomManager();
    }
    return this._instance;
  }
  
  io: Server
  
  bindIoServer(server: Server) {
    this.io = server
  }

  private constructor() { }
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
    this.roomToSocketMap.delete(this.getRoom(roomId));
    this.rooms.delete(roomId);
  }

  public joinRoom(roomId: string, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      throw new Error('room does not exist');
    }
    this.roomToSocketMap.get(this.rooms.get(roomId)).add(socket.id);
  }

  public leaveRoom(roomId: string, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      throw new Error('room does not exist');
    }
    this.roomToSocketMap.get(this.rooms.get(roomId)).delete(socket.id);
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