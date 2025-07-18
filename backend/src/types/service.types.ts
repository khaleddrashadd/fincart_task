import type mongoose from 'mongoose';
import type { LoginDto, RegisterDto } from '../dtos/service.dto.ts';
import type { IUser } from '../models/service.model.ts';

export type AuthService = {
  register: (data: RegisterDto) => Promise<IUser>;
  login: (data: LoginDto) => Promise<{ token: string; user: IUser }>;
  getProfile: (userId: string) => Promise<IUser>;
};
