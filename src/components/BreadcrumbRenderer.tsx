"use client";
import { Anchor, Breadcrumbs, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import React from "react";

interface Props {
  items: {
    title: string;
    href: string;
  }[];
}
export const BreadcrumbRenderer = ({ items }: Props) => {
  const sm = useMediaQuery("(max-width: 56.25em)");

  return (
    <Breadcrumbs m="xl" visibleFrom="xs">
      {items.map((item, index) =>
        index === items.length - 1 ? (
          <Text key={index} c="dimmed" tt="capitalize" size={sm ? "xs" : "md"}>
            {item.title}
          </Text>
        ) : (
          <Anchor
            href={item.href}
            key={index}
            tt="capitalize"
            size={sm ? "xs" : "md"}
          >
            {item.title}
          </Anchor>
        )
      )}
    </Breadcrumbs>
  );
};
