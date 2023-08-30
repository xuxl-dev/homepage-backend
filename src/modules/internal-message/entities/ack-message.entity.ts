import { OmitType } from "@nestjs/mapped-types";
import { InternalMessage } from "./internal-message.entity";

export enum ACKMessageType {
  DELEVERED,  //已送达但未读
  READ,       //已读
}

class ACKMessage extends OmitType(InternalMessage, ['content']) {
  type: ACKMessageType;
  ackMsgId: number;
}