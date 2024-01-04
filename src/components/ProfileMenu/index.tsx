"use client";
import { Avatar, Button, Group, Menu, Text, rem } from "@mantine/core";
import { IoChevronDown } from "react-icons/io5";
import { MdManageAccounts } from "react-icons/md";
import { LogoutButton } from "../LogoutButton";
import { useSession } from "@/store";
import Link from "next/link";

export const ProfileMenu = () => {
  const user = useSession((state) => state.user);

  return (
    user && (
      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: "pop-top-right" }}
        withinPortal
      >
        <Menu.Target>
          <Button
            variant="subtle"
            h="fit-content"
            py={2}
            px="xs"
            color="gray.1"
          >
            <Group gap={7} wrap="nowrap">
              <Avatar src="" alt="user name" size="md" color="white" />
              <Text c="white" size="sm" visibleFrom="sm">
                My Account
              </Text>
              <IoChevronDown style={{ width: rem(12), height: rem(12) }} />
            </Group>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{user?.email}</Menu.Label>
          <Menu.Item
            component={Link}
            href="/my-account"
            leftSection={
              <MdManageAccounts style={{ width: rem(16), height: rem(16) }} />
            }
          >
            Manage Account
          </Menu.Item>
          <Menu.Divider />
          <LogoutButton />
        </Menu.Dropdown>
      </Menu>
    )
  );
};
