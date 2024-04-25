import { formatString } from "@/functions";
import { Center, Title } from "@mantine/core";
import React from "react";

interface Props {
  name: string;
}

export const Banner = ({ name }: Props) => {
  const productName = name ? formatString(name) : "";

  return (
    <Center bg="gray.3" h={200}>
      <Title c="gray.7">Custom {productName} Order</Title>
    </Center>
  );
};
