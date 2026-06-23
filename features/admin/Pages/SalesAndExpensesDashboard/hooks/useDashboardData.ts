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

    if (filters?.dateRange && filters.dateRange[0]) {
      // Fix date inclusivity by setting end date to 23:59:59.999
      const startDate = new Date(filters.dateRange[0]);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = filters.dateRange[1] ? new Date(filters.dateRange[1]) : new Date(filters.dateRange[0]);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= startDate && itemDate <= endDate;
      });
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

      const salesRevenue = filterData(sales, "sales")
        .filter(sale => !sale.isDeleted)
        .reduce(
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
        return filterData(sales, "sales")
          .filter(sale => !sale.isDeleted)
          .reduce(
            (acc, sale) => acc + sale.totalAmount,
            0
          );
      default:
        return 0;
    }
  };

  const calculateTotalExpenses = () => {
    if (filters?.type !== "all") return 0;

    return filterData(expenses, "expenses")
      .filter(expense => !expense.isDeleted)
      .reduce(
        (acc, expense) => acc + expense.amount,
        0
      );
  };

  const calculateTotalDebts = () => {
    if (filters?.type === "all") {
      const regularOrdersDebts = filterData(regularOrders, "regularOrders").reduce((acc, order) => acc + Math.max(order.balanceDue || 0, 0), 0);
      const customOrdersDebts = filterData(customerOrders, "customOrders").reduce((acc, order) => acc + Math.max(order.balanceDue || 0, 0), 0);
      const salesDebts = filterData(sales, "sales")
        .filter(sale => !sale.isDeleted)
        .reduce((acc, sale) => acc + Math.max(sale.balanceDue || 0, 0), 0);
      return regularOrdersDebts + customOrdersDebts + salesDebts;
    }
    return 0;
  };

  const calculateTotalBadDebts = () => {
    if (filters?.type !== "all") return 0;
    return filterData(expenses, "expenses")
      .filter((expense) => !expense.isDeleted && expense.isBadDebt)
      .reduce((acc, expense) => acc + expense.amount, 0);
  };

  const calculateTotalTips = () => {
    if (filters?.type === "all" || filters?.type === "manualSales") {
      return filterData(sales, "sales")
        .filter(sale => !sale.isDeleted)
        .reduce((acc, sale) => acc + (sale.tip_amount || 0), 0);
    }
    return 0;
  };

  const calculateTotalCashReceived = () => {
    if (filters?.type === "all" || filters?.type === "manualSales") {
      return filterData(sales, "sales")
        .filter(sale => !sale.isDeleted)
        .reduce((acc, sale) => acc + (sale.amountPaid || 0), 0);
    }
    return 0;
  };

  return {
    totalRevenue: calculateTotalRevenue(),
    totalExpenses: calculateTotalExpenses(),
    totalProfit:
      filters?.type === "all"
        ? calculateTotalRevenue() - calculateTotalExpenses()
        : calculateTotalRevenue(),
    totalDebts: calculateTotalDebts(),
    totalBadDebts: calculateTotalBadDebts(),
    totalTips: calculateTotalTips(),
    totalCashReceived: calculateTotalCashReceived(),
    isLoading:
      ordersLoading || customOrdersLoading || salesLoading || expensesLoading,
    error: null,
    orders: filterData(regularOrders, "regularOrders"),
    customOrders: filterData(customerOrders, "customOrders"),
    sales: filterData(sales, "sales").filter(sale => !sale.isDeleted),
    expenses: filterData(expenses, "expenses").filter(expense => !expense.isDeleted),
  };
};
