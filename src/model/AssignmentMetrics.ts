import { Schema, model, models, Document } from 'mongoose';

export interface AssignmentMetrics extends Document {
  totalAssigned: number;
  successRate: number;
  averageTime: number;
  failureReasons: {
    reason: string;
    count: number;
  }[];
}

const AssignmentMetricsSchema = new Schema<AssignmentMetrics>({
  totalAssigned: { type: Number, required: true },
  successRate: { type: Number, required: true },
  averageTime: { type: Number, required: true },
  failureReasons: [
    {
      reason: { type: String, required: true },
      count: { type: Number, required: true },
    },
  ],
});

export const AssignmentMetricsModel = models.AssignmentMetrics || model<AssignmentMetrics>('AssignmentMetrics', AssignmentMetricsSchema);
