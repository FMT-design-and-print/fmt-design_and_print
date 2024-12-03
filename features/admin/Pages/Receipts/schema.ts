import { z } from "zod";

export const receiptItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Price must be greater than or equal to 0"),
  total: z.number(),
});

export const receiptFormSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerAddress: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  items: z.array(receiptItemSchema).min(1, "At least one item is required"),
  subtotal: z.number(),
  taxRate: z.number().min(0).max(100),
  taxAmount: z.number(),
  totalAmount: z.number(),
  paymentMethod: z.enum([
    "Cash",
    "Bank Transfer",
    "Mobile Money",
    "Credit Card",
  ] as const),
  paymentStatus: z.enum(["paid", "pending", "cancelled"] as const),
  notes: z.string().optional(),
});

export type ReceiptFormData = z.infer<typeof receiptFormSchema>;
