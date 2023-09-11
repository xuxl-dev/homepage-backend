
import { InternalMessage, MsgId, MessengerId } from "src/modules/internal-message/entities/internal-message.entity";
import { snowflake } from "src/modules/socket-io/snowflake";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class OfflineMessage {
  @PrimaryColumn('bigint', {
    transformer: {
      from: (value: string) => BigInt(value),
      to: (value: MsgId) => value.toString(),
    }
  })
  msgId: bigint

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

  /** this marks how many user in broadcast group has ack the msg
   * when equals to the number of users in the group, delete the msg
   */
  @Column({ default: 0 })
  hasSentCount: number

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updateAt: Date

  static fromInternal(InternalMessage: InternalMessage) {
    const msg = new OfflineMessage()
    msg.msgId = BigInt(InternalMessage.msgId)
    msg.senderId = InternalMessage.senderId
    msg.receiverId = InternalMessage.receiverId
    msg.content = InternalMessage.content
    msg.sentAt = InternalMessage.sentAt
    return msg
  }

  static new(senderId: MessengerId, receiverId: MessengerId, content: string) {
    const msg = new OfflineMessage()
    msg.msgId = snowflake.nextId()
    msg.senderId = senderId
    msg.receiverId = receiverId
    msg.content = content
    msg.sentAt = new Date()
    return msg
  }
}
