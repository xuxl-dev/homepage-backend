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

export type MsgId = string

@Entity()
export class Message {
  @PrimaryColumn('bigint', {
    transformer: {
      from: (value: string) => BigInt(value),
      to: (value: MsgId) => value.toString(),
    }
  })
  msgId: MsgId = snowflake.nextId().toString()

  @Column()
  senderId: number
  
  @Column()
  receiverId: number

  @Column()
  content: string

  @Column()
  sentAt: Date = new Date()

  @Column('int')
  type: MessageType


  constructor() { }

  static ACK(toMessage: Message) {
    const msg = new Message()
    msg.type = MessageType.ACK
    msg.content = toMessage.msgId.toString()
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
    msg.msgId = BigInt(object.msgId).toString()
    msg.receiverId = object.receiverId
    msg.content = object.content
    msg.type = object.type
    msg.senderId = object.senderId
    msg.sentAt = new Date(object.sentAt)
    return msg
  }

}