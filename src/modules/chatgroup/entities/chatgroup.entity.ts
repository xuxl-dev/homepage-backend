import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";



//TypeORM https://typeorm.bootcss.com/
// better use https://typeorm.io/
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
}
