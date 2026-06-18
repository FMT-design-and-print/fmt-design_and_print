import { DatesRangeValue } from "@mantine/dates";
import { useMemo } from "react";
import { ISales, Expenses } from "@/types/sales-expenses";
import { SalesFilters, ExpensesFilters } from "@/store/salesExpenses";

export interface AmountFilter {
  type: "exact" | "less" | "greater";
  value: number | null;
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

function isWithinDateRange(date: Date, range: DatesRangeValue): boolean {
  if (!range[0]) return true; // If no start date, don't filter
  const itemDate = new Date(date);
  const start = startOfDay(range[0]);
  // If end date is not selected yet, assume the user wants to filter for just the start day
  const end = range[1] ? endOfDay(range[1]) : endOfDay(range[0]);
  return itemDate >= start && itemDate <= end;
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

export function useSalesFilters(items: ISales[], filters: SalesFilters, searchResults: ISales[]) {
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
      if (
        item.totalAmount !== undefined &&
        filters.amount &&
        !matchesAmountFilter(item.totalAmount, filters.amount)
      ) {
        return false;
      }

      // Product Type filter
      if (filters.productType && item.productType !== filters.productType && !item.items?.some(i => i.productType === filters.productType)) {
        return false;
      }

      // Payment Status filter
      if (filters.paymentStatus) {
        const isPaid = (item.balanceDue || 0) === 0;
        if (filters.paymentStatus === "paid" && !isPaid) return false;
        if (filters.paymentStatus === "unpaid" && isPaid) return false;
      }

      return true;
    });
  }, [filters, searchResults]);
}

export function useExpensesFilters(items: Expenses[], filters: ExpensesFilters, searchResults: Expenses[]) {
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
      if (
        item.amount !== undefined &&
        filters.amount &&
        !matchesAmountFilter(item.amount, filters.amount)
      ) {
        return false;
      }

      // Expense Type filter
      if (filters.expenseType && item.type !== filters.expenseType) {
        return false;
      }

      // Approver filter
      if (filters.approver && item.approver !== filters.approver) {
        return false;
      }

      // Bad Debt filter
      if (filters.isBadDebt !== null && !!item.isBadDebt !== filters.isBadDebt && !!item.is_bad_debt !== filters.isBadDebt) {
        return false;
      }

      return true;
    });
  }, [filters, searchResults]);
}
