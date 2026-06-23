import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/types/supabase";

const supabase = createClient();

export const useFinancialSummaryReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["financial-summary-report", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_financial_summary_report", {
        start_date: startDate,
        end_date: endDate,
      });
      if (error) throw error;
      return data as {
        totalRevenue: number;
        totalExpenses: number;
        totalProfit: number;
        totalDebts: number;
        totalBadDebts: number;
        totalTips: number;
        totalCashReceived: number;
        salesCount: number;
        ordersCount: number;
        customOrdersCount: number;
      };
    },
  });
};

export const useTopCustomersReport = (startDate: string, endDate: string, limit = 10) => {
  return useQuery({
    queryKey: ["top-customers-report", startDate, endDate, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_top_customers_report", {
        start_date: startDate,
        end_date: endDate,
        limit_count: limit,
      });
      if (error) throw error;
      return data as {
        id: string;
        name: string;
        phone: string;
        period_spent: number;
        period_debt: number;
      }[];
    },
  });
};

export const useTopPerformingServicesReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["top-performing-services-report", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_top_performing_services_report", {
        start_date: startDate,
        end_date: endDate,
      });
      if (error) throw error;
      return data as {
        category: string;
        total_revenue: number;
      }[];
    },
  });
};

export const useTopPerformingProductTypesReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["top-performing-product-types-report", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_top_performing_product_types_report", {
        start_date: startDate,
        end_date: endDate,
      });
      if (error) throw error;
      return data as {
        product_type: string;
        total_revenue: number;
      }[];
    },
  });
};

export const useDetailedServicePerformanceReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["detailed-service-performance-report", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_detailed_service_performance_report", {
        start_date: startDate,
        end_date: endDate,
      });
      if (error) throw error;
      return data as {
        category: string;
        product_type: string;
        sales_count: number;
        total_revenue: number;
        total_tips: number;
        total_cash_received: number;
      }[];
    },
  });
};

export const useExpensesByTypeReport = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: ["expenses-by-type-report", startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_expenses_by_type_report", {
        start_date: startDate,
        end_date: endDate,
      });
      if (error) throw error;
      return data as {
        expense_type: string;
        total_amount: number;
        expense_count: number;
      }[];
    },
  });
};
