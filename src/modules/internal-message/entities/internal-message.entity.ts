import { CreateInternalMessageDto } from "../dto/create-internal-message.dto";

export type MsgId = string;

export class InternalMessage {
  msgId: MsgId;

  senderId: number;
  receiverId: number;

  content: string;

  constructor(createInternalMsgDto: CreateInternalMessageDto) {
    this.senderId = createInternalMsgDto.senderId;
    this.receiverId = createInternalMsgDto.receiverId;
    this.content = createInternalMsgDto.content;
  }

} //actually this is a special case of BroadcastMessage




export class BrocastMessage {
  msgId: number;

  senderId: number;
  /**
   * GroupId is the id of the chatgroup, not socketio room
   * socketio room contains only online users
   */
  groupId: number;

  content: string;
}
/**
 * Note that this will be sent to all users in the chatgroup
 * But these is not online will not receive it
 */
export class MultiCastMessage {
  msgId: number;

  senderId: number;
  groupIds: number[];

  content: string;
}