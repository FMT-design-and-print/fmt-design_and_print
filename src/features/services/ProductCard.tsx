import { Card, Group, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";

type Props = {
  image: string;
  label: string;
  link: string;
};
export const ProductCard = ({ image, label, link }: Props) => {
  // TODO: Image placeholder if there's no product image
  return (
    <Card component={Link} href={link} withBorder>
      <Group>
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundColor: "gray",
            width: 50,
            height: 50,
            borderRadius: 50,
          }}
        />
        <div>
          <Text tt="uppercase" fw="bold">
            {label}
          </Text>
        </div>
      </Group>
    </Card>
  );
};
