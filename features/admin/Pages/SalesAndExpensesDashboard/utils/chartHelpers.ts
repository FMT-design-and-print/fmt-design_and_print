import { IOrder, ICustomOrder } from "@/types/order";
import { ISales, Expenses } from "@/types/sales-expenses";

interface ChartData {
  date: string;
  orders: number;
  customOrders: number;
  manualSales: number;
  expenses: number;
}

interface GroupDataParams {
  orders: IOrder[];
  customOrders: ICustomOrder[];
  sales: ISales[];
  expenses: Expenses[];
}

export const groupDataByDate = ({
  orders,
  customOrders,
  sales,
  expenses,
}: GroupDataParams): ChartData[] => {
  const dataMap = new Map<string, ChartData>();

  // Process regular orders
  orders.forEach((order) => {
    const date = new Date(order.created_at).toISOString().split("T")[0];
    if (!dataMap.has(date)) {
      dataMap.set(date, {
        date,
        orders: 0,
        customOrders: 0,
        manualSales: 0,
        expenses: 0,
      });
    }
    const data = dataMap.get(date)!;
    if ("itemTypes" in order) {
      // Type guard for ICustomOrder
      data.customOrders += order.totalAmount;
    } else {
      data.orders += order.totalAmount;
    }
  });

  // Process custom orders
  customOrders.forEach((order) => {
    const date = new Date(order.created_at).toISOString().split("T")[0];
    if (!dataMap.has(date)) {
      dataMap.set(date, {
        date,
        orders: 0,
        customOrders: 0,
        manualSales: 0,
        expenses: 0,
      });
    }
    const data = dataMap.get(date)!;
    data.customOrders += order.totalAmount;
  });

  // Process sales
  sales.forEach((sale) => {
    const date = new Date(sale.created_at).toISOString().split("T")[0];
    if (!dataMap.has(date)) {
      dataMap.set(date, {
        date,
        orders: 0,
        customOrders: 0,
        manualSales: 0,
        expenses: 0,
      });
    }
    const data = dataMap.get(date)!;
    data.manualSales += sale.totalAmount;
  });

  // Process expenses
  expenses.forEach((expense) => {
    const date = new Date(expense.created_at).toISOString().split("T")[0];
    if (!dataMap.has(date)) {
      dataMap.set(date, {
        date,
        orders: 0,
        customOrders: 0,
        manualSales: 0,
        expenses: 0,
      });
    }
    const data = dataMap.get(date)!;
    data.expenses += expense.amount;
  });

  return Array.from(dataMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
