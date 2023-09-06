
import { InternalMessage, MsgId, MessengerId } from "src/modules/internal-message/entities/internal-message.entity";
import { snowflake } from "src/modules/socket-io/snowflake";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class OfflineMessage {
  @PrimaryColumn('bigint',{
    transformer: {
      from: (value: string) => BigInt(value),
      to: (value: MsgId) => value.toString(),
    }
  })
  msgId: MsgId

  @Index()
  @Column()
  senderId: MessengerId

  @Index()
  @Column()
  receiverId: MessengerId

  @Column()
  content: string

  @Column({ type: 'datetime' })
  sentAt: Date

  static fromInternal(InternalMessage:InternalMessage) {
    const msg = new OfflineMessage()
    msg.msgId = InternalMessage.msgId
    msg.senderId = InternalMessage.senderId
    msg.receiverId = InternalMessage.receiverId
    msg.content = InternalMessage.content
    msg.sentAt = InternalMessage.sentAt
    return msg
  }


  static new(senderId: MessengerId, receiverId: MessengerId, content: string) {
    const msg = new OfflineMessage()
    msg.msgId = snowflake.nextId().toString()
    msg.senderId = senderId
    msg.receiverId = receiverId
    msg.content = content
    msg.sentAt = new Date()
    return msg
  }
}
