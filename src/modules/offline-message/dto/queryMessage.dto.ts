import { MaxLength } from "class-validator";
import { MsgId } from "src/modules/internal-message/entities/message-new.entity";

export class QueryMessageDto {
  @MaxLength(30)
  id: MsgId
}