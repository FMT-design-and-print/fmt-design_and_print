import { CURRENCY_SYMBOL } from "@/lib/constants";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: CURRENCY_SYMBOL,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return "Invalid date";
  }
};
