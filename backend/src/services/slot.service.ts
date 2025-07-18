import type {
  createSlotDto,
  SlotListResponseDto,
  SlotResponseDto,
  updateSlotDto,
} from '../dtos/slot.dto.ts';
import { Slot } from '../models/slot.model.ts';

export class SlotService {
  async createSlot(
    providerId: string,
    slotData: createSlotDto
  ): Promise<SlotResponseDto> {
    const slot = await Slot.create({
      ...slotData,
      providerId,
    });

    const populatedSlot = await Slot.findById(slot._id)
      .populate('providerId', 'firstName lastName')
      .populate('serviceId', 'title description duration price');

    if (
      !populatedSlot ||
      !populatedSlot.providerId ||
      !populatedSlot.serviceId
    ) {
      throw new Error('Provider or Service not found');
    }

    const provider = populatedSlot.providerId as any;
    const service = populatedSlot.serviceId as any;

    return {
      id: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: slot.isBooked,
      provider,
      service,
      isExpired: slot.endTime < new Date(),
    };
  }

  async updateSlot(
    slotId: string,
    updateData: updateSlotDto
  ): Promise<SlotResponseDto | null> {
    const slot = await Slot.findByIdAndUpdate(slotId, updateData, {
      new: true,
    });

    if (!slot) {
      return null;
    }

    const populatedSlot = await Slot.findById(slot._id)
      .populate('providerId', 'firstName lastName')
      .populate('serviceId', 'title description duration price');

    if (
      !populatedSlot ||
      !populatedSlot.providerId ||
      !populatedSlot.serviceId
    ) {
      throw new Error('Provider or Service not found');
    }

    const provider = populatedSlot.providerId as any;
    const service = populatedSlot.serviceId as any;

    return {
      id: slot.id.toString(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: slot.isBooked,
      provider,
      service,
      isExpired: slot.endTime < new Date(),
    };
  }

  async getSlotById(slotId: string): Promise<SlotResponseDto | null> {
    const slot = await Slot.findById(slotId)
      .populate('providerId', 'firstName lastName')
      .populate('serviceId', 'title description duration price');

    if (!slot) {
      return null;
    }

    if (!slot.providerId || !slot.serviceId) {
      throw new Error('Provider or Service not found');
    }

    const provider = slot.providerId as any;
    const service = slot.serviceId as any;

    return {
      id: slot.id.toString(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: slot.isBooked,
      provider,
      service,
      isExpired: slot.endTime < new Date(),
    };
  }

  async listSlots(
    providerId: string,
    serviceId?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<SlotListResponseDto> {
    const query = Slot.find({ providerId });

    if (serviceId) {
      query.where('serviceId').equals(serviceId);
    }

    const slots = await query
      .populate('providerId', 'firstName lastName')
      .populate('serviceId', 'title description duration price')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Slot.countDocuments({ providerId });

    const formattedSlots: SlotResponseDto[] = slots.map((slot) => {
      if (!slot.providerId || !slot.serviceId) {
        throw new Error('Provider or Service not found for slot');
      }

      const provider = slot.providerId as any;
      const service = slot.serviceId as any;

      return {
        id: slot.id.toString(),
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: slot.isBooked,
        provider,
        service,
        isExpired: slot.endTime < new Date(),
      };
    });

    return {
      slots: formattedSlots,
      total,
      page,
      limit,
    };
  }
  async deleteSlot(slotId: string): Promise<boolean> {
    const result = await Slot.findByIdAndDelete(slotId);
    return !!result;
  }

  async mySlots(
    providerId: string,
    limit: number = 10,
    page: number = 1,
    isBooked: boolean | undefined = false
  ) {
    let query = Slot.find({ providerId });
    if (isBooked !== undefined) {
      query = query.where('isBooked').equals(isBooked);
    }
    const slots = await query
      .populate('providerId', 'firstName lastName')
      .populate('serviceId', 'title description duration price')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Slot.countDocuments({ providerId });

    const formattedSlots: SlotResponseDto[] = slots.map((slot) => {
      if (!slot.providerId || !slot.serviceId) {
        throw new Error('Provider or Service not found for slot');
      }

      const provider = slot.providerId as any;
      const service = slot.serviceId as any;

      return {
        id: slot.id.toString(),
        startTime: slot.startTime,
        endTime: slot.endTime,
        isBooked: slot.isBooked,
        provider,
        service,
        isExpired: slot.endTime < new Date(),
      };
    });

    return {
      slots: formattedSlots,
      total,
      page,
      limit,
    };
  }
}
