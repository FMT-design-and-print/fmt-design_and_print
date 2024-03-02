import { ICartItem, IShippingAddress } from ".";

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
  | "cancelled";

export type DeliveryType = "pickup" | "delivery";

export interface IOrderItem extends ICartItem {}

export interface IOrder {
  id: any;
  created_at: Date;
  completed_at?: Date;
  orderId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  deliveryDetails: IShippingAddress;
  coupon_id?: string;
  reference?: string;
  user_id: string;
  estimatedFulfillmentDate?: Date;
  paymentType: string;
  deliveryFee?: number;
  note?: string;
}
