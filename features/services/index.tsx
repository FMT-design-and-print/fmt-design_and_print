"use client";
import { FeatureFlagKeys, featureFlags } from "@/constants/feature-flags";
import { GroupedPrintProductTypes } from "@/types";
import { Container, Flex, Tabs } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { DesignServices } from "./DesignServices";
import { PrintServices } from "./PrintServices";
import { ServiceCard } from "./ServiceCard";
import { AllProducts } from "./AllProducts";

const validServiceTypes = ["print", "design"];

interface Props {
  printCategoriesWithProductTypes: GroupedPrintProductTypes;
}

export function AllServices({ printCategoriesWithProductTypes }: Props) {
  const searchParams = useSearchParams();
  const serviceType = searchParams.get("st");
  const { push } = useRouter();

  return (
    <Container size="lg">
      <Flex
        p="xl"
        justify={{ base: "center", xs: "flex-start", lg: "center" }}
        wrap="wrap"
        gap={32}
      >
        {featureFlags.plainItems && (
          <ServiceCard
            link="/services/plain-items"
            label="Plain Materials & Souvenirs"
            color="#9B51E0"
            image="/clothes.png"
          />
        )}
        {featureFlags.gifts && (
          <ServiceCard
            link="/services/gifts"
            label="Gifts & Packages"
            color="orange"
            image="/gift.png"
          />
        )}
        {featureFlags.deals && (
          <ServiceCard
            link="/services/deals"
            label="Deals of the Week"
            color="#27AE60"
            image="/deal.png"
          />
        )}
      </Flex>

      <Tabs
        variant="pills"
        color="gray"
        radius="xs"
        value={
          serviceType == null ||
          !validServiceTypes.includes(serviceType) ||
          !featureFlags[serviceType as FeatureFlagKeys]
            ? "print"
            : serviceType
        }
        onChange={(value) => {
          push(`/services?st=${value}`);
        }}
        px="md"
      >
        <Tabs.List py="md">
          <Tabs.Tab value="print" px="xl" py="md">
            Printing Services
          </Tabs.Tab>
          {featureFlags.design && (
            <Tabs.Tab value="design" px="xl" py="md">
              Design Services
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="print">
          <PrintServices
            groupedPrintProductTypes={printCategoriesWithProductTypes}
          />
        </Tabs.Panel>
        {featureFlags.design && (
          <Tabs.Panel value="design">
            <DesignServices />
          </Tabs.Panel>
        )}
      </Tabs>

      <AllProducts />
    </Container>
  );
}
