"use client";
import { Button, Group, Space, Text } from "@mantine/core";
import { IconLogout2 } from "@tabler/icons-react";
import { RenderLinks } from "./Links";
import classes from "./Navbar.module.css";
import { UserButton } from "./UserButton";
import { ILink } from "./types";

interface Props {
  name?: string;
  email?: string;
  image?: string;
  topLinks: ILink[];
  accountLinks: ILink[];
}

export const DesktopMenu = ({
  email,
  image,
  name,
  topLinks,
  accountLinks,
}: Props) => {
  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <Text px="md" fw="bold" c="pink.6" pt="md" pb="sm" bg="gray.1">
          My Account
        </Text>
        <UserButton name={name || ""} image={image || ""} email={email || ""} />
      </div>

      <div className={classes.section}>
        <div className={classes.mainLinks}>
          <RenderLinks links={topLinks} />
        </div>
      </div>

      <div className={classes.section}>
        <Group className={classes.sectionHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Account Settings
          </Text>
        </Group>

        <div className={classes.mainLinks}>
          <RenderLinks links={accountLinks} />
        </div>

        <Space my={16} />
        <Button
          variant="light"
          color="red"
          w="90%"
          style={{ boxSizing: "border-box" }}
          mx={8}
          leftSection={<IconLogout2 size="1rem" />}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};