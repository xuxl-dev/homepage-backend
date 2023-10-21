import { IsString, MaxLength } from "class-validator";

export class CreateChatgroupDto {
  @IsString()
  @MaxLength(64)
  name: string;

  @IsString()
  @MaxLength(512)
  desc: string;
}
