"use client";
import React from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { Box, Group } from "@mantine/core";
import { SidebarMobile } from "./Sidebar/SidebarMobile";
import { PageRenderer } from "./PageRenderer";
import { useCurrentAdminUser } from "@/hooks/admin/useCurrentAdminUser";

export const AdminLayout = () => {
  useCurrentAdminUser();

  return (
    <Group align="flex-start" wrap="nowrap" mih={500}>
      <Box visibleFrom="sm">
        <Sidebar />
      </Box>
      <Box hiddenFrom="sm">
        <SidebarMobile />
      </Box>

      <Box style={{ flex: 1, overflowX: "auto" }} p="lg">
        <PageRenderer />
      </Box>
    </Group>
  );
};
