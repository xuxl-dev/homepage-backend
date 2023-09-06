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

  constructor(ackMsgId: MsgId, receiverId: number, type: ACKMessageType) {
    super()
    this.ackMsgId = ackMsgId
    this.receiverId = receiverId
    this.type = type
  }
}