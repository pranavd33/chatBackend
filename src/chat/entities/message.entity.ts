import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @CreateDateColumn()
  created_at: Date;

  // Many messages can be sent by one user
  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  // Many messages belong to one conversation
  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  conversation: Conversation;
}