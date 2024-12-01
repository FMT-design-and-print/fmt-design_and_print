import { DiscountType, PaymentMethod } from "./";

type UserDetails = {
  userId: string;
  name: string;
  email: string;
  role: string;
  image: string;
};

export interface ISales {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  productType: string;
  description: string;
  unitPrice: number;
  quantity: number;
  discount?: {
    type: DiscountType;
    value: number;
  };
  totalAmount: number;
  paymentMethods: PaymentMethod[];
  notes?: string;
  createdBy: UserDetails;
}

export interface Expenses {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  description: string;
  amount: number;
  type: string;
  paymentMethods: PaymentMethod[];
  approver: string;
  notes?: string;
  createdBy: UserDetails;
}
