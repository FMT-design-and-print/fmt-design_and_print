import { QuoteStatus } from "@/types/quote";

export const quoteStatuses: QuoteStatus[] = [
  "active",
  "cancelled",
  "paid",
  "expired",
  "created",
];

export const quoteStatusColors: Record<QuoteStatus, string> = {
  active: "blue",
  cancelled: "red",
  paid: "green",
  expired: "yellow",
  created: "gray",
};

export const quoteStatusLabels: Record<QuoteStatus, string> = {
  active: "Active",
  cancelled: "Cancelled",
  paid: "Paid",
  expired: "Expired",
  created: "Created",
};
