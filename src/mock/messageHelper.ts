import EventEmitter from "events";
import { Socket, io } from 'socket.io-client';
import { messageToken } from "src/modules/socket-io/Tokens";

export class MessageHelper extends EventEmitter {
  server_addr: string
  port: number
  token: string
  onMsgCallbacks: Map<string, ((msg: object) => void)[]> = new Map()

  constructor(server: string) {
    super()
    this.server_addr = server
  }

  _socket?: Socket

  async connect() {
    this._socket = io(this.server_addr, {
      port: this.port,
      extraHeaders: {
        authorization: this.token,
      },
      auth:{
        token: this.token
      },
      autoConnect: true,
    });
    this._socket.connect()
    return new Promise<void>((resolve, reject) => {
      this._socket?.once('connect', () => {
        console.log('successfully connected to server!');
        resolve()
      });
      this._socket?.once('connect_error', (error) => {
        console.error('Connection error:', error.message);
        reject(error)
      });
    })
  }

  async send(evt: string, msg: object) {
    this._socket?.emit(evt, msg)
  }

  async message(msg: object) {
    this._socket?.emit(messageToken, msg)
  }

  subscribe(channel: string, callback: (msg: object) => void | PromiseLike<void>) {
    if (!this.onMsgCallbacks.has(channel)) {
      this.onMsgCallbacks.set(channel, [])
      this._socket?.on(channel, (msg: object) => {
        this.onMsgCallbacks.get(channel)?.forEach(cb => cb(msg))
      })
    }
    this.onMsgCallbacks.get(channel).push(callback)
  }

  subscribeOnce(channel: string, callback: (msg: object) => void | PromiseLike<void>) {
    this._socket?.once(channel, callback)
  }

  unsubscribe(channel: string, callback: (msg: object) => void | PromiseLike<void>) {
    this.onMsgCallbacks.set(channel, this.onMsgCallbacks.get(channel)?.filter(cb => cb !== callback))
  }

  onPredicate(channel: string, predicate: (msg: object) => boolean, callback: (msg: object) => void | PromiseLike<void>) {
    this.subscribe(channel, (msg) => {
      if (predicate(msg)) {
        callback(msg)
      }
    })
  }

  onPredicateOnce(channel: string, predicate: (msg: object) => boolean, callback: (msg: object) => void | PromiseLike<void>) {
    this.subscribeOnce(channel, (msg) => {
      if (predicate(msg)) {
        callback(msg)
      }
    })
  }

  public get socket() : Socket {
    return this._socket
  }
  
}