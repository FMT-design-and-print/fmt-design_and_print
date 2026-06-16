import { CURRENCY_SYMBOL } from "@/lib/constants";
import { format, parseISO, isValid } from "date-fns";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY_SYMBOL,
  }).format(amount || 0);
};

export const formatDate = (date: Date | string): string => {
  try {
    if (!date) return "Invalid date";
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) {
      return "Invalid date";
    }
    return format(dateObj, "MMM d, yyyy");
  } catch (error) {
    return "Invalid date";
  }
};
