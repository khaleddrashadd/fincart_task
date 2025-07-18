import type { Request, Response } from 'express';
import type { BookingService } from '../services/booking.service.ts';

export class BookingController {
  constructor(private bookingService: BookingService) {}

  createSlot = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const bookingData = req.body;
      const result = await this.bookingService.createBooking(
        userId,
        bookingData
      );
      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
