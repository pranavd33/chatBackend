import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module'; 
import { User } from './chat/entities/user.entity';
import { Conversation } from './chat/entities/conversation.entity';
import { Message } from './chat/entities/message.entity';
import { join } from 'path'; 
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render's PostgreSQL connections
  },
  // host: process.env.DB_HOST,
  // port: 5432,// Convert port to a number
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD, // ✅ Securely loaded
  // database: process.env.DB_NAME,
  entities: [User, Conversation, Message],
  synchronize: true,
}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontEnd'),
      // By not specifying a serveRoot, it serves files from the root URL
    }),
    ChatModule, 
     AuthModule, UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}



