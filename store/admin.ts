import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AdminStore = {
  selectedNavValue: string;
  setSelectedNavValue: (value: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
};

export const useAdminStore = create<AdminStore, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      selectedNavValue: "",
      setSelectedNavValue: (value) => set(() => ({ selectedNavValue: value })),
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: "fmt_dp_admin_store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
