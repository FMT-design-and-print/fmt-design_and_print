"use client";
import {
  Box,
  Burger,
  Divider,
  Drawer,
  Flex,
  ScrollArea,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import { AuthButtons } from "../AuthButtons";
import { TopBar } from "./TopBar";
import Link from "next/link";

export const MobileNav = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  return (
    <>
      <Burger
        color="gray.1"
        opened={false}
        onClick={toggleDrawer}
        hiddenFrom="sm"
        role="button"
        aria-label="hamburger"
        mx={16}
      />

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title={
          <Link href="/">
            <Image
              src="https://res.cloudinary.com/dnbmynikp/image/upload/v1703546097/FMT/fmt-logo__znsjjh.png"
              alt="FMT Logo"
              width={60}
              height={50}
            />
          </Link>
        }
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <TopBar />

        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          <Flex direction="column" h="100%" gap={16} px="md">
            <Text
              component={Link}
              href="/services"
              className="ml-6 text-primary-300"
            >
              All Services
            </Text>
            <a href="#">Printing Services</a>
            <a href="#">Design Services</a>
          </Flex>
          <Divider my="sm" />

          <Box px="md">
            <AuthButtons />
          </Box>
        </ScrollArea>
      </Drawer>
    </>
  );
};
