import { Router } from 'express';
import { SlotService } from '../services/slot.service.ts';
import { SlotController } from '../controllers/slot.controller.ts';
import { authorize } from '@/middlewares/authorize.middleware.ts';

const slotRouter = Router();
const slotService = new SlotService();
const slotController = new SlotController(slotService);

slotRouter.post('/slots', authorize, slotController.createSlot);
slotRouter.get('/slots', authorize, slotController.listSlots);
slotRouter.get('/slots/:id', authorize, slotController.getSlotById);
slotRouter.put('/slots/:id', authorize, slotController.updateSlot);
slotRouter.delete('/slots/:id', authorize, slotController.deleteSlot);

export default slotRouter;
