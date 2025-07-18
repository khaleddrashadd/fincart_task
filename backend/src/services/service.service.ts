import {
  createServiceDto,
  ServiceListResponseDto,
  ServiceResponseDto,
  updateServiceDto,
} from '@/dtos/service.dto.ts';
import { Service } from '@/models/service.model.ts';

export class ServiceService {
  async createService(
    providerId: string,
    serviceData: createServiceDto
  ): Promise<ServiceResponseDto> {
    const service = await Service.create({
      ...serviceData,
      providerId,
    });

    const populatedService = await service.populate(
      'providerId',
      'firstName lastName'
    );

    if (!populatedService.providerId) {
      throw new Error('Provider not found');
    }

    const provider = populatedService.providerId as any;

    return {
      id: service.id.toString(),
      description: service.description,
      duration: service.duration,
      price: service.price,
      title: service.title,
      provider: {
        id: provider._id.toString(),
        firstName: provider.firstName,
        lastName: provider.lastName,
      },
    };
  }

  async updateService(
    serviceId: string,
    updateData: updateServiceDto
  ): Promise<ServiceResponseDto | null> {
    const service = await Service.findByIdAndUpdate(serviceId, updateData, {
      new: true,
    });

    if (!service) {
      return null;
    }

    const populatedService = await service.populate(
      'providerId',
      'firstName lastName'
    );

    if (!populatedService.providerId) {
      throw new Error('Provider not found');
    }

    const provider = populatedService.providerId as any;

    return {
      id: service.id.toString(),
      description: service.description,
      duration: service.duration,
      price: service.price,
      title: service.title,
      provider: {
        id: provider._id.toString(),
        firstName: provider.firstName,
        lastName: provider.lastName,
      },
    };
  }

  async getServiceById(serviceId: string): Promise<ServiceResponseDto | null> {
    const service = await Service.findById(serviceId).populate(
      'providerId',
      'firstName lastName'
    );

    if (!service) {
      return null;
    }

    if (!service.providerId) {
      throw new Error('Provider not found');
    }

    const provider = service.providerId as any;

    return {
      id: service.id.toString(),
      description: service.description,
      duration: service.duration,
      price: service.price,
      title: service.title,
      provider: {
        id: provider._id.toString(),
        firstName: provider.firstName,
        lastName: provider.lastName,
      },
    };
  }

  async listServices(
    providerId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ServiceListResponseDto> {
    const services = await Service.find({ providerId })
      .populate('providerId', 'firstName lastName')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Service.countDocuments({ providerId });

    const formattedServices: ServiceResponseDto[] = services.map((service) => {
      if (!service.providerId) {
        throw new Error('Provider not found for service');
      }

      const provider = service.providerId as any;

      return {
        id: service.id.toString(),
        description: service.description,
        duration: service.duration,
        price: service.price,
        title: service.title,
        provider: {
          id: provider._id.toString(),
          firstName: provider.firstName,
          lastName: provider.lastName,
        },
      };
    });

    return {
      services: formattedServices,
      total,
      page,
      limit,
    };
  }

  async deleteService(serviceId: string): Promise<boolean> {
    const result = await Service.findByIdAndDelete(serviceId);
    return !!result;
  }
}
