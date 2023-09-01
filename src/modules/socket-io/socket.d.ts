// socket.d.ts

import { Socket } from 'socket.io';
import { User } from '../user/entities/user.entity';
import { Messenger } from './messenger';

declare module 'socket.io' {
  interface Socket {
    /**
     * Note that this is appended to the socket object
     */
    user?: User;
    messenger?: Messenger;
  }
}
