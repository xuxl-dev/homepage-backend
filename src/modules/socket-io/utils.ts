import { timeout, backOff, asPromise } from "src/utils/utils";
import { sendMessageToken } from "./Tokens";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { InternalMessage } from "../internal-message/entities/internal-message.entity";


/**
 * this ensures that the message is sent to the client
 * or throws an error
 * @param socket 
 * @param message 
 * @returns 
 */
export async function sendMessageOrThrow(socket: Socket, message: InternalMessage, maxAckTimeout = 1000, backOffInterval = 1000, backOffRetries = 3) {
  return new Promise<void>((resolve, reject) => {
    const sendActionFactory = () => socket.emit(sendMessageToken, message, (ack: string) => {
      if (ack === 'received') {
        resolve();
      } else {
        reject(ack);
      }
    });


    backOff(() => asPromise(sendActionFactory), backOffInterval, backOffRetries).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
}

function emitAsync(socket, eventName, data) {
  return new Promise((resolve, reject) => {
    socket.emit(eventName, data, (response) => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
}