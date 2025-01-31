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
  Stack,
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
import classes from "./Style.module.css";
import {
  IconGift,
  IconMap,
  IconPhone,
  IconPrinter,
  IconReceipt2,
  IconTag,
} from "@tabler/icons-react";

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
        size="sm"
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

        <Box py="lg" mt="sm" onClick={closeDrawer}>
          <AuthButtons grow />
        </Box>

        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">
          <Divider my="sm" />
          <Flex direction="column" h="100%" gap={16} px="md">
            <Text
              component={Link}
              href="/services"
              className="ml-6 text-primary-300"
              onClick={closeDrawer}
            >
              All Services
            </Text>
            <Stack pl="lg">
              <Box onClick={closeDrawer} py="4" className={classes.link}>
                <CategoryCard
                  title="Request Custom Print"
                  icon={<IconPrinter />}
                  tagline="Submit your own artworks to be printed on products"
                  link={`/custom-request`}
                />
              </Box>

              <Box onClick={closeDrawer} py="4" className={classes.link}>
                <CategoryCard
                  title="Request Quote/Invoice"
                  icon={<IconReceipt2 />}
                  tagline="Send a request and we will create a quote or invoice for you"
                  link={`/quote-or-invoice-request`}
                />
              </Box>

              <Box onClick={closeDrawer} py="4" className={classes.link}>
                <CategoryCard
                  title="Track my order"
                  icon={<IconMap />}
                  tagline="Track the status or your order"
                  link={`/order-tracking`}
                />
              </Box>

              <Box onClick={closeDrawer} py="4" className={classes.link}>
                <CategoryCard
                  title="Call to order"
                  icon={<IconPhone />}
                  tagline="You can also call.Whatsapp us on (0559617959) to place an order manually"
                  link={`/order-tracking`}
                />
              </Box>

              {featureFlags.plainItems && (
                <Box onClick={closeDrawer} py="4" className={classes.link}>
                  <CategoryCard
                    title="Plain Items "
                    icon={<IconTag />}
                    tagline="Buy plain items and souvenirs"
                    link={`/plain-items`}
                  />
                </Box>
              )}
              {featureFlags.gifts && (
                <Box onClick={closeDrawer} py="4" className={classes.link}>
                  <CategoryCard
                    title="Gifts and Packages"
                    icon={<IconGift />}
                    tagline="Check out our gifts and promo packages"
                    link={`/gifts-and-packages`}
                  />
                </Box>
              )}
            </Stack>

            <Accordion defaultValue="printing-services">
              <Accordion.Item value="printing-services">
                <Accordion.Control>Printing Services</Accordion.Control>
                <Accordion.Panel>
                  <Flex justify="flex-end">
                    <Anchor
                      onClick={closeDrawer}
                      component={Link}
                      href="/services?st=print"
                      c="pink"
                      fz="xs"
                    >
                      View all Printing Products
                    </Anchor>
                  </Flex>
                  <Space />

                  {categories &&
                    categories.map((item) => (
                      <Box
                        key={item.id}
                        onClick={closeDrawer}
                        my="sm"
                        py="4"
                        className={classes.link}
                      >
                        <CategoryCard
                          title={item.title}
                          icon={item.icon}
                          tagline={item.tagline}
                          link={`/services/print/categories/${item.slug}`}
                        />
                      </Box>
                    ))}
                </Accordion.Panel>
              </Accordion.Item>

              {featureFlags.design && (
                <Accordion.Item value="design-services">
                  <Accordion.Control>Request Design Service</Accordion.Control>
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
