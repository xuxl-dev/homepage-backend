import { timeout, backOff, asPromise } from "src/utils/utils";
import { receiveMessageToken, sendACKToken } from "./Tokens";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { InternalMessage } from "../internal-message/entities/internal-message.entity";
import { Logger } from "@nestjs/common";
import { ACKMessage } from "../internal-message/entities/ack-message.entity";

const logger = new Logger('SocketIoService')

/**
 * this ensures that the message is sent to the client
 * or throws an error
 * @param socket 
 * @param message 
 * @returns 
 */
export async function sendMessageOrThrow(socket: Socket, message: InternalMessage, maxAckTimeout = 3000, backOffInterval = 50, backOffRetries = 10) {
  return new Promise<void>((resolve, reject) => {
    let ackTimeout: string | number | NodeJS.Timeout
    const sendActionFactoryAsync = async () => {
      socket.emit(receiveMessageToken, message)
      // blocked wait for ack
      await new Promise<void>((resolve, reject) => {
        socket.once(sendACKToken, (ack: ACKMessage) => { //refactor this, this is resouce consuming
          logger.debug(`message ack received: ${ack}`)
          clearTimeout(ackTimeout)
          resolve()
        });
        ackTimeout = setTimeout(() => {
          socket.removeAllListeners(sendACKToken) //check if this is correct
          reject(new Error('ack timeout'))
        }, maxAckTimeout);
      })
    }

    backOff(sendActionFactoryAsync, backOffInterval, backOffRetries).then(() => {
      resolve()
    }).catch((e) => {
      reject(e)
    })
  })
}
function emitAsync(socket, eventName, data) {
  return new Promise((resolve, reject) => {
    socket.emit(eventName, data, (response) => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response.data)
      }
    });
  });
}