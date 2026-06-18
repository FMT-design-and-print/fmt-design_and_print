"use client";
import { useAdminStore } from "@/store/admin";
import { IAdminNavItems } from "@/types";
import { ActionIcon, Avatar, Divider, Group, Text, Tooltip } from "@mantine/core";
import cx from "clsx";
import classes from "./Sidebar.module.css";
import { v4 as uid } from "uuid";
import { usePermission } from "@/hooks/admin/usePermission";

interface Props {
  isMobile?: boolean;
  navItems: IAdminNavItems[];
  isCollapsed?: boolean;
}

export const Links = ({ navItems, isMobile, isCollapsed }: Props) => {
  const { hasPermission } = usePermission();

  const visibleItems = navItems.filter(
    (item) => typeof item === "string" || item.isVisible
  );

  return visibleItems.map((item) =>
    item === "divider" || !item.requiredPermission ? (
      <Link key={uid()} item={item} isMobile={isMobile} isCollapsed={isCollapsed} />
    ) : (
      hasPermission(item.requiredPermission) && (
        <Link key={uid()} item={item} isMobile={isMobile} isCollapsed={isCollapsed} />
      )
    )
  );
};

interface LinkProps {
  isMobile?: boolean;
  item: IAdminNavItems;
  isCollapsed?: boolean;
}

const Link = ({ item, isMobile, isCollapsed }: LinkProps) => {
  const { selectedNavValue, setSelectedNavValue } = useAdminStore(
    (state) => state
  );

  if (item === "divider") {
    return <Divider key={uid()} my="sm" />;
  }

  if (isMobile || isCollapsed) {
    return (
      <Tooltip label={item.label} position="right" key={item.value}>
        <ActionIcon
          w="100%"
          variant="light"
          color="gray"
          px="sm"
          py="md"
          my="sm"
          radius="xs"
          className={cx(classes.link, {
            [classes.linkSelected]: selectedNavValue === item.value,
          })}
          onClick={() => setSelectedNavValue(item.value)}
        >
          {item.icon}
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
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
  );
};
