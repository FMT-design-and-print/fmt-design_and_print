"use client";
import { useCategories } from "@/hooks/useCategories";
import {
  Accordion,
  Anchor,
  Box,
  Burger,
  Divider,
  Drawer,
  Flex,
  ScrollArea,
  Space,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { AuthButtons } from "../AuthButtons";
import { FMTLogo } from "../FMTLogo";
import { CategoryCard } from "./CategoryCard";
import { TopBar } from "./TopBar";
import { featureFlags } from "@/constants/feature-flags";

export const MobileNav = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { categories } = useCategories();
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
        size="md"
        padding="md"
        title={
          <FMTLogo image="https://res.cloudinary.com/dnbmynikp/image/upload/v1703546097/FMT/fmt-logo__znsjjh.png" />
        }
        hiddenFrom="sm"
        zIndex={1000000}
      >
        <TopBar />

        <Box py="lg" mt="sm">
          <AuthButtons grow />
        </Box>

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
            <Accordion defaultValue="printing-services">
              <Accordion.Item value="printing-services">
                <Accordion.Control>Printing Services</Accordion.Control>
                <Accordion.Panel>
                  <Flex justify="flex-end">
                    <Anchor
                      component={Link}
                      href="/services?st=print"
                      c="pink"
                      fz="xs"
                    >
                      View all Printing Services
                    </Anchor>
                  </Flex>
                  <Space />

                  {categories &&
                    categories.map((item) => (
                      <CategoryCard
                        key={item.id}
                        title={item.title}
                        icon={item.icon}
                        tagline={item.tagline}
                        link={`/services/print/categories/${item.slug}`}
                      />
                    ))}
                </Accordion.Panel>
              </Accordion.Item>

              {featureFlags.design && (
                <Accordion.Item value="design-services">
                  <Accordion.Control>Design Services</Accordion.Control>
                  <Accordion.Panel>
                    <Flex justify="flex-end">
                      <Anchor
                        component={Link}
                        href="/services?st=design"
                        c="pink"
                        fz="xs"
                      >
                        View all Design Services
                      </Anchor>
                    </Flex>
                  </Accordion.Panel>
                </Accordion.Item>
              )}
            </Accordion>
          </Flex>
          {/* <Divider my="sm" /> */}
        </ScrollArea>
      </Drawer>
    </>
  );
};
