"use client";
import { useAdminStore } from "@/store/admin";
import { IAdminNavItems } from "@/types";
import { ActionIcon, Avatar, Divider, Group, Text } from "@mantine/core";
import cx from "clsx";
import classes from "./Sidebar.module.css";
import { v4 as uid } from "uuid";

interface Props {
  isMobile?: boolean;
  navItems: IAdminNavItems[];
}

export const Links = ({ navItems, isMobile }: Props) => {
  const { selectedNavValue, setSelectedNavValue } = useAdminStore(
    (state) => state
  );
  const visibleItems = navItems.filter(
    (item) => typeof item === "string" || item.isVisible
  );

  return visibleItems.map((item, i) =>
    item === "divider" ? (
      <Divider key={uid()} my="sm" />
    ) : !isMobile ? (
      <Group
        key={item.value}
        p="sm"
        className={cx(classes.link, {
          [classes.linkSelected]: selectedNavValue === item.value,
        })}
        onClick={() => setSelectedNavValue(item.value)}
      >
        <Avatar radius="md" size="sm">
          {item.icon}
        </Avatar>
        <Text size="sm">{item.label}</Text>
      </Group>
    ) : (
      <ActionIcon
        w="100%"
        variant="light"
        color="gray"
        key={item.value}
        px="sm"
        py="md"
        my="sm"
        radius="xs"
        title={item.label}
        className={cx(classes.link, {
          [classes.linkSelected]: selectedNavValue === item.value,
        })}
        onClick={() => setSelectedNavValue(item.value)}
      >
        {item.icon}
      </ActionIcon>
    )
  );
};
