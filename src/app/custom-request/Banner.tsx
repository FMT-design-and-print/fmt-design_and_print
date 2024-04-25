import { formatString } from "@/functions";
import { Button, Center, Title } from "@mantine/core";
import { IconArrowBack } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

interface Props {
  name: string;
}

export const Banner = ({ name }: Props) => {
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
      <Title c="gray.7">Custom {productName} Order</Title>
    </Center>
  );
};
