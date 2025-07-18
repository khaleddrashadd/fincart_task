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
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in minutes
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.pre<IService>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

ServiceSchema.methods.toJSON = function () {
  const service = this.toObject();
  service.id = service._id; // Add id field
  delete service._id; // Remove _id field
  return service;
};

export const Service = mongoose.model<IService>('Service', ServiceSchema);
