"use client";
import { ILink } from "@/features/my-account/types";
import { useSession } from "@/store";
import { Avatar, Button, Group, Menu, Text, rem } from "@mantine/core";
import {
  IconHeart,
  IconPackage,
  IconTicket,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import { LogoutButton } from "../LogoutButton";
import { usePathname } from "next/navigation";

const links: ILink[] = [
  {
    icon: <IconUser size="1rem" />,
    label: "Profile",
    link: "/my-account/profile",
  },
  {
    icon: <IconPackage size="1rem" />,
    label: "My Orders",
    link: "/my-account/orders",
  },
  {
    icon: <IconTicket size="1rem" />,
    label: "My Coupons",
    link: "/my-account/coupons",
  },
  {
    icon: <IconHeart size="1rem" />,
    label: "Saved Items",
    link: "/my-account/saved-items",
  },
];

const excludedPaths = [
  "/my-account",
  "/my-account/orders",
  "/my-account/inbox",
  "/my-account/coupons",
  "/my-account/saved-items",
  "/my-account/profile",
  "/my-account/shipping-address",
  "/my-account/recently-viewed",
  "/my-account/recently-searched",
];

export const ProfileMenu = () => {
  const user = useSession((state) => state.user);
  const pathname = usePathname();

  if (excludedPaths.includes(pathname)) {
    return null;
  }

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
              <Avatar
                variant="light"
                src=""
                alt="user name"
                size="md"
                color="gray.2"
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Text c="white" size="sm" visibleFrom="sm">
                My Account
              </Text>
              <IoChevronDown style={{ width: rem(12), height: rem(12) }} />
            </Group>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>{user?.email}</Menu.Label>
          <Menu.Divider />

          {links.map((link) => (
            <Menu.Item
              color="gray.8"
              key={link.link}
              component={Link}
              href={link.link}
              leftSection={link.icon}
            >
              {link.label}
            </Menu.Item>
          ))}

          <Menu.Divider />
          <LogoutButton />
        </Menu.Dropdown>
      </Menu>
    )
  );
};
