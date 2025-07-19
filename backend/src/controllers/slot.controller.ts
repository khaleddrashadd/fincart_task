import type { Request, Response } from 'express';
import type { SlotService } from '../services/slot.service.ts';

export class SlotController {
  constructor(private slotService: SlotService) {}

  createSlot = async (req: Request, res: Response): Promise<any> => {
    try {
      const providerId = req.user?.id;
      if (!providerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const slotData = req.body;
      const dateNow = new Date();
      if (
        new Date(slotData.startTime) < dateNow ||
        new Date(slotData.endTime) < dateNow
      ) {
        return res.status(400).json({
          success: false,
          message: 'Start time and end time must be in the future',
        });
      }
      const result = await this.slotService.createSlot(providerId, slotData);
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
  updateSlot = async (req: Request, res: Response): Promise<any> => {
    try {
      const slotId = req.params.id as string;
      if (!slotId) {
        return res.status(400).json({
          success: false,
          message: 'Slot ID is required',
        });
      }
      const updateData = req.body;
      const result = await this.slotService.updateSlot(slotId, updateData);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Slot not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Slot updated successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
  getSlotById = async (req: Request, res: Response): Promise<any> => {
    try {
      const slotId = req.params.id as string;
      if (!slotId) {
        return res.status(400).json({
          success: false,
          message: 'Slot ID is required',
        });
      }
      const result = await this.slotService.getSlotById(slotId);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Slot not found',
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
  listSlots = async (req: Request, res: Response): Promise<any> => {
    try {
      const serviceId = req.query.serviceId as string;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await this.slotService.listSlots(serviceId, page, limit);
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
  deleteSlot = async (req: Request, res: Response): Promise<any> => {
    try {
      const slotId = req.params.id as string;
      if (!slotId) {
        return res.status(400).json({
          success: false,
          message: 'Slot ID is required',
        });
      }
      const result = await this.slotService.deleteSlot(slotId);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Slot not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Slot deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  mySlots = async (req: Request, res: Response): Promise<any> => {
    try {
      const providerId = req.user?.id;
      if (!providerId) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      const isBooked = req.query.isBooked === 'true';
      const result = await this.slotService.mySlots(
        providerId,
        limit,
        page,
        isBooked
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
}
