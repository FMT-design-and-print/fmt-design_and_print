"use client";
import { Flex, Group, Text } from "@mantine/core";
import { usePathname } from "next/navigation";
import { FMTLogo } from "../FMTLogo";
import Link from "next/link";

export const AdminHeader = () => {
  const pathname = usePathname();

  if (pathname.includes("/admin")) {
    return (
      <Flex
        align="flex-end"
        gap={32}
        component="header"
        py="md"
        px={{ base: "md", sm: "xl" }}
        className="bg-darkBlue text-gray-100"
      >
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
      </Flex>
    );
  }

  return null;
};
