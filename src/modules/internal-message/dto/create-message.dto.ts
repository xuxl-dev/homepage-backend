import { MessageType } from "../entities/message-new"

export class CreateMessageDto {
  receiverId: number
  content: string
  type: MessageType
}