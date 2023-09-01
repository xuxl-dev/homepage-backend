import { timeout, backOff, asPromise } from "src/utils/utils";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { InternalMessage } from "../internal-message/entities/internal-message.entity";
import { Logger } from "@nestjs/common";
import { ACKMessage } from "../internal-message/entities/ack-message.entity";

const logger = new Logger('SocketIoService')

// /**
//  * this ensures that the message is sent to the client
//  * or throws an error
//  * @param socket 
//  * @param message 
//  * @returns 
//  */
// export async function sendMessageOrThrow(socket: Socket, message: InternalMessage, maxAckTimeout = 3000, backOffInterval = 50, backOffRetries = 10) {
//   return new Promise<void>((resolve, reject) => {
//     let ackTimeout: string | number | NodeJS.Timeout
//     const sendActionFactoryAsync = async () => {
//       socket.emit(MessagingToken, message)
//       // blocked wait for ack
//       await new Promise<void>((resolve, reject) => {
//         socket.once(ACKToken, (ack: ACKMessage) => { //refactor this, this is resouce consuming
//           logger.debug(`message ack received: ${ack}`)
//           clearTimeout(ackTimeout)
//           resolve()
//         });
//         ackTimeout = setTimeout(() => {
//           socket.removeAllListeners(ACKToken) //check if this is correct
//           reject(new Error('ack timeout'))
//         }, maxAckTimeout);
//       })
//     }

//     backOff(sendActionFactoryAsync, backOffInterval, backOffRetries).then(() => {
//       resolve()
//     }).catch((e) => {
//       reject(e)
//     })
//   })
// }
// function emitAsync(socket, eventName, data) {
//   return new Promise((resolve, reject) => {
//     socket.emit(eventName, data, (response) => {
//       if (response.error) {
//         reject(response.error)
//       } else {
//         resolve(response.data)
//       }
//     });
//   });
// }

export class Snowflake {
  private static readonly twepoch = 1625097600000; // 初始时间戳，这个可以根据实际需要调整
  private static readonly workerIdBits = 5;
  private static readonly dataCenterIdBits = 5;
  private static readonly maxWorkerId = -1 ^ (-1 << Snowflake.workerIdBits);
  private static readonly maxDataCenterId = -1 ^ (-1 << Snowflake.dataCenterIdBits);
  private static readonly sequenceBits = 12;

  private readonly workerId: number;
  private readonly dataCenterId: number;
  private sequence = 0;
  private lastTimestamp = -1;

  constructor(workerId: number, dataCenterId: number) {
    if (workerId > Snowflake.maxWorkerId || workerId < 0) {
      throw new Error(`Worker ID must be between 0 and ${Snowflake.maxWorkerId}`);
    }
    if (dataCenterId > Snowflake.maxDataCenterId || dataCenterId < 0) {
      throw new Error(`Data Center ID must be between 0 and ${Snowflake.maxDataCenterId}`);
    }
    this.workerId = workerId;
    this.dataCenterId = dataCenterId;
  }

  public nextId(): string {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error(`Clock is moving backwards. Rejecting requests until ${this.lastTimestamp}`);
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & Snowflake.sequenceBits;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;

    const id =
      ((timestamp - Snowflake.twepoch) << (Snowflake.workerIdBits + Snowflake.dataCenterIdBits)) |
      (this.dataCenterId << Snowflake.workerIdBits) |
      this.workerId;

    return id.toString();
  }

  private tilNextMillis(lastTimestamp: number): number {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  private timeGen(): number {
    return Date.now();
  }
}


