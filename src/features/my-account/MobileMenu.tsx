"use client";
import { Avatar, Group, Menu, Text, UnstyledButton, rem } from "@mantine/core";
import { IconChevronDown, IconLogout2 } from "@tabler/icons-react";
import cx from "clsx";
import { useState } from "react";
import { RenderLinks } from "./Links";
import classes from "./Navbar.module.css";
import { ILink } from "./types";

interface Props {
  name?: string;
  email?: string;
  image?: string;
  topLinks: ILink[];
  accountLinks: ILink[];
}

export const MobileMenu = ({
  email,
  image,
  name,
  topLinks,
  accountLinks,
}: Props) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);

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
                {name}
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
        <Menu.Item
          color="red"
          leftSection={
            <IconLogout2
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
