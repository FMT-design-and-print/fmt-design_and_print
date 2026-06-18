import { Expenses, ISales, ICustomer } from "@/types/sales-expenses";
import { useDebouncedValue } from "@mantine/hooks";
import { useMemo } from "react";

function sortByDate<T extends { created_at: string | Date }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function useSalesSearch(sales: ISales[], searchTerm: string, customers?: ICustomer[]) {
  const [debouncedSearch] = useDebouncedValue(searchTerm, 500);

  const filteredSales = useMemo(() => {
    const sortedSales = sortByDate(sales);
    if (!debouncedSearch) return sortedSales;

    const searchLower = debouncedSearch.toLowerCase();
    
    return sortedSales.filter((sale) => {
      // Find customer name for searching
      const customer = customers?.find(c => c.id === sale.customer_id);
      const customerName = customer?.name || "walk-in";

      // Combine all search fields into one big searchable string
      const aggregatedString = [
        sale.description || "",
        sale.productType || "",
        sale.items?.map(i => `${i.productType} ${i.description || ""}`).join(" ") || "",
        sale.createdBy.name || "",
        sale.createdBy.email || "",
        customerName,
        sale.totalAmount?.toString() || "",
        sale.notes || "",
        sale.paymentMethods?.join(" ") || ""
      ].join(" ").toLowerCase();

      return aggregatedString.includes(searchLower);
    });
  }, [sales, debouncedSearch, customers]);

  return { filteredSales };
}

export function useExpensesSearch(expenses: Expenses[], searchTerm: string) {
  const [debouncedSearch] = useDebouncedValue(searchTerm, 500);

  const filteredExpenses = useMemo(() => {
    const sortedExpenses = sortByDate(expenses);
    if (!debouncedSearch) return sortedExpenses;

    const searchLower = debouncedSearch.toLowerCase();
    
    return sortedExpenses.filter((expense) => {
      // Combine all search fields into one big searchable string
      const aggregatedString = [
        expense.description || "",
        expense.type || "",
        expense.approver || "",
        expense.createdBy.name || "",
        expense.createdBy.email || "",
        expense.amount?.toString() || "",
        expense.notes || "",
        expense.paymentMethods?.join(" ") || "",
        expense.badDebtReference || ""
      ].join(" ").toLowerCase();

      return aggregatedString.includes(searchLower);
    });
  }, [expenses, debouncedSearch]);

  return { filteredExpenses };
}
