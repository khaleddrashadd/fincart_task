import { ServiceController } from '@/controllers/service.controller.ts';
import { authorize } from '@/middlewares/authorize.middleware.ts';
import { restrictTo } from '@/middlewares/restrict.middleware.ts';
import { ServiceService } from '@/services/service.service.ts';
import { Router } from 'express';

const servicesRouter = Router();
const serviceService = new ServiceService();
const serviceController = new ServiceController(serviceService);

servicesRouter.post(
  '/services',
  authorize,
  restrictTo('provider'),
  serviceController.createService
);
servicesRouter.get('/services', authorize, serviceController.listServices);
servicesRouter.get(
  '/services/:id',
  authorize,
  serviceController.getServiceById
);
servicesRouter.put(
  '/services/:id',
  authorize,
  restrictTo('provider'),
  serviceController.updateService
);
servicesRouter.delete(
  '/services/:id',
  authorize,
  restrictTo('provider'),
  serviceController.deleteService
);

export default servicesRouter;
