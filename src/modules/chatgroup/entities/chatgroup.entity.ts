import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatGroup {
  @PrimaryGeneratedColumn()
  id: number

  @Index()
  @Column()
  name: string;


  @ManyToMany(() => User, (user) => user.joinedChatGroups)
  @JoinTable()
  members: User[];

  //TODO allow any user to join this group flag
  
}
