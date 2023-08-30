import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chatgroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
