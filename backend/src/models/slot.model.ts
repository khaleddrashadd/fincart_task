import mongoose, { Schema, Document } from 'mongoose';

export interface ISlot extends Document {
  _id: string;
  serviceId: string; // Reference to the service
  providerId: string; // Reference to the provider (User)
  startTime: Date;
  endTime: Date;
  isBooked: boolean;
  createdAt: Date;
  updatedAt: Date;
  toJSON: () => Omit<ISlot, '_id' | '__v'>;
}

const SlotSchema: Schema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    // Service relationship (One-to-Many: Service -> TimeSlots)
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },

    // Provider relationship (for easier querying)
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isBooked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

SlotSchema.pre<ISlot>('save', async function (next) {
  this.updatedAt = new Date();

  // Normalize startTime and endTime to UTC
  if (this.startTime) {
    this.startTime = new Date(this.startTime.toISOString());
  }
  if (this.endTime) {
    this.endTime = new Date(this.endTime.toISOString());
  }

  // Validate that slot duration doesn't exceed service duration
  const slotDurationInMinutes = Math.round(
    (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60)
  );

  // Fetch the associated service to get its duration
  const Service = mongoose.model('Service');
  const service = await Service.findById(this.serviceId);

  if (!service) {
    return next(new Error('Associated service not found'));
  }

  if (slotDurationInMinutes > service.duration) {
    return next(
      new Error(
        `Slot duration (${slotDurationInMinutes} minutes) cannot exceed service duration (${service.duration} minutes)`
      )
    );
  }

  if (slotDurationInMinutes <= 0) {
    return next(new Error('Slot end time must be after start time'));
  }

  next();
});

// Validator for updates (findOneAndUpdate, findByIdAndUpdate, etc.)
SlotSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'updateMany'],
  async function (next) {
    const update = this.getUpdate() as any;

    // Only validate if startTime or endTime are being updated
    if (update.startTime || update.endTime) {
      const docToUpdate = await this.model.findOne(this.getQuery());

      if (!docToUpdate) {
        return next(new Error('Slot not found'));
      }

      // Normalize to UTC if being updated
      const startTime = update.startTime
        ? new Date(new Date(update.startTime).toISOString())
        : docToUpdate.startTime;
      const endTime = update.endTime
        ? new Date(new Date(update.endTime).toISOString())
        : docToUpdate.endTime;

      const slotDurationInMinutes = Math.round(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60)
      );

      // Fetch the associated service to get its duration
      const Service = mongoose.model('Service');
      const serviceId = update.serviceId || docToUpdate.serviceId;
      const service = await Service.findById(serviceId);

      if (!service) {
        return next(new Error('Associated service not found'));
      }

      if (slotDurationInMinutes > service.duration) {
        return next(
          new Error(
            `Slot duration (${slotDurationInMinutes} minutes) cannot exceed service duration (${service.duration} minutes)`
          )
        );
      }

      if (slotDurationInMinutes <= 0) {
        return next(new Error('Slot end time must be after start time'));
      }
    }

    next();
  }
);

SlotSchema.methods.toJSON = function () {
  const slot = this.toObject();
  slot.id = slot._id; // Add id field
  delete slot._id; // Remove _id field
  return slot;
};

export const Slot = mongoose.model<ISlot>('Slot', SlotSchema);
