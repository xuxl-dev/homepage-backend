import { MessageType } from "../entities/message-new.entity"

export class CreateMessageDto {
  receiverId: number
  content: string
  type: MessageType
}