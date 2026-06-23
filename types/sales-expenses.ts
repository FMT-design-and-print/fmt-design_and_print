import { DiscountType, PaymentMethod } from "./";

type UserDetails = {
  userId: string;
  name: string;
  email: string;
  role: string;
  image: string;
};

export interface ISalesItem {
  id?: string;
  productType: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
}

export interface ISales {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  productType?: string; // Legacy
  description?: string; // Legacy
  unitPrice?: number; // Legacy
  quantity?: number; // Legacy
  items?: ISalesItem[]; // New Multi-item structure
  discount?: {
    type: DiscountType;
    value: number;
  };
  totalAmount: number;
  amountPaid?: number;
  balanceDue?: number;
  tip_amount?: number;
  customer_id?: string;
  paymentMethods: PaymentMethod[];
  notes?: string;
  isDeleted?: boolean;
  createdBy: UserDetails;
  updatedBy?: UserDetails;
}

export interface Expenses {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  description: string;
  amount: number;
  type: string;
  isBadDebt?: boolean;
  is_bad_debt?: boolean;
  badDebtReference?: string;
  bad_debt_reference?: string;
  paymentMethods: PaymentMethod[];
  approver: string;
  notes?: string;
  isDeleted?: boolean;
  createdBy: UserDetails;
  updatedBy?: UserDetails;
}

export interface ICustomer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  total_spent?: number;
  total_debt?: number;
  isDeleted?: boolean;
  createdBy?: UserDetails;
  updatedBy?: UserDetails;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface IPaymentHistory {
  id: string;
  customer_id?: string;
  reference_type: "sales" | "orders" | "custom-orders";
  reference_id: string;
  amount_paid: number;
  payment_method?: string;
  payment_date: Date | string;
  notes?: string;
  isDeleted?: boolean;
  createdBy?: UserDetails;
  updatedBy?: UserDetails;
}

export interface ICustomProductType {
  id: string;
  name: string;
  category?: string;
  category_id?: string;
  is_active: boolean;
  isDeleted?: boolean;
  createdBy?: UserDetails;
  updatedBy?: UserDetails;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ICustomProductCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  isDeleted?: boolean;
  createdBy?: UserDetails;
  updatedBy?: UserDetails;
  created_at: Date | string;
  updated_at: Date | string;
}
