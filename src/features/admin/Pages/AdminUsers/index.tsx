import React from "react";
import { AdminUsersTable } from "./AdminUsersTable";
import { CreateNewAdminUser } from "./CreateNewAdminUser";
import { Space } from "@mantine/core";

export const AdminUsers = () => {
  return (
    <>
      <AdminUsersTable />
      <Space h="xl" my="xl" />
      <CreateNewAdminUser />
    </>
  );
};
