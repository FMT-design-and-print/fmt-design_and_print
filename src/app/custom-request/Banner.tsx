"use client";
import { useCustomRequest } from "@/features/custom-request";
import { formatString } from "@/functions";
import { Avatar, Button, Center, Stack, Title } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface Props {
  name: string;
}

export const Banner = ({ name }: Props) => {
  const context = useCustomRequest();
  const productName = name ? formatString(name) : "";

  return (
    <Center bg="gray.3" h={200} pos="relative">
      <Button
        variant="light"
        color="gray"
        leftSection={<IconArrowBack />}
        pos="absolute"
        top={5}
        left={5}
        size="xs"
        component={Link}
        href="/custom-request"
      >
        Select new product
      </Button>

      <Stack align="center">
        <Avatar src={context?.productImageUrl} size="lg">
          {productName.charAt(0).toUpperCase()}
        </Avatar>
        <Title c="gray.7" visibleFrom="sm">
          Request for {productName}
        </Title>
        <Title c="gray.7" hiddenFrom="sm" order={2}>
          Request for {productName}
        </Title>
      </Stack>
    </Center>
  );
};
