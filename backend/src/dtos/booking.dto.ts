import type { ServiceResponseDto } from 'features/services/dto/service.dto.ts';
import type { SlotResponseDto } from 'features/slots/dto/slot.dto.ts';

export interface createBookingDto {
  userId: string;
  slotId: string;
  bookingDate: Date;
  status?: 'confirmed' | 'cancelled';
}

export interface updateBookingDto {
  status?: 'confirmed' | 'cancelled';
}

export interface BookingResponseDto {
  id: string;
  userId: string;
  service: ServiceResponseDto;
  slot: SlotResponseDto;
  bookingDate: Date;
  status: 'confirmed' | 'cancelled';
  reminderSent: boolean;
  reminderSentAt?: Date;
}
export interface BookingListResponseDto {
  bookings: BookingResponseDto[];
  total: number;
  page: number;
  limit: number;
}
