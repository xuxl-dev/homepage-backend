
import { InternalMessage, MsgId, MessengerId } from "src/modules/internal-message/entities/internal-message.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class OfflineMessage {
  @PrimaryColumn('bigint')
  msgId: MsgId

  @Index()
  @Column()
  senderId: MessengerId

  @Index()
  @Column()
  receiverId: MessengerId

  @Column()
  content: string

  @Column()
  sentAt: number

  static fromInternal(InternalMessage:InternalMessage) {
    const msg = new OfflineMessage()
    msg.msgId = InternalMessage.msgId
    msg.senderId = InternalMessage.senderId
    msg.receiverId = InternalMessage.receiverId
    msg.content = InternalMessage.content
    msg.sentAt = InternalMessage.sentAt
    return msg
  }
}
