"use client";
import { Center, Stack, Title } from "@mantine/core";

export const Banner = () => {
  return (
    <Center bg="gray.3" h={200}>
      <Stack align="center">
        <Title c="gray.7" visibleFrom="sm">
          Request for Quote/Invoice
        </Title>
        <Title c="gray.7" hiddenFrom="sm" order={2}>
          Request for Quote/Invoice
        </Title>
      </Stack>
    </Center>
  );
};
