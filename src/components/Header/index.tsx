import { Box, Flex, Group, Text } from "@mantine/core";
import Image from "next/image";
import { AuthButtons } from "../AuthButtons";
import { ProfileMenu } from "../ProfileMenu";
import { MobileNav } from "./MobileNav";
import { SearchSection } from "./SearchSection";
import { TopBar } from "./TopBar";
import { CartAndSavedItemsButtons } from "../CartAndSavedItemsButtons";
import { PrintingServicesDropDown } from "./PrintingServicesDropDown";
import { DesignServicesDropDown } from "./DesignServicesDropDown";
import Link from "next/link";

export function Header() {
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
          <Link href="/">
            <Image
              src="https://res.cloudinary.com/dnbmynikp/image/upload/v1703269414/FMT/logo-white_mfxmmk.png"
              alt="FMT Logo"
              width={60}
              height={50}
            />
          </Link>

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
