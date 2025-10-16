import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

// Use a different port for the WebSocket server
@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // A client joins a conversation's "room"
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { conversationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `conversation_${data.conversationId}`;
    client.join(room);
    console.log(`Client ${client.id} joined room: ${room}`);
  }

  // A client sends a message
  @SubscribeMessage('sendMessage')
async handleMessage(
  @MessageBody() createMessageDto: CreateMessageDto,
): Promise<void> {
  // 👇 1. Log the incoming message
  console.log('--- 1. Backend received message:', createMessageDto);

  const message = await this.chatService.createMessage(createMessageDto);
  const room = `conversation_${createMessageDto.conversationId}`;

  // 👇 2. Log the room it's about to be sent to
  console.log(`--- 2. Broadcasting message to room: ${room}`);

  this.server.to(room).emit('receiveMessage', message);
}
}