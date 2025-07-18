export interface createServiceDto {
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
}

export interface updateServiceDto {
  title?: string;
  description?: string;
  price?: number;
  duration?: number; // in minutes
}

export interface ServiceResponseDto {
  id: string;
  provider: UserResponseDto;
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
}
export interface ServiceListResponseDto {
  services: ServiceResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
}
