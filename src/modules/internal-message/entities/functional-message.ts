import { OmitType } from "@nestjs/mapped-types";
import { InternalMessage } from "./internal-message.entity";

export enum MsgFunction {
  WITHDRAW,
}

class FunctionalMessage extends OmitType(InternalMessage, ['content']) {
  function : MsgFunction
  payload : string
}