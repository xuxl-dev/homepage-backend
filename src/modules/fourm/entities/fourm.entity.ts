import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "../../comment/entities/comment.entity";

@Entity()
export class Fourm {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Comment, (comment) => comment.fourm)
  comments: Comment[];

  @Column({ nullable: false, default: true }) // 允许匿名评论
  allowAnonymousComment: boolean;

  @Column({ nullable: false, default: false }) // 禁止查看
  hidden: boolean;

  @Column({ nullable: false, default: false }) // 禁评（只读）
  closed: boolean;
}
