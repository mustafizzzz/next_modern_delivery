import { z } from "zod";

export const assignmentSchema = z.object({
  orderId: z.string().nonempty("Order ID is required"),
  partnerId: z.string().nonempty("Partner ID is required"),
  timestamp: z.date(),
  status: z.enum(["success", "failed"]),
  reason: z.string().optional(),
});
