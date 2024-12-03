import { PaymentMethod } from ".";

export interface Receipt {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  date: string;
  items: ReceiptItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "paid" | "pending" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
  createdBy: {
    userId: string;
    name: string;
    email: string;
    role: string;
    image: string;
  };
}

export interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
