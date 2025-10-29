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
import { ConfigService } from '@nestjs/config'; // <-- 1. IMPORT THIS

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService, // <-- 2. INJECT THIS
  ) {}

  @Post('conversation/find-or-create')
  findOrCreateConversation(@Body() body: { user1Id: number; user2Id: number }) {
    return this.chatService.findOrCreateConversation(body.user1Id, body.user2Id);
  }

  @Get('conversation/:id')
  getMessages(@Param('id', ParseIntPipe) id: number) {
    return this.chatService.getConversationMessages(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const filename = `${uniqueSuffix}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // 3. GET THE PUBLIC URL FROM ENVIRONMENT
    const baseUrl = this.configService.get<string>('API_URL');

    // 4. CREATE THE CORRECT, PUBLIC URL
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    return { url: fileUrl };
  }
}