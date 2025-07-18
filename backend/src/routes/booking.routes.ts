import { Router } from 'express';
import { BookingService } from '../services/booking.service.ts';
import { BookingController } from '../controllers/booking.controller.ts';
import { authorize } from '@/middlewares/authorize.middleware.ts';

const bookingsRouter = Router();
const authService = new BookingService();
const authController = new BookingController(authService);

bookingsRouter.post('/booking', authorize, authController.createSlot);

export default bookingsRouter;
