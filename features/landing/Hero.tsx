"use client";
import { featureFlags } from "@/constants/feature-flags";
import {
  Avatar,
  Card,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  em,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconMap,
  IconPhone,
  IconPrinter,
  IconReceipt2,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { CarouselCard } from "./CarouselCard";
import { PrintCategories } from "./PrintCategories";

export const Hero = () => {
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Grid px={{ base: "md", sm: "xl" }}>
      <Grid.Col span={3} visibleFrom="sm">
        <Card withBorder h="100%">
          <PrintCategories />
        </Card>
      </Grid.Col>
      <Grid.Col span="auto">
        <CarouselCard />
      </Grid.Col>

      <Grid.Col span={3} visibleFrom="md">
        <Card withBorder h="100%">
          <Link href="/custom-request">
            <Group py="xs" wrap="nowrap">
              <Avatar className="border border-1">
                <IconPrinter className="text-gray-500" size="1.4rem" />
              </Avatar>

              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Request Custom Print
              </Text>
            </Group>
          </Link>

          <Link href="/quote-or-invoice-request">
            <Group py="xs" wrap="nowrap">
              <Avatar className="border border-1">
                <IconReceipt2 className="text-gray-500" size="1.4rem" />
              </Avatar>

              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Request Quote/Invoice
              </Text>
            </Group>
          </Link>

          <Link href="/order-tracking">
            <Group py="xs" wrap="nowrap">
              <Avatar className="border border-1">
                <IconMap className="text-gray-500" size="1.4rem" />
              </Avatar>

              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Track my order
              </Text>
            </Group>
          </Link>

          <Group py="xs" wrap="nowrap">
            <Avatar className="border border-1">
              <IconPhone className="text-gray-500" size="1.4rem" />
            </Avatar>

            <Stack gap={0}>
              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Call to order
              </Text>
              <Text size="xs">0559617959</Text>
            </Stack>
          </Group>

          {featureFlags.gifts && (
            <>
              <Divider />

              <Link href="">
                <Group py="xs" wrap="nowrap">
                  <Image src="" alt="" width={25} height={25} />
                  <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                    Gift and Packages
                  </Text>
                </Group>
              </Link>
            </>
          )}

          {featureFlags.plainItems && (
            <Link href="">
              <Group py="xs" wrap="nowrap">
                <Image src="" alt="" width={25} height={25} />
                <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                  Buy Plain Items
                </Text>
              </Group>
            </Link>
          )}
        </Card>
      </Grid.Col>
    </Grid>
  );
};
