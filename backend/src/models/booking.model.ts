import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  slotId: string;
  status: 'confirmed' | 'cancelled';
  reminderSent: boolean;
  reminderSentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  toJSON: () => Omit<IBooking, '_id' | '__v'>;
}

const BookingSchema: Schema = new Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Time Slot relationship (One-to-One: TimeSlot -> Booking)
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
      unique: true, // Ensures one booking per time slot
    },

    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },

    reminderSent: { type: Boolean, default: false },
    reminderSentAt: { type: Date },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

BookingSchema.pre<IBooking>('save', async function (next) {
  this.updatedAt = new Date();
  const Slot = mongoose.model('Slot');
  const slot = await Slot.findById(this.slotId);
  if (!slot) {
    return next(new Error('Associated slot not found'));
  }
  slot.isBooked = true;
  await slot.save();
  next();
});

BookingSchema.methods.toJSON = function () {
  const booking = this.toObject();
  booking.id = booking._id; // Add id field
  delete booking._id; // Remove _id field
  return booking;
};

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
