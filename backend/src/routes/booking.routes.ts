import { Router } from 'express';
import { BookingService } from '../services/booking.service.ts';
import { BookingController } from '../controllers/booking.controller.ts';
import { authorize } from '@/middlewares/authorize.middleware.ts';
import { restrictTo } from '@/middlewares/restrict.middleware.ts';

const bookingsRouter = Router();
const bookingService = new BookingService();
const bookingController = new BookingController(bookingService);

bookingsRouter.post(
  '/booking',
  authorize,
  restrictTo('user'),
  bookingController.createSlot
);
bookingsRouter.get(
  '/booking/me',
  authorize,
  restrictTo('user'),
  bookingController.myBookings
);
bookingsRouter.delete(
  '/booking/:id',
  authorize,
  restrictTo('user'),
  bookingController.cancelBooking
);

export default bookingsRouter;
