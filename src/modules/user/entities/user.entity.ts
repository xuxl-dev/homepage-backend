import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Geographic } from "./geographic.entity";
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Attr } from "../../auth/entities/attr.entity";
// import { Comment } from "../../comment/entities/comment.entity";
import { Chatgroup as ChatGroup } from "src/modules/chatgroup/entities/chatgroup.entity";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: "varchar", length: 200, nullable: true })
  name: string; // nickname

  @Index({ unique: true })
  @Unique('username', ['username'])
  @Column({ type: "varchar", length: 200 })
  username: string;

  @Exclude()                // Exclude means this column will not be returned in the response
  @Column({ select: false }) // select: false means this column will not be selected by default
  password: string;         // when querying the database, aka. not returned in the response

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  signature: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  group: string;

  @Column({ type: 'json', nullable: true })
  tags: { key: number, label: string }[];

  @Column({ default: 0 })
  notifyCount: number;

  @Column({ default: 0 })
  unreadCount: number;

  @Column({ nullable: true })
  country: string;

  @Column('simple-enum', { enum: ['admin', 'user', 'visitor'] })
  role: string;

  @OneToOne(() => Attr, { cascade: true })
  @JoinColumn()
  attributes: Promise<Attr>;

  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true })
  phone: string;
  @Column({ nullable: true })
  status: number;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToMany(() => ChatGroup, chatgroup => chatgroup.members)
  joinedChatGroups: ChatGroup[];

  /**
   * this is the public key of the user, used for e2e encryption
   * if a user want to send a e2e message to an offline user,
   * he should encrypt the message with this public key
   */
  @Column('text', { nullable: true })
  public_key: string;


  @BeforeInsert()
  async encryptPwd() {
    this.password = bcrypt.hashSync(this.password);
  }
}
