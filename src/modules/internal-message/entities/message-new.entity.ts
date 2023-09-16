import { Snowflake } from 'src/modules/socket-io/utils';
import { CreateMessageDto } from '../dto/create-message.dto';
import { Column, Entity, PrimaryColumn } from 'typeorm';
const snowflake = new Snowflake(3, 1)

export enum MessageType {
  'plain-text',
  'json',
  'rich-text',
  'packed',
  'broadcast',
  'ACK',
  'unknown',
  'e2ee',
  'key-exchange',
  'withdraw',
}

export enum ACKMsgType {
  'DELIVERED',
  'RECEIVED',
  'READ',
}

export type MsgId = string

@Entity()
export class Message {
  @PrimaryColumn('bigint', {

  })
  msgId: MsgId = snowflake.nextId().toString()

  @Column()
  senderId: number

  @Column()
  receiverId: number

  // Need to swithc to MongoDB to support rich text
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

  @Column('int')
  type: MessageType

  @Column({default: 0})
  hasReadCount: number = 0

  constructor() { }

  static ServerACK(toMessage: Message, type: ACKMsgType) {
    const msg = new Message()
    msg.type = MessageType.ACK
    msg.content = JSON.stringify({
      ackMsgId: toMessage.msgId.toString(),
      type,
    })
    msg.receiverId = toMessage.senderId
    msg.senderId = toMessage.receiverId
    return msg
  }

  static new(createMessageDto: CreateMessageDto, senderId: number) {
    const msg = new Message()
    msg.receiverId = createMessageDto.receiverId
    msg.content = createMessageDto.content
    msg.type = createMessageDto.type
    msg.senderId = senderId
    return msg
  }

  static parse(object) {
    const msg = new Message()
    msg.receiverId = object.receiverId
    msg.content = object.content
    msg.type = object.type
    msg.senderId = object.senderId
    return msg
  }

  static pack(object) {
    const msg = new Message()
    msg.receiverId = object.receiverId
    msg.content = JSON.stringify(object.content)
    msg.type = MessageType.packed
    msg.senderId = object.senderId
    return msg
  }

}