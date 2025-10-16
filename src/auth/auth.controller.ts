import { Controller, Post, Body, Get, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { GoogleAuthGuard } from './google-auth.guard'; // Import your custom guard

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
  
  @Post('signup')
  async signup(@Body() loginDto: LoginDto) {
    return this.authService.createUser(loginDto);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard) // ✅ Use the guard directly, without arguments
  async googleAuth(@Req() req) {
    // This guard now correctly handles the redirect to Google
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard) // ✅ Also use the custom guard here
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;
    
    // This script saves user data to localStorage and redirects to the chat page
    res.send(`
      <script>
        localStorage.setItem('chatUser', JSON.stringify(${JSON.stringify(user)}));
        window.location.href = '/index.html';
      </script>
    `);
  }
}