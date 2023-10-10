import { IsNumber } from "class-validator";

export class JoinChatGroupDto {
  /**
   * @description user id
   * Admin of the group can add user to the group, but user can also join the group by themselves
   */
  @IsNumber()
  userId: number;

  @IsNumber()
  groupId: number;
}