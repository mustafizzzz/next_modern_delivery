import { Schema, model, models, Document } from 'mongoose';

export interface Assignment extends Document {
  orderId: string;
  partnerId: string;
  timestamp: Date;
  status: 'success' | 'failed';
  reason?: string;
}

const AssignmentSchema = new Schema<Assignment>({
  orderId: { type: String, required: true },
  partnerId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['success', 'failed'], required: true },
  reason: { type: String },
});

export const AssignmentModel = models.Assignment || model<Assignment>('Assignment', AssignmentSchema);
