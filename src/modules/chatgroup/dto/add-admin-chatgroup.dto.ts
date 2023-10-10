export class AddAdminDto {
  /**
   * @description user id
   * Admin of the group can add user to the group
   */
  userId: number;

  groupId: number;
}