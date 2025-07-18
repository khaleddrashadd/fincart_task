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

  updateService = async (req: Request, res: Response): Promise<any> => {
    try {
      const serviceId = req.params.id as string;
      if (!serviceId) {
        return res.status(400).json({
          success: false,
          message: 'Service ID is required',
        });
      }
      const updateData = req.body;
      const result = await this.serviceService.updateService(
        serviceId,
        updateData
      );
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Service updated successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  getServiceById = async (req: Request, res: Response): Promise<any> => {
    try {
      const serviceId = req.params.id as string;
      if (!serviceId) {
        return res.status(400).json({
          success: false,
          message: 'Service ID is required',
        });
      }
      const result = await this.serviceService.getServiceById(serviceId);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }
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

  listServices = async (req: Request, res: Response): Promise<any> => {
    try {
      const providerId = req.user?.id;
      if (!providerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.serviceService.listServices(
        providerId,
        page,
        limit
      );
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
  deleteService = async (req: Request, res: Response): Promise<any> => {
    try {
      const serviceId = req.params.id as string;
      if (!serviceId) {
        return res.status(400).json({
          success: false,
          message: 'Service ID is required',
        });
      }
      const result = await this.serviceService.deleteService(serviceId);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Service deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
