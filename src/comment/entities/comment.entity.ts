import { TimingEntity } from "src/common/entities/timing.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, Index, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { Fourm } from "src/fourm/entities/fourm.entity";

@Entity()
export class Comment extends TimingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', nullable: false })
  content!: string;

  @Column({ nullable: true })
  displayName!: string;

  @ManyToOne(() => User, (user) => user.comments, {nullable: true})
  createdBy?: User;

  @Column({ nullable: false,default:false })
  isHidden!: boolean;

  @Column({ nullable: false,default:false })
  isDeleted!: boolean;

  @ManyToOne(() => Fourm, (fourm) => fourm.comments, {nullable: true})
  fourm?: Fourm;

  @OneToOne(() => Comment, {nullable: true})
  replyTo?: Comment;

  public static create(content: string, displayName: string, belongsTo: Fourm, replyTo?:Comment, createdBy?: User) {
    const comment = new Comment();
    comment.content = content;
    comment.displayName = displayName;
    comment.createdBy = createdBy;
    comment.fourm = belongsTo;
    comment.replyTo = replyTo;
    return comment;
  }
}
