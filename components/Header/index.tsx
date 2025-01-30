"use client";
import { featureFlags } from "@/constants/feature-flags";
import { useUserType } from "@/hooks/useUserType";
import { Box, Flex, Group } from "@mantine/core";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { FMTLogo } from "../FMTLogo";
import { ProfileMenu } from "../ProfileMenu";
import { DesignServicesDropDown } from "./DesignServicesDropDown";
import { MobileNav } from "./MobileNav";
import { PrintingServicesDropDown } from "./PrintingServicesDropDown";
import { SearchSection } from "./SearchSection";
import { TopBar } from "./TopBar";

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
        px={{ base: "md", sm: "xl" }}
        py={8}
        className="bg-darkBlue text-white"
      >
        <Flex align="center" gap={16} h="100%">
          <FMTLogo />

          <Flex align="center" justify="space-between" className="grow" gap={4}>
            <Group h="100%" gap={12} wrap="nowrap" visibleFrom="sm">
              <PrintingServicesDropDown />
              {featureFlags.design && <DesignServicesDropDown />}
            </Group>

            <Box flex={1} visibleFrom="md">
              <SearchSection />
            </Box>

            <MobileNav />

            <Group align="center" wrap="nowrap">
              <Box hiddenFrom="md">
                <CartAndSavedItemsButtons />
              </Box>
              <ProfileMenu />
            </Group>
          </Flex>
        </Flex>
      </Box>
      <Box p={4} hiddenFrom="md">
        <SearchSection />
      </Box>
    </>
  );
}
