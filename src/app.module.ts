import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',           // Specifies the database type
      host: 'localhost',          // Your database host (usually 'localhost' for local dev)
      port: 5432,                 // Default PostgreSQL port
      username: 'your_username',  // Your PostgreSQL username
      password: 'your_password',  // Your PostgreSQL password
      database: 'your_database_name', // The name of your database
      entities: [],               // Add your entity classes here, e.g., [User, Message]
      synchronize: true,          // WARNING: Only for development. Auto-creates DB tables.
    }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
