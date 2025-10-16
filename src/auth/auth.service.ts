import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../chat/entities/user.entity';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Validates a user's credentials for login.
   * @param username The user's username.
   * @param pass The user's password.
   * @returns The user object without the password if valid, otherwise null.
   */
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ username });

    // In a real app, you would hash and compare passwords here.
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async findOrCreateGoogleUser(profile: any): Promise<User> {
    // We'll use email as the unique identifier from Google
    const user = await this.userRepository.findOneBy({ username: profile.email });

    if (user) {
      return user; // Return the existing user
    }

    // If no user is found, create a new one
    const newUser = this.userRepository.create({
      username: profile.email,
      // You might want to generate a random password or leave it null
      // since they are logging in via Google.
      password: Math.random().toString(36).substring(2),
    });

    return this.userRepository.save(newUser);
}

  /**
   * Creates a new user (signup).
   * @param loginDto Contains the username and password for the new user.
   * @returns The newly created user object without the password.
   */
  async createUser(loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    // Check if the username is already taken
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // In a real app, you must hash the password before saving!
    const newUser = this.userRepository.create({ username, password });

    const savedUser = await this.userRepository.save(newUser);

    // Destructure to remove the password before returning to the client
    const { password: _, ...result } = savedUser;
    return result;
  }
}