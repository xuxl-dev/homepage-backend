import { snowflake } from "src/modules/socket-io/snowflake";
import { CreateInternalMessageDto } from "../dto/create-internal-message.dto";
import { OfflineMessage } from "src/modules/offline-message/entities/offline-message.entity";

export type MsgId = string;
export type MessengerId = userId | groupId;
export type userId = number;
export type groupId = number;
export class InternalMessage {
  msgId: MsgId

  senderId: MessengerId

  receiverId: MessengerId

  content: string

  sentAt: Date  // timestamp
                // timezone is not processed here
  _type: string = 'normal'

  constructor(createInternalMsgDto?: CreateInternalMessageDto) {
    this.msgId = snowflake.nextId().toString()
    this.sentAt = new Date()
    if (!createInternalMsgDto) return
    this.receiverId = createInternalMsgDto.receiverId
    this.content = createInternalMsgDto.content
  }

  setSender(senderId: MessengerId) {
    this.senderId = senderId
    return this
  }

  static fromOfflineMsg(offlineMsg: OfflineMessage) {
    const msg = new InternalMessage()
    msg.msgId = offlineMsg.msgId.toString()
    msg.senderId = offlineMsg.senderId
    msg.receiverId = offlineMsg.receiverId
    msg.content = offlineMsg.content
    msg.sentAt = offlineMsg.sentAt
    return msg
  }

  static pack(o:object){
    const msg = new InternalMessage()
    msg.content = JSON.stringify(o)
    msg.receiverId = o['receiverId']
    msg.senderId = o['senderId']
    msg._type = 'packed'
    return msg
  }
} //actually this is a special case of BroadcastMessage


export class BroadcastMessage {
  msgId: number;

  senderId: number
  /**
   * GroupId is the id of the chatgroup, not socketio room
   * socketio room contains only online users
   */
  groupId: number

  content: string
}
/**
 * Note that this will be sent to all users in the chatgroup
 * But these is not online will not receive it
 */
export class MultiCastMessage {
  msgId: number

  senderId: number
  groupIds: number[]

  content: string
}