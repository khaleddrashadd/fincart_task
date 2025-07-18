import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  _id: string;
  providerId: string; // Reference to the provider (User)
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  createdAt: Date;
  updatedAt: Date;
  toJSON: () => Omit<IService, '_id' | '__v'>;
}

const ServiceSchema: Schema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    // Provider relationship (One-to-Many: Provider -> Services)
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number'],
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 minute'],
    }, // in minutes
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.pre<IService>('save', async function (next) {
  this.updatedAt = new Date();

  // Check if duration is being modified and if there are existing slots
  if (this.isModified('duration')) {
    const Slot = mongoose.model('Slot');
    const existingSlots = await Slot.find({ serviceId: this._id });

    // Check each slot to ensure its duration doesn't exceed the new service duration
    for (const slot of existingSlots) {
      const slotDurationInMinutes = Math.round(
        (slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60)
      );

      if (slotDurationInMinutes > this.duration) {
        return next(
          new Error(
            `Cannot update service duration to ${this.duration} minutes. Existing slot has duration of ${slotDurationInMinutes} minutes which exceeds the new service duration.`
          )
        );
      }
    }
  }

  next();
});

// Validator for updates (findOneAndUpdate, findByIdAndUpdate, etc.)
ServiceSchema.pre(
  ['findOneAndUpdate', 'updateOne', 'updateMany'],
  async function (next) {
    const update = this.getUpdate() as any;

    // Only validate if duration is being updated
    if (update.duration !== undefined) {
      const serviceId = this.getQuery()._id;
      const Slot = mongoose.model('Slot');
      const existingSlots = await Slot.find({ serviceId });

      // Check each slot to ensure its duration doesn't exceed the new service duration
      for (const slot of existingSlots) {
        const slotDurationInMinutes = Math.round(
          (slot.endTime.getTime() - slot.startTime.getTime()) / (1000 * 60)
        );

        if (slotDurationInMinutes > update.duration) {
          return next(
            new Error(
              `Cannot update service duration to ${update.duration} minutes. Existing slot has duration of ${slotDurationInMinutes} minutes which exceeds the new service duration.`
            )
          );
        }
      }
    }

    next();
  }
);

ServiceSchema.methods.toJSON = function () {
  const service = this.toObject();
  service.id = service._id; // Add id field
  delete service._id; // Remove _id field
  return service;
};

export const Service = mongoose.model<IService>('Service', ServiceSchema);
