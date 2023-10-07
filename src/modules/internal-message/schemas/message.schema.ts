import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { snowflake } from 'src/modules/socket-io/snowflake';
import { CreateMessageDto } from '../dto/create-message.dto';
import { MESSAGE_TTL } from 'src/config/config';

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

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({
    required: true,
    unique: true,
    type: String,
    index: true,
    // transform: (v) => BigInt(v),
  })
  msgId: MsgId = snowflake.nextId().toString()

  @Prop({
    required: true,
    index: true,
  })
  senderId: number

  @Prop({ 
    required: true,
    index: true,
  })
  receiverId: number

  @Prop({ required: true, type: Object }) // this type is equivalent to Schema.Types.Any
  content: string | object

  @Prop({ 
    required: true,
    type: Date,
    expires: MESSAGE_TTL,  // auto delete after 30 days
  })
  sentAt: Date = new Date()

  @Prop()
  hasReadCount: number = 0

  @Prop({ required: true })
  flag: number = MessageFlag.NONE

  constructor() {}

  static ACK(toMessage: Message, type: ACKMsgType) {
    const msg = new Message()
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
    const msg = new Message()
    msg.receiverId = createMessageDto.receiverId
    msg.content = createMessageDto.content || ''
    msg.flag = msg.flag || createMessageDto.flag || MessageFlag.NONE //TODO: find out why default value is not working
    msg.senderId = senderId

    return msg
  }

  static parse(object: { receiverId: number; content: string | object; flag: number; senderId: number; }) {
    const msg = new Message()
    msg.receiverId = object.receiverId
    msg.content = object.content
    msg.flag = object.flag
    msg.senderId = object.senderId
    return msg
  }
}

export const MessageSchema = SchemaFactory.createForClass(Message)

export function isValidACK(msg: Message) {
  return !!(msg.flag & MessageFlag.ACK)
}

export function parseACK(msg: Message) {
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

export function isFlagSet(msg: Message, flag: MessageFlag) {
  return !!(msg.flag & flag)
}


export function serializeMsg(message: Message) {
  return JSON.stringify(message, (key, value) => {
    if (key === 'msgId') {
      return value.toString()
    }
    return value
  })
}