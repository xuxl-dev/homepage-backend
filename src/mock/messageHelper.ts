import { promises } from "dns";
import EventEmitter from "events";
import { Socket, io } from 'socket.io-client';

class MessageHelper extends EventEmitter {
  server_addr: string
  port: number
  token: string

  constructor(server: string) {
    super()
    this.server_addr = server
  }

  socket?: Socket

  async connect() {
    this.socket = io(this.server_addr, {
      port: this.port,
      extraHeaders: {
        authorization: this.token,
      },
      autoConnect: true,
    });
    this.socket.connect()
    return new Promise<void>((resolve, reject) => {
      this.socket?.once('connect', () => {
        console.log('successfully connected to server!');
        resolve()
      });
      this.socket?.once('connect_error', (error) => {
        console.error('Connection error:', error.message);
        reject(error)
      });
    })
  }

  async send(evt: string, msg: object) {
    return new Promise<void>((resolve, reject) => {
      this.socket?.emit(evt, msg, (ack: any) => {
        console.log('Received acknowledgment:', ack);
        resolve(ack)
      })
    })
  }

  subscribe(channel: string, callback: (msg: object) => void | PromiseLike<void>) {
    this.socket?.on(channel, callback)
  }

  subscribeOnce(channel: string, callback: (msg: object) => void | PromiseLike<void>) {
    this.socket?.once(channel, callback)
  }

  unsubscribe(channel: string, callback: (msg: object) => void | PromiseLike<void>) {
    this.socket?.off(channel, callback)
  }
}