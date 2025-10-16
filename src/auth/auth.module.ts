// In src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport'; // 👈 Import this
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../chat/entities/user.entity';
import { GoogleStrategy } from './google.strategy'; // 👈 Import this

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule, // 👈 Add this
  ],
  providers: [AuthService, GoogleStrategy], // 👈 Add GoogleStrategy here
  controllers: [AuthController],
})
export class AuthModule {}