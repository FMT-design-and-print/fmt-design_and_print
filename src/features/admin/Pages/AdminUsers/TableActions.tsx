import { ActionIcon, Menu, rem } from "@mantine/core";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import Link from "next/link";

export function TableActions() {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="transparent" color="gray">
          <IconDotsVertical />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          href="https://supabase.com/dashboard/project/coxllmmoajsgmxdoqbyi/editor/30544"
          target="_blank"
          rel="noopener noreferrer"
          color="gray"
          leftSection={
            <IconPencil style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Edit
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="https://supabase.com/dashboard/project/coxllmmoajsgmxdoqbyi/auth/users"
          target="_blank"
          rel="noopener noreferrer"
          color="red"
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
