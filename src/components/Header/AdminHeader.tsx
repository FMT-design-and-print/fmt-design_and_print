"use client";
import { Flex, Title } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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
        <Link href="/">
          <Image
            src="https://res.cloudinary.com/dnbmynikp/image/upload/v1703269414/FMT/logo-white_mfxmmk.png"
            alt="FMT Logo"
            width={60}
            height={50}
          />
        </Link>

        <Title order={3}> Admin </Title>
      </Flex>
    );
  }

  return null;
};
