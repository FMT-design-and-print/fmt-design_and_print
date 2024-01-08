import { Avatar, Card, Group, Text } from "@mantine/core";
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

  return (
    <Card component={Link} href={link || ""} withBorder p={sm ? "xs" : "sm"}>
      <Group>
        <Avatar src={image} alt={label} radius="xl" size={sm ? "sm" : "md"}>
          {label.charAt(0)}
        </Avatar>

        <div>
          <Text tt="uppercase" fw="bold" size={sm ? "xs" : "md"}>
            {label}
          </Text>
        </div>
      </Group>
    </Card>
  );
};
