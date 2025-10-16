import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from './entities/user.entity';
import { Conversation } from './entities/conversation.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  async findOrCreateConversation(user1Id: number, user2Id: number): Promise<Conversation> {
    // This new query is more robust for finding the correct 1-on-1 conversation
    const conversation = await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoin('conversation.participants', 'user')
      .where('conversation.is_group = false')
      .groupBy('conversation.id')
      .having('COUNT(user.id) = 2')
      .andHaving('SUM(CASE WHEN user.id = :user1Id THEN 1 ELSE 0 END) = 1', { user1Id })
      .andHaving('SUM(CASE WHEN user.id = :user2Id THEN 1 ELSE 0 END) = 1', { user2Id })
      .getOne();

    if (conversation) {
      return conversation; // Return the existing conversation
    }

    // If no conversation is found, create a new one
    const user1 = await this.userRepository.findOneBy({ id: user1Id });
    const user2 = await this.userRepository.findOneBy({ id: user2Id });

    if (!user1 || !user2) {
      throw new Error('One or both users not found');
    }

    const newConversation = this.conversationRepository.create({
      participants: [user1, user2],
      is_group: false,
    });

    return this.conversationRepository.save(newConversation);
}

  // Get all messages for a specific conversation
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['user'], // Also load the user who sent the message
      order: { created_at: 'ASC' }, // Oldest messages first
    });
  }

  // Create and save a new message
  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    const { content, userId, conversationId } = createMessageDto;

    // Find the user and conversation
    const user = await this.userRepository.findOneBy({ id: userId });
    const conversation = await this.conversationRepository.findOneBy({ id: conversationId });

    if (!user || !conversation) {
      throw new Error('User or Conversation not found');
    }

    const newMessage = this.messageRepository.create({
      content,
      user,
      conversation,
    });

    return this.messageRepository.save(newMessage);
  }
}