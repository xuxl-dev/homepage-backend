import { PickType } from "@nestjs/mapped-types";
import { InternalMessage } from "../entities/internal-message.entity";

export class CreateInternalMessageDto extends 
  PickType(InternalMessage, ['senderId', 'receiverId', 'content']) {}
