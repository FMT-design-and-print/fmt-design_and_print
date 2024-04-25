"use client";
import { ProductTypeCard } from "@/components/ProductTypeCard";
import { useGroupedProductTypes } from "@/hooks/useProductTypes";
import { Center, Divider, Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { LoadingTypes } from "./LoadingTypes";

export const CustomRequestItems = () => {
  const { groupedProductTypes, isLoading } = useGroupedProductTypes();

  return (
    <>
      <Center bg="gray.3" h={200}>
        <Stack>
          <Title c="gray.7" ta="center">
            Custom Request
          </Title>
          <Text c="dimmed" ta="center">
            Make a custom order request and receive a quote
          </Text>
        </Stack>
      </Center>

      <Group justify="space-between">
        <Title order={3} mb="lg" c="dimmed" mt="lg">
          Choose a product type
        </Title>

        {/* <TextInput leftSection={<HiSearch />} rightSectionWidth={"90px"} /> */}
      </Group>
      <Divider mb="lg" />

      {isLoading ? (
        <LoadingTypes />
      ) : groupedProductTypes ? (
        <Group>
          {Object.values(groupedProductTypes).map((value) =>
            value.items.map((item) => (
              <ProductTypeCard
                key={item.id}
                label={item.title}
                link={`/custom-request/${item.slug}`}
                image={item.image}
              />
            ))
          )}
        </Group>
      ) : (
        <>No Products were found. Reload!</>
      )}

      <Divider my="xl" />
      <Group justify="flex-end">
        <Text>Can&apos;t find your product? </Text>
        <Text component={Link} href="/custom-request/unavailable" c="pink">
          Click here
        </Text>
      </Group>
    </>
  );
};
