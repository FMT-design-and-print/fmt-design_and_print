"use client";
import React from "react";
import { AdminUsersTable } from "./AdminUsersTable";
import { CreateNewAdminUser } from "./CreateNewAdminUser";
import { Space } from "@mantine/core";
import { usePermission } from "@/hooks/admin/usePermission";
import { UserPermission } from "@/types/roles";

export const AdminUsers = () => {
  const { hasPermission } = usePermission();

  if (!hasPermission(UserPermission.ADMIN_PERMISSIONS)) {
    return null;
  }

  return (
    <>
      <AdminUsersTable />
      <Space h="xl" my="xl" />
      <CreateNewAdminUser />
    </>
  );
};
