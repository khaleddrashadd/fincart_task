import type { Request, Response } from 'express';
import type { BookingService } from '../services/booking.service.ts';

export class BookingController {
  constructor(private bookingService: BookingService) {}

  createSlot = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
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
  myBookings = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.bookingService.myBookings(userId, page, limit);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  cancelBooking = async (
    req: Request,
    res: Response
  ): Promise<Response | void> => {
    try {
      const bookingId = req.params.id as string;
      const userId = req.user?.id;
      if (!bookingId || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Booking ID and User ID are required',
        });
      }
      const result = await this.bookingService.cancelBooking(bookingId, userId);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found or already cancelled',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
