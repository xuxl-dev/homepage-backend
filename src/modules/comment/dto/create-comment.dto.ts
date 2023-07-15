export class CreateCommentDto {
  content!: string;
  belongsTo!: number;
  displayName?: string;
  replyTo?: number;
}
