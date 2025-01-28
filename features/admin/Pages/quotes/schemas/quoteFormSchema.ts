import { z } from "zod";

export const ARTWORK_OPTIONS = {
  OWN: "own-artwork",
  FMT: "fmt-to-provide",
  NONE: "no-artwork-needed",
} as const;

export const RECEPTION_MEDIUMS = {
  EMAIL: "email",
  SMS: "sms",
  WHATSAPP: "whatsapp",
} as const;

export const quoteFormSchema = z
  .object({
    type: z.enum(["quote", "invoice"]),
    title: z.string().min(1, "Title is required"),
    clientName: z.string().min(2, "Client name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    contact: z
      .string()
      .regex(/^\+?[\d\s-]{8,}$/, "Invalid phone number format"),
    dueDate: z.date().min(new Date(), "Due date cannot be in the past"),
    items: z
      .array(
        z.object({
          id: z.string(),
          description: z.string(),
          quantity: z.number().positive("Quantity must be greater than 0"),
          unitPrice: z.number().positive("Unit price must be greater than 0"),
          totalAmount: z.number(),
        })
      )
      .min(1, "At least one item is required"),
    estimatedFulfillmentDate: z.date(),
    itemTypes: z.array(z.string()).min(1, "At least one item type is required"),
    contactName: z.string().min(1, "Contact name is required"),
    phone: z.string().regex(/^\+?[\d\s-]{8,}$/, "Invalid phone number format"),
    note: z.string().optional(),
    orderDetails: z
      .array(
        z.object({
          key: z.string().min(1),
          value: z.string().min(1),
        })
      )
      .refine(
        (details) => {
          const keys = details.map((d) => d.key.toLowerCase());
          return new Set(keys).size === keys.length;
        },
        { message: "Field names must be unique" }
      ),
    artworkOption: z.enum([
      ARTWORK_OPTIONS.OWN,
      ARTWORK_OPTIONS.FMT,
      ARTWORK_OPTIONS.NONE,
    ]),
    artworkFiles: z.array(z.any()).optional(),
    receptionMedium: z.enum([
      RECEPTION_MEDIUMS.EMAIL,
      RECEPTION_MEDIUMS.SMS,
      RECEPTION_MEDIUMS.WHATSAPP,
    ]),
    receptionValue: z.string().refine((val) => {
      if (!val) return false;
      return true;
    }, "Reception value is required"),
  })
  .refine(
    (data) => {
      if (data.receptionMedium === RECEPTION_MEDIUMS.EMAIL) {
        return (
          /^\S+@\S+\.\S+$/.test(data.receptionValue) || "Invalid email format"
        );
      } else if (
        [RECEPTION_MEDIUMS.SMS, RECEPTION_MEDIUMS.WHATSAPP].includes(
          data.receptionMedium
        )
      ) {
        return (
          /^\+?[\d\s-]{8,}$/.test(data.receptionValue) ||
          "Invalid phone number format"
        );
      }
      return true;
    },
    {
      message: "Invalid format for the selected reception medium",
      path: ["receptionValue"],
    }
  );

export type QuoteFormValues = z.infer<typeof quoteFormSchema>;
