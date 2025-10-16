import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ default: false })
  is_group: boolean;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];

  // 👇 THIS IS THE RELATIONSHIP THAT MUST BE ADDED 👇
  @ManyToMany(() => User)
  @JoinTable({
    name: 'participants', // Tells TypeORM to use your existing 'participants' table
    joinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  participants: User[];
}