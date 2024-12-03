"use client";
import { Flex, Group, Text } from "@mantine/core";
import { usePathname } from "next/navigation";
import { FMTLogo } from "../FMTLogo";
import Link from "next/link";
import { MessageIndicator } from "@/features/admin/components/MessageIndicator";
import { usePermission } from "@/hooks/admin/usePermission";
import { UserPermission } from "@/types/roles";

export const AdminHeader = () => {
  const { hasPermission } = usePermission();
  const pathname = usePathname();

  if (pathname.includes("/admin")) {
    return (
      <Flex
        align="flex-end"
        justify="space-between"
        component="header"
        py="md"
        px={{ base: "md", sm: "xl" }}
        className="bg-darkBlue text-gray-100"
      >
        <Group gap={32} align="flex-end">
          <FMTLogo />

          {pathname.includes("/admin/studio") ? (
            <Group>
              <Text fz="h3" component={Link} href="/admin">
                Admin Panel
              </Text>
              {"|"}
              <Text fz="h3">Studio</Text>
            </Group>
          ) : (
            <Text fz="h3">Admin Panel</Text>
          )}
        </Group>

        {hasPermission(UserPermission.ADMIN_PERMISSIONS) && (
          <MessageIndicator />
        )}
      </Flex>
    );
  }

  return null;
};
