import { ICartItem, IShippingAddress, PaymentType } from ".";

export type OrderStatus =
  | "pending"
  | "placed"
  | "processing"
  | "shipped"
  | "delivered"
  | "packaging"
  | "ready"
  | "completed"
  | "pending-cancellation"
  | "cancelled"
  | "requested";

export type DeliveryType = "pickup" | "delivery";
export type PaymentStatus = "unpaid" | "paid" | "partly-paid" | "failed";

export type IOrderItem = ICartItem;
interface CommonOrderDetails {
  id: string;
  created_at: Date;
  updated_at?: Date;
  orderId: string;
  totalAmount: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  deliveryDetails: IShippingAddress;
  coupon_id?: string;
  reference?: string;
  user_id: string;
  estimatedFulfillmentDate?: Date;
  paymentType: PaymentType;
  deliveryFee?: number;
  paymentStatus?: PaymentStatus;
}

export interface IOrder extends CommonOrderDetails {
  items: IOrderItem[];
  note?: string;
}

export interface ICustomOrder extends CommonOrderDetails {
  itemTypes: string[];
  orderDetails: object;
  contactName: string;
  phone: string;
  email: string;
  amountPaid?: number;
}
