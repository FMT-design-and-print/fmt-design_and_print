"use client";
import { Box, Flex, Group, Text } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButtons } from "../AuthButtons";
import { CartAndSavedItemsButtons } from "../CartAndSavedItemsButtons";
import { FMTLogo } from "../FMTLogo";
import { ProfileMenu } from "../ProfileMenu";
import { DesignServicesDropDown } from "./DesignServicesDropDown";
import { MobileNav } from "./MobileNav";
import { PrintingServicesDropDown } from "./PrintingServicesDropDown";
import { SearchSection } from "./SearchSection";
import { TopBar } from "./TopBar";

export function Header() {
  const pathname = usePathname();

  if (pathname.includes("/admin")) {
    return null;
  }

  return (
    <>
      <Box visibleFrom="sm">
        <TopBar />
      </Box>
      <Box
        component="header"
        py="md"
        px={{ base: "md", sm: "xl" }}
        className="bg-darkBlue text-white"
      >
        <Flex align="center" gap={16} h="100%">
          <FMTLogo />

          <Flex align="center" justify="space-between" className="grow">
            <Group h="100%" gap={12} wrap="nowrap" visibleFrom="sm">
              <Text
                component={Link}
                href="/services"
                className="ml-4 text-primary-300"
              >
                All Services
              </Text>

              <PrintingServicesDropDown />
              <DesignServicesDropDown />
            </Group>

            <MobileNav />

            <Flex>
              <Box visibleFrom="sm">
                <AuthButtons />
              </Box>
              <Group align="center" wrap="nowrap">
                <Box hiddenFrom="sm">
                  <CartAndSavedItemsButtons />
                </Box>
                <ProfileMenu />
              </Group>
            </Flex>
          </Flex>
        </Flex>
        <SearchSection />
      </Box>
    </>
  );
}
