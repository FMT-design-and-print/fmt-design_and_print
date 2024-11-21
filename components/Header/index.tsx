"use client";
import { Box, Flex, Group, Text } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthButtons } from "../AuthButtons";
import { featureFlags } from "@/constants/feature-flags";
import dynamic from "next/dynamic";
import { FMTLogo } from "../FMTLogo";
import { ProfileMenu } from "../ProfileMenu";
import { DesignServicesDropDown } from "./DesignServicesDropDown";
import { MobileNav } from "./MobileNav";
import { PrintingServicesDropDown } from "./PrintingServicesDropDown";
import { SearchSection } from "./SearchSection";
import { TopBar } from "./TopBar";
import { useUserType } from "@/hooks/useUserType";

const CartAndSavedItemsButtons = dynamic(
  () => import("../CartAndSavedItemsButtons"),
  {
    ssr: false,
  }
);

export function Header() {
  useUserType();
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
              {featureFlags.design && <DesignServicesDropDown />}
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
