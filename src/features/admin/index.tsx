import React from "react";
import { Sidebar } from "./Sidebar/Sidebar";
import { Box, Group } from "@mantine/core";
import { SidebarMobile } from "./Sidebar/SidebarMobile";
import { PageRenderer } from "./PageRenderer";

export const AdminLayout = () => {
  return (
    <Group align="flex-start">
      <Box visibleFrom="sm">
        <Sidebar />
      </Box>
      <Box hiddenFrom="sm">
        <SidebarMobile />
      </Box>

      <Box style={{ flex: 1 }} p="lg">
        <PageRenderer />
      </Box>
    </Group>
  );
};
