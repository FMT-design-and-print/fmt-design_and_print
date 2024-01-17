"use client";
import { Flex, Title } from "@mantine/core";
import { usePathname } from "next/navigation";
import { FMTLogo } from "../FMTLogo";

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
        <Title order={3}> Admin </Title>
      </Flex>
    );
  }

  return null;
};
