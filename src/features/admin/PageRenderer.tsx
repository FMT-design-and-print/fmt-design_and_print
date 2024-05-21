"use client";

import { useAdminStore } from "@/store/admin";
import { adminNavItems } from "./Sidebar/AdminNavItems";

export const PageRenderer = () => {
  const { selectedNavValue } = useAdminStore();

  const selectedNavItem = adminNavItems.find(
    (item) => item !== "divider" && item.value === selectedNavValue
  );

  if (!selectedNavItem || selectedNavItem === "divider") {
    return null;
  }

  return <>{selectedNavItem.component}</>;
};
