import { Role } from "./roles";

export interface IAdminUser {
  id: string;
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  avatar?: string | null;
  role?: Role;
  confirmed: boolean;
}

export type ActivityAction = 
  | "CREATE" 
  | "UPDATE" 
  | "DELETE" 
  | "RECORD_PAYMENT" 
  | "PRINT_RECEIPT" 
  | "LOGIN"
  | "LOGOUT"
  | "PASSWORD_RESET";

export type ActivityEntityType = 
  | "SALE" 
  | "EXPENSE" 
  | "CUSTOMER" 
  | "PRODUCT_CATEGORY" 
  | "PRODUCT_TYPE" 
  | "AUTH"
  | "ORDER"
  | "CUSTOM_ORDER";

export interface IActivityLog {
  id: string;
  action: ActivityAction | string;
  entity_type: ActivityEntityType | string;
  entity_id?: string;
  description: string;
  metadata?: Record<string, any>;
  user_details?: {
    userId?: string;
    name?: string;
    role?: string;
    image?: string;
  };
  created_at: string;
}
