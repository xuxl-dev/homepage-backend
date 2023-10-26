import { Media } from "src/modules/media/entities/media.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chatsess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  identifier: string;

  @Column()
  isGroup: boolean;

  @ManyToMany(() => User, (user) => user.chatSessions)
  members: Promise<User[]>;

  @ManyToMany(() => Media, (media) => media.visibleTo)
  accessibleMedias: Promise<Media[]>
}
