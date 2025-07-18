import type { Request, Response } from 'express';
import type { ServiceService } from '../services/service.service.ts';

export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  createService = async (req: Request, res: Response): Promise<any> => {
    try {
      const providerId = req.user?.id;
      if (!providerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const serviceData = req.body;
      const result = await this.serviceService.createService(
        providerId,
        serviceData
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
