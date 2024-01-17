import { Card, Center, Group, Skeleton } from "@mantine/core";
import React from "react";

export const ProductsLoader = () => {
  return (
    <Card w={300}>
      <Center>
        <Skeleton height={250} w="100%" mx="auto" mb="sm" />
      </Center>

      <Skeleton height={8} radius="xl" />
      <Skeleton height={8} mt={6} radius="xl" w="60%" />
      <Group justify="space-between">
        <Skeleton height={8} mt={6} width="40%" radius="xl" />

        <Group w="40%" my="md">
          <Skeleton height={16} mt={6} width="40%" radius="xl" />
          <Skeleton height={16} mt={6} width="40%" radius="xl" />
        </Group>
      </Group>
    </Card>
  );
};
