import { OmitType } from "@nestjs/mapped-types";
import { InternalMessage, MsgId } from "./internal-message.entity";
import { snowflake } from "src/modules/socket-io/snowflake";

export enum ACKMessageType {
  SERVER_RECEIVED,   //服务器已接收
  DELEVERED,  //已送达但未读
  READ,       //已读
}

export class ACKMessage extends OmitType(InternalMessage, ['content']) {
  type: ACKMessageType;
  ackMsgId: MsgId;

  constructor(ackMsgId: MsgId, senderId: number, receiverId: number, type: ACKMessageType) {
    super()
    this.msgId = snowflake.nextId()
    this.ackMsgId = ackMsgId
    this.senderId = senderId
    this.receiverId = receiverId
    this.type = type
  }
}