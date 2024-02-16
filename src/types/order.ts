import { ICartItem, IShippingAddress } from ".";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrderItem extends ICartItem {}

export interface IOrder {
  id: any;
  created_at: Date;
  orderId: string;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryDetails: IShippingAddress;
  coupon_id?: string;
  reference?: string;
  user_id: string;
}
