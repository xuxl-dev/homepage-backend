import { Snowflake } from 'src/modules/socket-io/utils';
import { CreateMessageDto } from '../dto/create-message.dto';
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

class Message2 {
  msgId: bigint = snowflake.nextId()
  senderId: number
  receiverId: number

  content: string

  sentAt: Date = new Date()
  type: MessageType



  constructor() { }

  static ACK(toMessage: Message2) {
    const msg = new Message2()
    msg.type = MessageType.ACK
    msg.content = toMessage.msgId.toString()
    msg.receiverId = toMessage.senderId
    msg.senderId = toMessage.receiverId
    return msg
  }

  static new(createMessageDto: CreateMessageDto, senderId: number) {
    const msg = new Message2()
    msg.receiverId = createMessageDto.receiverId
    msg.content = createMessageDto.content
    msg.type = createMessageDto.type
    msg.senderId = senderId
    return msg
  }

  static parse(object) {
    const msg = new Message2()
    msg.msgId = BigInt(object.msgId)
    msg.receiverId = object.receiverId
    msg.content = object.content
    msg.type = object.type
    msg.senderId = object.senderId
    msg.sentAt = new Date(object.sentAt)
    return msg
  }

}