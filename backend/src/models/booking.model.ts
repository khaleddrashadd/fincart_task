import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  slotId: string;
  bookingDate: Date;
  status: 'confirmed' | 'cancelled';
  reminderSent: boolean;
  reminderSentAt?: Date;
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
      ref: 'slot',
      required: true,
      unique: true, // Ensures one booking per time slot
    },

    bookingDate: { type: Date, required: true },
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

BookingSchema.pre<IBooking>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

BookingSchema.methods.toJSON = function () {
  const booking = this.toObject();
  booking.id = booking._id; // Add id field
  delete booking._id; // Remove _id field
  return booking;
};

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
