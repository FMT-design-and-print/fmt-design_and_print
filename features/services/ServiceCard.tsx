import { Card, Flex, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  color: string;
  image: string;
  label: string;
  link: string;
}
export const ServiceCard = ({ color, image, label, link }: Props) => {
  return (
    <Card
      w={{ base: 250, md: 300 }}
      component={Link}
      href={link}
      withBorder
      style={{ borderColor: color }}
    >
      <Flex justify="center" p={16}>
        <Image src={image} alt={label} width={100} height={100} />
      </Flex>
      <Text ta="center" p={16} style={{ color }}>
        {label}
      </Text>
    </Card>
  );
};
