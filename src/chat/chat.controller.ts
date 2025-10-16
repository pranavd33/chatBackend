import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

   @Post('conversation/find-or-create')
  findOrCreateConversation(@Body() body: { user1Id: number; user2Id: number }) {
    return this.chatService.findOrCreateConversation(body.user1Id, body.user2Id);
  }

  @Get('conversation/:id')
  getMessages(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getConversationMessages(id);
  }

  // 👇 ADD THIS NEW ENDPOINT
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Save files to the 'uploads' folder
        filename: (req, file, cb) => {
          // Generate a unique filename
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Return the URL of the uploaded file
    const fileUrl = `http://localhost:3000/uploads/${file.filename}`;
    return { url: fileUrl };
  }
}