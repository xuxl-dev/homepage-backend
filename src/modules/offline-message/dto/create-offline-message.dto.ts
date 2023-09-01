import { InternalMessage } from "src/modules/internal-message/entities/internal-message.entity";

export class CreateOfflineMessageDto extends InternalMessage {
  senderId: number;
  receiverId: number;
  content: string;
}
