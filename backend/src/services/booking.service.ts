import type {
  BookingListResponseDto,
  BookingResponseDto,
  createBookingDto,
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

    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'slotId',
      populate: [
        { path: 'serviceId', select: 'title description duration price' },
      ],
    });

    if (!populatedBooking || !populatedBooking.slotId) {
      throw new Error('Slot not found');
    }

    const slot = populatedBooking.slotId as any;

    if (!slot.providerId || !slot.serviceId) {
      throw new Error('Provider or Service not found');
    }

    const service = slot.serviceId;

    return {
      id: booking.id,
      userId: booking.userId,
      status: booking.status,
      slot,
      service,
    };
  }

  async myBookings(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<BookingListResponseDto> {
    const bookings = await Booking.find({ userId })
      .populate({
        path: 'slotId',
        select: 'endTime',
      })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Booking.countDocuments({ userId });

    const formattedBookings = bookings.map((booking) => {
      const slot = booking.slotId as any;
      return {
        id: booking.id,
        userId: booking.userId,
        status: booking.status,
        isExpired: slot.endTime < new Date(),
      };
    });

    return {
      bookings: formattedBookings,
      total,
      page,
      limit,
    };
  }
  async cancelBooking(bookingId: string, userId: string): Promise<boolean> {
    const booking = await Booking.findOneAndUpdate(
      { id: bookingId, userId },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      throw new Error(
        'Booking not found or you are not authorized to cancel it'
      );
    }

    return true;
  }
}
