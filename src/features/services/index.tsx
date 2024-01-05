"use client";
import { Box, Flex, Tabs } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { DesignServices } from "./DesignServices";
import { PrintServices } from "./PrintServices";
import { ServiceCard } from "./ServiceCard";

export function AllServices() {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get("st");
  const { push } = useRouter();

  return (
    <Box w={{ base: "100%", sm: "90%", lg: "80%" }} mx="auto">
      <Flex
        p="xl"
        justify={{ base: "center", xs: "flex-start", lg: "center" }}
        wrap="wrap"
        gap={32}
      >
        <ServiceCard
          link="/services/plain-items"
          label="Plain Materials & Souvenirs"
          color="#9B51E0"
          image="/clothes.png"
        />
        <ServiceCard
          link="/services/gifts"
          label="Gifts & Packages"
          color="orange"
          image="/gift.png"
        />
        <ServiceCard
          link="/services/deals"
          label="Deals of the Week"
          color="#27AE60"
          image="/deal.png"
        />
      </Flex>
      <Tabs
        variant="pills"
        color="gray"
        radius="xs"
        value={serviceType == null ? "print" : serviceType}
        onChange={(value) => {
          push(`/services?st=${value}`);
        }}
        px="xl"
      >
        <Tabs.List py="md">
          <Tabs.Tab value="print" px="xl" py="md">
            Printing Services
          </Tabs.Tab>
          <Tabs.Tab value="design" px="xl" py="md">
            Design Services
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="print">
          <PrintServices />
        </Tabs.Panel>
        <Tabs.Panel value="design">
          <DesignServices />
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
