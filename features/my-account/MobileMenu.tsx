"use client";
import { LogoutButton } from "@/components/LogoutButton";
import { Avatar, Group, Menu, Text, UnstyledButton, rem } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import cx from "clsx";
import { useState } from "react";
import { RenderLinks } from "./Links";
import classes from "./Navbar.module.css";
import { ILink } from "./types";
import { useUser } from "@/hooks/useUser";

interface Props {
  email?: string;
  image?: string;
  topLinks: ILink[];
  accountLinks: ILink[];
}

export const MobileMenu = ({ email, image, topLinks, accountLinks }: Props) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { user } = useUser();

  const userName = (user?.firstName || "") + " " + (user?.lastName || "");

  return (
    <Menu
      width={260}
      position="bottom-end"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      transitionProps={{ transition: "pop-top-right" }}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group gap={7}>
            <Avatar src={image} alt={email} radius="xl" size="sm">
              {email?.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {userName.trim() ? userName : ""}
              </Text>
              <Text fw={500} c="dimmed" size="xs" lh={1} mr={3}>
                {email}
              </Text>
            </div>

            <IconChevronDown
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <RenderLinks links={topLinks} />
        <Menu.Divider />
        <Menu.Label>Account Settings</Menu.Label>
        <RenderLinks links={accountLinks} />

        <Menu.Divider />

        <LogoutButton />
      </Menu.Dropdown>
    </Menu>
  );
};
