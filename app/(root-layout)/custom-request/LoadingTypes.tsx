import React from "react";
import { Card, Group, Skeleton } from "@mantine/core";

const LoadingCard = () => (
  <Card withBorder>
    <Group align="center">
      <Skeleton height={40} circle />
      <Skeleton height={20} width={100} radius="sm" />
    </Group>
  </Card>
);

export const LoadingTypes = () => {
  return (
    <Group>
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </Group>
  );
};
