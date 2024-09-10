import { LogoutButton } from "@/components/LogoutButton";
import {
  Button,
  Center,
  Divider,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";

import { adminNavItems } from "@/features/admin/Sidebar/AdminNavItems";
import { IconDeviceLaptop } from "@tabler/icons-react";
import Link from "next/link";
import { Links } from "./Links";
import classes from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <div className={classes.wrapper}>
      <nav className={classes.navbar}>
        <div className={classes.header}>
          <Group justify="space-between">
            <Text fw="bold">FMT Design and Print</Text>
          </Group>
        </div>

        <Center px="sm">
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
        </Center>

        <Divider my="md" />

        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>
            <Links navItems={adminNavItems} />
          </div>
        </ScrollArea>

        <div className={classes.footer}>
          <LogoutButton userType="admin" />
        </div>
      </nav>
    </div>
  );
}
