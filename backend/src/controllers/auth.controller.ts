import type { Request, Response } from 'express';
import type {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
} from '../dtos/auth.dto.ts';
import type { AuthService } from '../services/auth.service.ts';
import { Res } from '@/types/responseDto.ts';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response<Res<AuthResponseDto>>) => {
    try {
      const registerData: RegisterDto = req.body;
      const result = await this.authService.register(registerData);
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const loginData: LoginDto = req.body;
      const result = await this.authService.login(loginData);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }
      const userId = req.user.id;
      const profile = await this.authService.getProfile(userId);
      res.status(200).json({
        success: true,
        data: profile,
        isAuthenticated: true,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
