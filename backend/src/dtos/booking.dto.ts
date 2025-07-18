import { ServiceResponseDto } from './service.dto.ts';
import { SlotResponseDto } from './slot.dto.ts';

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
  status: 'confirmed' | 'cancelled';
}
export interface BookingListResponseDto {
  bookings: Omit<BookingResponseDto, 'slot' | 'service'>[];
  total: number;
  page: number;
  limit: number;
}
