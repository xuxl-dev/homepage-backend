import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ACKMsgType, MessageFlag, MsgId } from '../entities/message-new.entity';
import { snowflake } from 'src/modules/socket-io/snowflake';
import { CreateMessageDto } from '../dto/create-message.dto';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop()
  msgId: MsgId = snowflake.nextId().toString()

  @Prop()
  senderId: number

  @Prop({ required: true })
  receiverId: number

  @Prop({ required: true, type: Object }) // this type is equivalent to Schema.Types.Any
  content: string | object

  @Prop({ required: true })
  sentAt: Date = new Date()

  @Prop()
  hasReadCount: number = 0

  @Prop({ required: true })
  flag: number = MessageFlag.NONE

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
    msg.content = createMessageDto.content
    msg.flag = createMessageDto.flag
    msg.senderId = senderId
    return msg
  }

  static parse(object) {
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
