import { z } from "zod";

export const deliveryPartnerSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be a 10-digit number"),
  status: z.enum(["active", "inactive"]),
  currentLoad: z
    .number()
    .max(3, "Current load cannot exceed 3")
    .default(0),
  areas: z.array(z.string()).min(1, "At least one area is required"),
  shift: z.object({
    start: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Start time must be in HH:mm format"),
    end: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "End time must be in HH:mm format"),
  }),
  metrics: z.object({
    rating: z.number().min(0).max(5).default(0),
    completedOrders: z.number().nonnegative().default(0),
    cancelledOrders: z.number().nonnegative().default(0),
  }),
});
