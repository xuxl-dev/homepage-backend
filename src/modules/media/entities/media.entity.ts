import { Chatsess } from "src/modules/chatsess/entities/chatsess.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, Index, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  filename: string;

  @ManyToOne(() => User, (user) => user.medias)
  createdBy: User;

  /**
   * this stores a access token, a group, or a user has
   */
  @ManyToMany(() => Chatsess, (chatsess) => chatsess.accessibleMedias)
  visibleTo: Chatsess[];
}
