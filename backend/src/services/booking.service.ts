import type {
  BookingListResponseDto,
  BookingResponseDto,
  createBookingDto,
  updateBookingDto,
} from '../dtos/booking.dto.ts';
import { Booking } from '../models/booking.model.ts';

export class BookingService {
  async createBooking(
    userId: string,
    bookingData: createBookingDto
  ): Promise<BookingResponseDto> {
    const booking = await Booking.create({
      ...bookingData,
      userId,
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      'slotId',
      'id startTime endTime isBooked'
    );

    // console.log(service, '⛔⛔');
    return {
      id: booking.id.toString(),
      userId: booking.userId.toString(),
      service: populatedBooking?.serviceId,
      slot: populatedBooking?.slotId,
      bookingDate: booking.bookingDate,
      status: booking.status,
    };
  }

  async updateBooking(
    bookingId: string,
    updateData: updateBookingDto
  ): Promise<BookingResponseDto | null> {
    const booking = await Booking.findByIdAndUpdate(bookingId, updateData, {
      new: true,
    });
    return booking ? booking.toJSON() : null;
  }

  async getBookingById(bookingId: string): Promise<BookingResponseDto | null> {
    const booking = await Booking.findById(bookingId);
    return booking ? booking.toJSON() : null;
  }

  async listBookings(
    providerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BookingListResponseDto> {
    const bookings = await Booking.find({ providerId })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Booking.countDocuments({ providerId });

    return {
      bookings: bookings.map((booking) => booking.toJSON()),
      total,
      page,
      limit,
    };
  }
}
