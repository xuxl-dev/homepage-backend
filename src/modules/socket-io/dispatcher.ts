import { Injectable } from "@nestjs/common";
import { MessageFlag, MsgId } from '../internal-message/entities/message-new.entity';
import { OfflineMessageService } from "../offline-message/offline-message.service";
import { RoomNotExistException, UserOfflineException } from "../internal-message/internal-message.service";
import { SocketManager } from "./socket-mamager";
import { Message, isFlagSet, isValidACK, parseACK } from "../internal-message/schemas/message.schema";
import { RoomManager } from "./room-manager";
import { Server } from "socket.io";

interface ProcessorLayer {
  next: (msg: Message) => Promise<Message>; // next layer
  process: (msg: Message) => Promise<Message>;
  ctx: DispatcherCtx;
}

class ProcessorBase implements ProcessorLayer {
  ctx: DispatcherCtx;
  process: (msg: Message) => Promise<Message> = async (msg: Message) => {
    throw new Error("Method not implemented.");
  }
  next: (msg: Message) => Promise<Message>;
}

// do nothing, just pass the message to next layer
class BeginProcessorLayer extends ProcessorBase {
  process: (msg: Message) => Promise<Message> = async (msg: Message) => {
    return this.next(msg);
  }
}

class EndProcessorLayer extends ProcessorBase {
  process: (msg: Message) => Promise<Message> = async (msg: Message) => {
    return msg // do nothing
  }
}

/**
 * this layer times all messages, if ack is not received in time, fall back to offline message
 */
class ACKCountingLayer extends ProcessorBase {
  static timeout = 15 * 1000
  private pendingMessages: Map<MsgId, () => void> = new Map()
  process: (msg: Message) => Promise<Message> = async (msg: Message) => {
    if (isValidACK(msg)) {
      const { ackMsgId } = parseACK(msg)
      if (this.pendingMessages.has(ackMsgId)) { // at least one ack means the message is delivered successfully
        this.pendingMessages.get(ackMsgId)()
        this.pendingMessages.delete(ackMsgId)
      }
    } else {
      if (isFlagSet(msg, MessageFlag.DO_NOT_STORE) // just let message fail, don't store it
        || isFlagSet(msg, MessageFlag.BROADCAST)  // broadcast message will always be stored, but no need ack from anyone
      ) {
        return this.next(msg)
      }

      const messageFail = setTimeout(() => {
        console.log(`online message ${msg.msgId} failed, fall back to offline message`)
        this.pendingMessages.delete(msg.msgId)
        this.ctx.offlineMessageService.sendMessageOrFail(msg).catch(e => {
          console.error(e)
        })
      }, ACKCountingLayer.timeout)

      this.pendingMessages.set(msg.msgId, () => {
        clearTimeout(messageFail)
        this.pendingMessages.delete(msg.msgId)
      })
    }
    return this.next(msg);
  }
}

class ForwardingLayer extends ProcessorBase {
  process: (msg: Message) => Promise<Message> = async (msg: Message) => {
    // try send online message, don't care about the result, fail is processed in ack counting layer
    this.ctx.dispatcher.castMessage(msg).catch(e => {
      if (e instanceof UserOfflineException) {
        // this is not an error, just a normal case
        // ignore this, if this message needs to be stored, it will be stored in ack counting layer
      } else {
        console.error(e)
      }
    })
    return this.next(msg);
  }
}

type DispatcherCtx = {
  offlineMessageService: OfflineMessageService,
  dispatcher: Dispatcher
}

/**
 * Dispatcher
 * This class handles all incoming messages, and track the acks
 * CoR pattern is used here
 */
@Injectable()
export class Dispatcher {
  ctx: DispatcherCtx
  io: Server

  bindIoServer(server: Server) {
    this.io = server
  }

  constructor(
    private readonly offlineMessageService: OfflineMessageService,
    private readonly roomManager: RoomManager,
    private readonly socketManager: SocketManager,
  ) {
    this.ctx = {
      offlineMessageService,
      dispatcher: this
    }
    this.addProcessors([
      new BeginProcessorLayer(),
      new ACKCountingLayer(),
      new ForwardingLayer(),
      new EndProcessorLayer(),
    ])
  }


  private processors: ProcessorLayer[] = [];

  public addProcessors(processor: ProcessorLayer[]) {
    processor.forEach(p => p.ctx = this.ctx)
    this.processors = this.processors.concat(processor);
    this.setNexts();
  }

  /**
   * @param msg 
   */
  public dispatch(msg: Message) {
    return this.processors[0].process(msg);
  }

  // set nexts for all processors, but the last one
  private setNexts() {
    for (let i = 0; i < this.processors.length - 1; i++) {
      this.processors[i].next = this.processors[i + 1].process;
    }
  }

  async castMessage(message: Message) {
    // if this is a broadcast message, receiver id is group id
    if (isFlagSet(message, MessageFlag.BROADCAST)) { // TODO: clean this, use strategy pattern
      const room = this.roomManager.getRoom(message.receiverId.toString())
      if (room) {
        // TODO: this will only send to online users, 
        //offline users will not receive this message
        this.io.to(room.name).emit('message', message)
        // archive message for offline users
        this.offlineMessageService.sendMessageOrFail(message)
        // TODO: archive this message
        // for these offline users or these who failed to receive this message
        // they are able to retrive this message from offline message service
      } else {
        throw new RoomNotExistException()
      }
    } else {
      const messenger = this.socketManager.getMessenger(message.receiverId)

      if (messenger) {
        messenger.castMessage(message)
      } else {
        throw new UserOfflineException()
      }
    }
  }
}