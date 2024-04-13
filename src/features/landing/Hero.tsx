"use client";
import { Avatar, Card, Divider, Grid, Group, Text, em } from "@mantine/core";
import { CarouselCard } from "./CarouselCard";
import { PrintCategories } from "./PrintCategories";
import Image from "next/image";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import { featureFlags } from "@/constants/feature-flags";
import { IconPrinter, IconReceipt2 } from "@tabler/icons-react";

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
          <Link href="">
            <Group py="md" wrap="nowrap">
              <Avatar alt="" size={25}>
                <IconPrinter />
              </Avatar>
              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Request Custom Print
              </Text>
            </Group>
          </Link>

          <Link href="">
            <Group py="md" wrap="nowrap">
              <Avatar alt="" size={25}>
                <IconReceipt2 />
              </Avatar>
              <Text lineClamp={1} c="gray.7" size={isMobile ? "sm" : "md"}>
                Request Invoice
              </Text>
            </Group>
          </Link>

          {featureFlags.gifts && (
            <>
              <Divider />

              <Link href="">
                <Group py="md" wrap="nowrap">
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
              <Group py="md" wrap="nowrap">
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
