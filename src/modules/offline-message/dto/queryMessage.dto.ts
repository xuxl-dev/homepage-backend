import { MaxLength } from "class-validator";
import { MsgId } from "src/modules/internal-message/schemas/message.schema";

export class QueryMessageDto {
  @MaxLength(30)
  id: MsgId
}