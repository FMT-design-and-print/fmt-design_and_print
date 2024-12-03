/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOrders, useCustomOrders } from "@/hooks/admin/useOrders";
import { useSales } from "@/hooks/admin/useSales";
import { useExpenses } from "@/hooks/admin/useExpenses";
import { IOrder, ICustomOrder, OrderStatus } from "@/types/order";
import { ISales, Expenses } from "@/types/sales-expenses";
import { FilterValues } from "../components/Filters";
import { useMemo } from "react";

type FilterableData = IOrder | ICustomOrder | ISales | Expenses;
type DataType = "regularOrders" | "customOrders" | "sales" | "expenses";

const INACTIVE_STATUSES: OrderStatus[] = [
  "pending",
  "requested",
  "pending-cancellation",
  "cancelled",
] as const;

export const useDashboardData = (filters?: FilterValues) => {
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: customOrders, isLoading: customOrdersLoading } =
    useCustomOrders();
  const { data: sales, isLoading: salesLoading } = useSales();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();

  const regularOrders = useMemo(() => {
    return (orders || []).filter(
      (order) => !("itemTypes" in order)
    ) as IOrder[];
  }, [orders]);

  const customerOrders = useMemo(() => {
    return (customOrders || []).filter(
      (order) => "itemTypes" in order
    ) as ICustomOrder[];
  }, [customOrders]);

  const filterData = <T extends FilterableData>(
    data: T[] | undefined,
    type: DataType
  ): T[] => {
    if (!data) return [];
    let filtered = [...data];

    if (type === "regularOrders" || type === "customOrders") {
      filtered = filtered.filter(
        (item) => "status" in item && !INACTIVE_STATUSES.includes(item.status)
      );
    }

    if (filters?.dateRange[0] && filters?.dateRange[1]) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.created_at) >= filters.dateRange[0]! &&
          new Date(item.created_at) <= filters.dateRange[1]!
      );
    }

    if (filters?.type !== "all") {
      switch (type) {
        case "regularOrders":
          filtered = filtered.filter(() => filters?.type === "orders");
          break;
        case "customOrders":
          filtered = filtered.filter(() => filters?.type === "customOrders");
          break;
        case "sales":
          filtered = filtered.filter(() => filters?.type === "manualSales");
          break;
      }
    }

    if (
      filters?.status &&
      (type === "regularOrders" || type === "customOrders")
    ) {
      filtered = filtered.filter(
        (item) => "status" in item && item.status === filters.status
      );
    }

    if (filters?.deliveryType && type === "regularOrders") {
      filtered = filtered.filter(
        (item) =>
          "deliveryType" in item && item.deliveryType === filters.deliveryType
      );
    }

    return filtered;
  };

  const calculateTotalRevenue = () => {
    if (filters?.type === "all") {
      const regularOrdersRevenue = filterData(
        regularOrders,
        "regularOrders"
      ).reduce((acc, order) => acc + order.totalAmount, 0);

      const customOrdersRevenue = filterData(
        customerOrders,
        "customOrders"
      ).reduce((acc, order) => acc + order.totalAmount, 0);

      const salesRevenue = filterData(sales, "sales").reduce(
        (acc, sale) => acc + sale.totalAmount,
        0
      );

      return regularOrdersRevenue + customOrdersRevenue + salesRevenue;
    }

    switch (filters?.type) {
      case "orders":
        return filterData(regularOrders, "regularOrders").reduce(
          (acc, order) => acc + order.totalAmount,
          0
        );
      case "customOrders":
        return filterData(customerOrders, "customOrders").reduce(
          (acc, order) => acc + order.totalAmount,
          0
        );
      case "manualSales":
        return filterData(sales, "sales").reduce(
          (acc, sale) => acc + sale.totalAmount,
          0
        );
      default:
        return 0;
    }
  };

  const calculateTotalExpenses = () => {
    if (filters?.type !== "all") return 0;

    return filterData(expenses, "expenses").reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
  };

  return {
    totalRevenue: calculateTotalRevenue(),
    totalExpenses: calculateTotalExpenses(),
    totalProfit:
      filters?.type === "all"
        ? calculateTotalRevenue() - calculateTotalExpenses()
        : calculateTotalRevenue(),
    isLoading:
      ordersLoading || customOrdersLoading || salesLoading || expensesLoading,
    error: null,
    orders: filterData(regularOrders, "regularOrders"),
    customOrders: filterData(customerOrders, "customOrders"),
    sales: filterData(sales, "sales"),
    expenses: filterData(expenses, "expenses"),
  };
};
