import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MessageFlag, MsgId } from '../entities/message-new.entity';

export type MessageDocument = HydratedDocument<Message2>;

@Schema()
export class Message2 {
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
}

export const MessageSchema = SchemaFactory.createForClass(Message2);