import { LogoutButton } from "@/components/LogoutButton";
import {
  ActionIcon,
  Button,
  Center,
  Divider,
  Group,
  ScrollArea,
  Text,
  Tooltip,
} from "@mantine/core";

import { adminNavItems } from "@/features/admin/Sidebar/AdminNavItems";
import { IconDeviceLaptop, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { Links } from "./Links";
import classes from "./Sidebar.module.css";
import { useAdminStore } from "@/store/admin";

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useAdminStore();

  return (
    <div className={classes.wrapper}>
      <nav className={classes.navbar} style={{ width: isSidebarCollapsed ? 80 : 300, transition: 'width 0.2s ease' }}>
        <div className={classes.header}>
          <Group justify={isSidebarCollapsed ? "center" : "space-between"} wrap="nowrap">
            {!isSidebarCollapsed && <Text fw="bold" truncate>FMT Design and Print</Text>}
            <ActionIcon variant="subtle" color="gray" onClick={toggleSidebar} title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {isSidebarCollapsed ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
            </ActionIcon>
          </Group>
        </div>

        <Center px="sm">
          {isSidebarCollapsed ? (
            <Tooltip label="Open Studio" position="right">
              <ActionIcon
                component={Link}
                href="/admin/studio"
                variant="light"
                color="gray"
                size="lg"
                mt="sm"
              >
                <IconDeviceLaptop size={20} />
              </ActionIcon>
            </Tooltip>
          ) : (
            <Button
              leftSection={<IconDeviceLaptop />}
              component={Link}
              href="/admin/studio"
              variant="light"
              color="gray"
              w="100%"
              mt="sm"
            >
              Open Studio
            </Button>
          )}
        </Center>

        <Divider my="md" />

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>
            <Links navItems={adminNavItems} isCollapsed={isSidebarCollapsed} />
          </div>
        </ScrollArea>

        <div className={classes.footer}>
          <LogoutButton userType="admin" iconOnly={isSidebarCollapsed} />
        </div>
      </nav>
    </div>
  );
}
