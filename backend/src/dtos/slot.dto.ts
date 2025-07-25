import { ServiceResponseDto } from './service.dto.ts';

export interface createSlotDto {
  startTime: Date;
  endTime: Date;
  serviceId: string; // Reference to the service
}

export interface updateSlotDto {
  startTime?: Date;
  endTime?: Date;
  isBooked?: boolean;
}

export interface SlotResponseDto {
  id: string;
  provider: UserResponseDto;
  service: ServiceResponseDto; // Reference to the service
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  isExpired: boolean; // Optional field to indicate if the slot is expired
}
export interface SlotListResponseDto {
  slots: SlotResponseDto[];
  total: number;
  page: number;
  limit: number;
}

export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
}
