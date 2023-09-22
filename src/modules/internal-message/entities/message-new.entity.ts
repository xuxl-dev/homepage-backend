import { Snowflake } from 'src/modules/socket-io/utils';
import { CreateMessageDto } from '../dto/create-message.dto';
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';
const snowflake = new Snowflake(3, 1)

export enum MessageFlag {
  'NONE' = 0,   
  'DO_NOT_STORE' = 1 << 0, // do not store this message in database, may fail to deliver
  'ACK' = 1 << 1, // this message is an ACK message
  'BROADCAST' = 1 << 2, // this message is a broadcast message
  'E2EE' = 1 << 3, // this message is encrypted
  'KEY_EXCHANGE' = 1 << 4, // this message is a key exchange message
  'WITHDRAW' = 1 << 5, // this message is a withdraw message
  'COMPLEX' = 1 << 6, // this message is a complex message, the content is a nested message
  'PRESAVED_RSA' = 1 << 7 //use presaved RSA key to encrypt (the target user must have a presaved RSA key)
  //...
}

export enum ACKMsgType {
  'DELIVERED',
  'RECEIVED',
  'READ',
}

export type MsgId = string

@Entity()
export class Message_old {
  @PrimaryColumn('bigint')
  msgId: MsgId = snowflake.nextId().toString()

  @Column()
  senderId: number

  @Column()
  receiverId: number

  // Need to switch to MongoDB to support rich text
  @Column('text', {
    transformer: {
      to: (value: string | object) => {
        if (typeof value === 'string') return value
        return JSON.stringify(value)
      },
      from: (value: string) => {
        try {
          return JSON.parse(value)
        } catch (error) {
          return value
        }
      }
    }
  })
  content: string | {
    ackMsgId: MsgId,
    type: ACKMsgType,
  }

  @Column()
  sentAt: Date = new Date()

  @Column({default: 0})
  hasReadCount: number = 0

  @Column({default: 0})
  flag: number = MessageFlag.NONE

  constructor() { }

  static ACK(toMessage: Message_old, type: ACKMsgType) {
    const msg = new Message_old()
    msg.flag = MessageFlag.ACK
    msg.content = {
      ackMsgId: toMessage.msgId.toString(),
      type,
    }
    msg.receiverId = toMessage.senderId
    msg.senderId = toMessage.receiverId
    return msg
  }

  static new(createMessageDto: CreateMessageDto, senderId: number) {
    const msg = new Message_old()
    msg.receiverId = createMessageDto.receiverId
    msg.content = createMessageDto.content
    msg.flag = createMessageDto.flag
    msg.senderId = senderId
    return msg
  }

  static parse(object) {
    const msg = new Message_old()
    msg.receiverId = object.receiverId
    msg.content = object.content
    msg.flag = object.flag
    msg.senderId = object.senderId
    return msg
  }

  @BeforeInsert()
  beforeInsert() {
    //serialize content
    if (typeof this.content !== 'string') {
      this.content = JSON.stringify(this.content)
    }
  }
}

export function isValidACK(msg: Message_old) {
  return !!(msg.flag & MessageFlag.ACK)
}

export function parseACK(msg: Message_old) {
  if (typeof msg.content === 'string') {
    return JSON.parse(msg.content as string) as {
      ackMsgId: MsgId,
      type: ACKMsgType,
    }
  } else {
    return msg.content as {
      ackMsgId: MsgId,
      type: ACKMsgType,
    }
  }
}