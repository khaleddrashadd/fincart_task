import { Router } from 'express';
import { SlotService } from '../services/slot.service.ts';
import { SlotController } from '../controllers/slot.controller.ts';
import { authorize } from '@/middlewares/authorize.middleware.ts';
import { restrictTo } from '@/middlewares/restrict.middleware.ts';

const slotRouter = Router();
const slotService = new SlotService();
const slotController = new SlotController(slotService);

slotRouter.post(
  '/slots',
  authorize,
  restrictTo('provider'),
  slotController.createSlot
);
slotRouter.get('/slots', authorize, slotController.listSlots);
slotRouter.get(
  '/slots/my',
  authorize,
  restrictTo('provider'),
  slotController.mySlots
);
slotRouter.get('/slots/:id', authorize, slotController.getSlotById);
slotRouter.put(
  '/slots/:id',
  authorize,
  restrictTo('provider'),
  slotController.updateSlot
);
slotRouter.delete(
  '/slots/:id',
  authorize,
  restrictTo('provider'),
  slotController.deleteSlot
);

export default slotRouter;
