import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Geographic } from "./geographic.entity";
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose, Transform } from 'class-transformer';
import { Attr } from "../../auth/entities/attr.entity";
import { Comment } from "../../comment/entities/comment.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: true })
    avatar: string;

    @Column({type: "varchar", length: 200, nullable: true})
    name: string; // nickname

    @Index({ unique: true })
    @Unique('username', ['username'])
    @Column({type: "varchar", length: 200})
    username: string;

    @Exclude()                // Exclude means this column will not be returned in the response
    @Column({ select: false}) // select: false means this column will not be selected by default
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

    @Column({default: 0})
    notifyCount: number;

    @Column({default: 0})
    unreadCount: number;

    @Column({ nullable: true })
    country: string;

    @Column('simple-enum', { enum: ['admin', 'user', 'visitor'] })
    role: string;

    @OneToOne(() => Attr,{cascade: true})
    @JoinColumn()
    attributes: Promise<Attr>; 
    
    @Column({type: 'json', nullable: true})
    geographic: Geographic;
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
    
    @Column({ nullable: true })
    token: string;

    @OneToMany(() => Comment, comment => comment.createdBy)
    comments: Comment[];

    @BeforeInsert() 
    async encryptPwd() { 
      this.password = bcrypt.hashSync(this.password); 
    }
}