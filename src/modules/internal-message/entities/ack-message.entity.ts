import { OmitType } from "@nestjs/mapped-types";
import { InternalMessage, MsgId } from "./internal-message.entity";

export enum ACKMessageType {
  SERVER_RECEIVED,   //服务器已接收
  DELEVERED,  //已送达但未读
  READ,       //已读
}

export class ACKMessage extends OmitType(InternalMessage, ['content']) {
  type: ACKMessageType;
  ackMsgId: MsgId;

  constructor(msgId: MsgId, ackMsgId: MsgId, senderId: number, receiverId: number, type: ACKMessageType) {
    super()
    this.msgId = msgId
    this.ackMsgId = ackMsgId
    this.senderId = senderId
    this.receiverId = receiverId
    this.type = type
  }

  serialize(){
    // handle bigint
    return JSON.stringify(this, 
      (key, value) => typeof value === 'bigint' ? value.toString() : value
    )
  }
}