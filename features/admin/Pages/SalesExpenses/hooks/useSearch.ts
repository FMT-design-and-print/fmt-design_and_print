import { Expenses, ISales } from "@/types/sales-expenses";
import { useDebouncedValue } from "@mantine/hooks";
import { useMemo } from "react";

function sortByDate<T extends { created_at: string | Date }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function useSalesSearch(sales: ISales[], searchTerm: string) {
  const [debouncedSearch] = useDebouncedValue(searchTerm, 1000);

  const filteredSales = useMemo(() => {
    const sortedSales = sortByDate(sales);
    if (!debouncedSearch) return sortedSales;

    const searchLower = debouncedSearch.toLowerCase();
    return sortedSales.filter(
      (sale) =>
        sale.description.toLowerCase().includes(searchLower) ||
        sale.productType.toLowerCase().includes(searchLower)
    );
  }, [sales, debouncedSearch]);

  return { filteredSales };
}

export function useExpensesSearch(expenses: Expenses[], searchTerm: string) {
  const [debouncedSearch] = useDebouncedValue(searchTerm, 1000);

  const filteredExpenses = useMemo(() => {
    const sortedExpenses = sortByDate(expenses);
    if (!debouncedSearch) return sortedExpenses;

    const searchLower = debouncedSearch.toLowerCase();
    return sortedExpenses.filter(
      (expense) =>
        expense.description.toLowerCase().includes(searchLower) ||
        expense.type.toLowerCase().includes(searchLower)
    );
  }, [expenses, debouncedSearch]);

  return { filteredExpenses };
}
