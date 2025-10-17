import { Controller, Post, Body, Get, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { GoogleAuthGuard } from './google-auth.guard';

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
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // Redirects to Google login automatically
  }

  @Get('google/redirect')
@UseGuards(GoogleAuthGuard)
googleAuthRedirect(@Req() req, @Res() res: Response) {
  const user = req.user;

  // ✅ Redirect user back to frontend instead of trying to serve a file
  const redirectUrl = `${process.env.FRONTEND_URL}/?user=${encodeURIComponent(
    JSON.stringify(user),
  )}`;

  return res.redirect(redirectUrl);
}
