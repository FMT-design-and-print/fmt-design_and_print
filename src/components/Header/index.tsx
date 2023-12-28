import { Box, Flex, Group } from "@mantine/core";
import Image from "next/image";
import { AuthButtons } from "../AuthButtons";
import { ProfileMenu } from "../ProfileMenu";
import { MobileNav } from "./MobileNav";
import { SearchSection } from "./SearchSection";
import classes from "./Styles.module.css";
import { TopBar } from "./TopBar";
import { CartAndSavedItemsButtons } from "../CartAndSavedItemsButtons";

export function Header() {
  return (
    <>
      <Box visibleFrom="sm">
        <TopBar />
      </Box>
      <Box className="bg-darkBlue text-white">
        <header className={classes.header}>
          <Flex align="center" gap={16} h="100%">
            <Image
              src="https://res.cloudinary.com/dnbmynikp/image/upload/v1703269414/FMT/logo-white_mfxmmk.png"
              alt="FMT Logo"
              width={60}
              height={50}
            />

            <Flex align="center" justify="space-between" className="grow">
              <Group h="100%" gap={16} visibleFrom="sm" px="xl">
                <a href="#" className="mr-2 text-primary-300">
                  All Services
                </a>
                <a href="#">Printing Services</a>
                <a href="#">Design Services</a>
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
        </header>
      </Box>
    </>
  );
}
