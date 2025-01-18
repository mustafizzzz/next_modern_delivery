import { z } from "zod";

export const orderSchema = z.object({
  orderNumber: z.string().nonempty("Order number is required"),
  customer: z.object({
    name: z.string().nonempty("Customer name is required"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone must be a 10-digit number"),
    address: z.string().nonempty("Address is required"),
  }),
  area: z.string().nonempty("Area is required"),
  items: z.array(
    z.object({
      name: z.string().nonempty("Item name is required"),
      quantity: z.number().positive("Quantity must be greater than 0"),
      price: z.number().positive("Price must be greater than 0"),
    })
  ),
  status: z.enum(["pending", "assigned", "picked", "delivered"]),
  scheduledFor: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Scheduled time must be in HH:mm format"),
  assignedTo: z.string().optional(),
  totalAmount: z.number().positive("Total amount must be greater than 0"),
});
