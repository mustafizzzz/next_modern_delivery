import { Schema, model, models, Document } from 'mongoose';

export interface Order extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  area: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  status: 'pending' | 'assigned' | 'picked' | 'delivered' | 'failed';
  scheduledFor: string; // HH:mm
  assignedTo?: string; // DeliveryPartner ID
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<Order>({
  orderNumber: { type: String, required: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  area: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  status: { type: String, enum: ['pending', 'assigned', 'picked', 'delivered', 'failed'], default: 'pending' },
  scheduledFor: { type: String, required: true },
  assignedTo: { type: String },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const OrderModel = models.Order || model<Order>('Order', OrderSchema);
