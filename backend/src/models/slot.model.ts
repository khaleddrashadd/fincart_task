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

SlotSchema.pre<ISlot>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

SlotSchema.methods.toJSON = function () {
  const slot = this.toObject();
  slot.id = slot._id; // Add id field
  delete slot._id; // Remove _id field
  return slot;
};

export const Slot = mongoose.model<ISlot>('Slot', SlotSchema);
