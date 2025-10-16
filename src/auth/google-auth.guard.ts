// In src/auth/google-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      // This option forces Google to show the account selection screen every time
      prompt: 'select_account',
    });
  }
}