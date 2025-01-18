import { Schema, model, models, Document } from 'mongoose';

export interface DeliveryPartner extends Document {
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  currentLoad: number;
  areas: string[];
  shift: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  metrics: {
    rating: number;
    completedOrders: number;
    cancelledOrders: number;
  };
}

const DeliveryPartnerSchema = new Schema<DeliveryPartner>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], required: true },
  currentLoad: { type: Number, default: 0, max: 3 },
  areas: { type: [String], required: true },
  shift: {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  metrics: {
    rating: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
  },
});

export const DeliveryPartnerModel = models.DeliveryPartner || model<DeliveryPartner>('DeliveryPartner', DeliveryPartnerSchema);
