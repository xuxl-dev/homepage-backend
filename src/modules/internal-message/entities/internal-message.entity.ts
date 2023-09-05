import { CreateInternalMessageDto } from "../dto/create-internal-message.dto";

export type MsgId = bigint;
export type MessengerId = userId | groupId;
export type userId = number;
export type groupId = number;
export class InternalMessage {
  msgId: MsgId

  senderId: MessengerId

  receiverId: MessengerId

  content: string

  sentAt: number  // timestamp
                  // timezone is not processed here
  constructor(createInternalMsgDto: CreateInternalMessageDto) {
    this.receiverId = createInternalMsgDto.receiverId
    this.content = createInternalMsgDto.content
    this.sentAt = Date.now()
  }

} //actually this is a special case of BroadcastMessage




export class BrocastMessage {
  msgId: number

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