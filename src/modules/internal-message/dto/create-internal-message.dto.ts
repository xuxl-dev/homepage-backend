import { PickType } from "@nestjs/mapped-types";
import { InternalMessage } from "../entities/internal-message.entity";

export class CreateInternalMessageDto {
  receiverId: number;
  content: string;
}
