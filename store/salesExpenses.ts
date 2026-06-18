import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DatesRangeValue } from "@mantine/dates";
import { AmountFilter } from "@/features/admin/Pages/SalesExpenses/hooks/useFilters";

export interface SalesFilters {
  search: string;
  createdBy: string | null;
  dateRange: DatesRangeValue;
  amount: AmountFilter | null;
  productType: string | null;
  category: string | null;
  paymentStatus: string | null;
  paymentMethods: string[];
}

export interface ExpensesFilters {
  search: string;
  createdBy: string | null;
  dateRange: DatesRangeValue;
  amount: AmountFilter | null;
  expenseType: string | null;
  isBadDebt: boolean | null;
  approver: string | null;
}

export const initialSalesFilters: SalesFilters = {
  search: "",
  createdBy: null,
  dateRange: [null, null],
  amount: { type: "exact", value: null },
  productType: null,
  category: null,
  paymentStatus: null,
  paymentMethods: [],
};

export const initialExpensesFilters: ExpensesFilters = {
  search: "",
  createdBy: null,
  dateRange: [null, null],
  amount: { type: "exact", value: null },
  expenseType: null,
  isBadDebt: null,
  approver: null,
};

interface SalesExpensesState {
  salesPage: number;
  expensesPage: number;
  salesFilters: SalesFilters;
  expensesFilters: ExpensesFilters;
  
  setSalesPage: (page: number) => void;
  setExpensesPage: (page: number) => void;
  
  setSalesFilters: (filters: Partial<SalesFilters>) => void;
  setExpensesFilters: (filters: Partial<ExpensesFilters>) => void;
  
  clearSalesFilters: () => void;
  clearExpensesFilters: () => void;
  
  resetPagination: () => void;
}

export const useSalesExpensesStore = create<SalesExpensesState>()(
  persist(
    (set) => ({
      salesPage: 1,
      expensesPage: 1,
      salesFilters: initialSalesFilters,
      expensesFilters: initialExpensesFilters,

      setSalesPage: (page) => set({ salesPage: page }),
      setExpensesPage: (page) => set({ expensesPage: page }),

      setSalesFilters: (filters) => 
        set((state) => ({ 
          salesFilters: { ...state.salesFilters, ...filters },
          salesPage: 1 // Reset page on filter change
        })),
        
      setExpensesFilters: (filters) => 
        set((state) => ({ 
          expensesFilters: { ...state.expensesFilters, ...filters },
          expensesPage: 1 // Reset page on filter change
        })),

      clearSalesFilters: () => 
        set({ salesFilters: initialSalesFilters, salesPage: 1 }),
        
      clearExpensesFilters: () => 
        set({ expensesFilters: initialExpensesFilters, expensesPage: 1 }),

      resetPagination: () => set({ salesPage: 1, expensesPage: 1 }),
    }),
    {
      name: "sales-expenses-storage",
      merge: (persistedState: any, currentState) => {
        // Deeply merge to preserve functions and default states
        const state = { ...currentState, ...persistedState };
        
        // Hydrate Date objects for DatePickerInput
        if (state.salesFilters?.dateRange) {
          state.salesFilters.dateRange = [
            state.salesFilters.dateRange[0] ? new Date(state.salesFilters.dateRange[0]) : null,
            state.salesFilters.dateRange[1] ? new Date(state.salesFilters.dateRange[1]) : null,
          ];
        }
        
        if (state.expensesFilters?.dateRange) {
          state.expensesFilters.dateRange = [
            state.expensesFilters.dateRange[0] ? new Date(state.expensesFilters.dateRange[0]) : null,
            state.expensesFilters.dateRange[1] ? new Date(state.expensesFilters.dateRange[1]) : null,
          ];
        }
        
        return state;
      },
    }
  )
);