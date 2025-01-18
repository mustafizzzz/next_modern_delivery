import { z } from "zod";

export const AssignmentMetricsZod = z.object({
  totalAssigned: z.number(),
  successRate: z.number(),
  averageTime: z.number(),
  failureReasons: z.array(z.object({
    reason: z.string(),
    count: z.number()
  }))
});
