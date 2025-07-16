import jwt from 'jsonwebtoken';
import { User, type IUser } from '../models/user.model.ts';
import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from '../dto/auth.dto.ts';

export class AuthService {
  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || '123', {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }

  async register(registerData: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await User.findOne({ email: registerData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create(registerData);
    const token = this.generateToken(user.id.toString());

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  async login(loginData: LoginDto): Promise<AuthResponseDto> {
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(loginData.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id.toString());

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
