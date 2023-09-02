import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";


//TypeORM https://typeorm.bootcss.com/
// better use https://typeorm.io/
@Entity()
export class Chatgroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  name: string;

  // 群成员

  // ...
}
