import { LogoutButton } from "@/components/LogoutButton";
import {
  ActionIcon,
  Box,
  Center,
  Divider,
  ScrollArea,
  Text,
} from "@mantine/core";
import { IconDeviceLaptop } from "@tabler/icons-react";
import Link from "next/link";
import { adminNavItems } from "./AdminNavItems";
import { Links } from "./Links";
import classes from "./Sidebar.module.css";

export const SidebarMobile = () => {
  return (
    <div className={classes.wrapper}>
      <nav className={classes.navbarMobile}>
        <div className={classes.header}>
          <Text fw="bold" ta="center">
            FMT
          </Text>
        </div>

        <Center px="sm">
          <ActionIcon
            component={Link}
            href="/admin/studio"
            variant="light"
            color="gray"
            w="100%"
            mt="sm"
            title="Open Studio"
          >
            <IconDeviceLaptop />
          </ActionIcon>
        </Center>

        <Divider my="md" />

        <ScrollArea className={classes.links}>
          <Box px="sm">
            <Links navItems={adminNavItems} isMobile />
          </Box>
        </ScrollArea>

        <div className={classes.footer}>
          <LogoutButton iconOnly />
        </div>
      </nav>
    </div>
  );
};
