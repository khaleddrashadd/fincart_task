import jwt from 'jsonwebtoken';
import { User, type IUser } from '../models/user.model.ts';
import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from '../dtos/auth.dto.ts';

export class AuthService {
  private generateToken(userId: string, role: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign({ id: userId, role }, secret, { expiresIn: '7d' });
  }

  async register(registerData: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await User.findOne({ email: registerData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create(registerData);

    const token = this.generateToken(user.id.toString(), registerData.role);

    return {
      success: true,
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

    const token = this.generateToken(user.id.toString(), user.role);

    return {
      success: true,
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
