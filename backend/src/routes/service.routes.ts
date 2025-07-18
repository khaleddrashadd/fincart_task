import { ServiceController } from '@/controllers/service.controller.ts';
import { authorize } from '@/middlewares/authorize.middleware.ts';
import { ServiceService } from '@/services/service.service.ts';
import { Router } from 'express';

const servicesRouter = Router();
const serviceService = new ServiceService();
const serviceController = new ServiceController(serviceService);

servicesRouter.post('/services', authorize, serviceController.createService);
// servicesRouter.get('/services', serviceController.);

export default servicesRouter;
