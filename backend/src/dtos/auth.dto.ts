export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'provider';
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  success: boolean;
  token?: string;
}
