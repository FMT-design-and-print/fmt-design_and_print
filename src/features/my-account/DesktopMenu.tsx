"use client";
import { LogoutButton } from "@/components/LogoutButton";
import { Box, Group, Space, Text } from "@mantine/core";
import { RenderLinks } from "./Links";
import classes from "./Navbar.module.css";
import { UserButton } from "./UserButton";
import { ILink } from "./types";
import { useUser } from "@/hooks/useUser";

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
  const { user } = useUser();

  const userName = (user?.firstName || "") + " " + (user?.lastName || "");

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <Text px="md" fw="bold" c="pink.6" pt="md" pb="sm" bg="gray.1">
          My Account
        </Text>
        <UserButton
          name={userName.trim() ? userName : ""}
          image={image || ""}
          email={email || ""}
        />
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
        <Box px="md">
          <LogoutButton />
        </Box>
      </div>
    </nav>
  );
};
