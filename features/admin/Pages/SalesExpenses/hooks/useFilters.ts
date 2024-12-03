import { DatesRangeValue } from "@mantine/dates";
import { useMemo } from "react";

export interface AmountFilter {
  type: "exact" | "less" | "greater";
  value: number | null;
}

export interface Filters {
  createdBy: string | null;
  dateRange: DatesRangeValue;
  amount: AmountFilter | null;
}

function startOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function endOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

export const initialFilters: Filters = {
  createdBy: null,
  dateRange: [null, null],
  amount: { type: "exact", value: null },
};

function isWithinDateRange(date: Date, range: DatesRangeValue): boolean {
  if (!range[0] || !range[1]) return true;
  const itemDate = new Date(date);
  return itemDate >= startOfDay(range[0]) && itemDate <= endOfDay(range[1]);
}

function matchesAmountFilter(
  amount: number,
  filter: AmountFilter | null
): boolean {
  if (!filter || filter.value === null) return true;

  switch (filter.type) {
    case "exact":
      return amount === filter.value;
    case "less":
      return amount < filter.value;
    case "greater":
      return amount > filter.value;
  }
}

export function useFilters<
  T extends {
    createdBy: { userId: string };
    created_at: string | Date;
    totalAmount?: number;
    amount?: number;
  },
>(items: T[], filters: Filters, searchResults: T[]) {
  return useMemo(() => {
    return searchResults.filter((item) => {
      // Created By filter
      if (filters.createdBy && item.createdBy.userId !== filters.createdBy) {
        return false;
      }

      // Date Range filter
      if (
        filters.dateRange &&
        filters.dateRange[0] &&
        filters.dateRange[1] &&
        !isWithinDateRange(new Date(item.created_at), filters.dateRange)
      ) {
        return false;
      }

      // Amount filter
      const itemAmount = "totalAmount" in item ? item.totalAmount : item.amount;
      if (
        itemAmount !== undefined &&
        filters.amount &&
        !matchesAmountFilter(itemAmount, filters.amount)
      ) {
        return false;
      }

      return true;
    });
  }, [filters, searchResults]);
}
