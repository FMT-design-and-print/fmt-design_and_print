/* eslint-disable @typescript-eslint/no-explicit-any */
export type QuoteStatus =
  | "created"
  | "active"
  | "paid"
  | "cancelled"
  | "expired";

export interface QuoteErrors {
  title?: string;
  number?: string;
  items: { [index: number]: { [field: string]: string } };
}

export interface IQuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface IQuote {
  id: string;
  created_at: Date;
  updated_at?: Date;
  dueDate: Date;
  order_id: string;
  quoteNumber: number | string;
  totalAmount: number;
  title: string;
  status: QuoteStatus;
  items: IQuoteItem[];
  clientName?: string;
  contact?: string;
  email?: string;

  revisionReasons?: string[];
  reactivationReasons?: string[];
  numberOfRevisionsRequested: number;
  numberOfReactivationRequested: number;
  requestPayment: boolean;
  type: "quote" | "invoice";
  orderDetails?: {
    quoteReceptionMedium?: "email" | "whatsapp" | "sms";
    quoteReceptionValue?: string;
    [key: string]: any;
  };

  // ---------------
  note?: {
    paymentDetails?: string;
    AdditionalInformation?: string;
    thankYou?: string;
  };
  showDueDate?: boolean;
  requiresDelivery?: boolean;
  acceptCOD?: boolean;
  paymentPercentage: number;
}
