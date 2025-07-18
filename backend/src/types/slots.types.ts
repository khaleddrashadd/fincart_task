import { LoginDto, RegisterDto } from '@/dtos/auth.dto.ts';
import { IUser } from '@/models/user.model.ts';
import type mongoose from 'mongoose';

export type AuthService = {
  register: (data: RegisterDto) => Promise<IUser>;
  login: (data: LoginDto) => Promise<{ token: string; user: IUser }>;
  getProfile: (userId: string) => Promise<IUser>;
};
