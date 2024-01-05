import { Card, Group, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import React from "react";

type Props = {
  image: string;
  label: string;
  link: string;
};
export const ProductTypeCard = ({ image, label, link }: Props) => {
  const sm = useMediaQuery("(max-width: 56.25em)");
  // TODO: Image placeholder if there's no product image
  return (
    <Card component={Link} href={link} withBorder p={sm ? "xs" : "sm"}>
      <Group>
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundColor: "gray",
            width: sm ? 35 : 50,
            height: sm ? 35 : 50,
            borderRadius: 50,
          }}
        />
        <div>
          <Text tt="uppercase" fw="bold" size={sm ? "xs" : "md"}>
            {label}
          </Text>
        </div>
      </Group>
    </Card>
  );
};
