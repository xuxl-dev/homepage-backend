import { Injectable } from "@nestjs/common";
import { ACKMsgType, Message, MsgId, isValidACK, parseACK } from '../internal-message/entities/message-new.entity';
import { OfflineMessageService } from "../offline-message/offline-message.service";
import { SocketIoService } from './socket-io.service';

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
    return Message.ACK(msg, ACKMsgType.RECEIVED)
  }
}

/**
 * this layer times all messages, if ack is not received in time, fall back to offline message
 */
class ACKCountingLayer extends ProcessorBase {
  timeout = 1000
  private pendingMessages: Map<MsgId, (msg: Message) => void> = new Map()
  process: (msg: Message) => Promise<Message> = async (msg: Message) => {
    if (isValidACK(msg)) {
      const {ackMsgId, type} = parseACK(msg)
      console.log(`ACK(${ackMsgId}, ${ACKMsgType[type]}))`)
      if (this.pendingMessages.has(ackMsgId)) { // at least one ack means the message is delivered successfully
        const resolve = this.pendingMessages.get(ackMsgId)
        this.pendingMessages.delete(ackMsgId)
        resolve(msg)
      }
      return this.next(msg);
    } else {
      const messageFail = setTimeout(() => {
        console.log(`message ${msg.msgId} failed to deliver`)
        this.pendingMessages.delete(msg.msgId)
        this.ctx.offlineMessageService.sendMessageOrFail(msg).catch(e => {
          console.error(e)
        })
      }, this.timeout)

      this.pendingMessages.set(msg.msgId, (message) => {
        clearTimeout(messageFail)
        this.pendingMessages.delete(msg.msgId)
      })

    }
    return this.next(msg);
  }
}

class ForwardingLayer extends ProcessorBase  {
  process: (msg: Message) => Promise<Message> = async (msg: Message) => {
    // try send online message, don't care about the result, fail is processed in ack counting layer
    this.ctx.socketIoService.castMessage(msg).catch(e => {
      console.error(e)
    })
    return this.next(msg);
  }
}

type DispatcherCtx = {
  offlineMessageService: OfflineMessageService,
  socketIoService: SocketIoService,
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

  constructor(
    private readonly offlineMessageService: OfflineMessageService,
    private readonly socketIoService: SocketIoService,
  ) {
    this.ctx = {
      offlineMessageService,
      socketIoService,
      dispatcher:this
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
   * non-blocking
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
}