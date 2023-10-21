import { User } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: false })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ default: true })
  allowAnyUserToJoin: boolean;

  @ManyToMany(() => User, (user) => user.joinedChatGroups, { cascade: true })
  @JoinTable()
  admins: User[];

  @ManyToMany(() => User, (user) => user.joinedChatGroups, { cascade: true })
  @JoinTable()
  members: User[];

  //TODO allow any user to join this group flag
}
