import { SearchItem } from "@/types";
import { Box, Group, Avatar, Flex, Badge, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";

interface Props {
  item: SearchItem;
  link: string;
  badgeLabel?: string;
}

export const ResultItem = ({ item, link, badgeLabel }: Props) => (
  <Box
    component={Link}
    href={link}
    w={{ base: "95%", md: "45%" }}
    m="xs"
    p="xs"
  >
    <Group wrap="nowrap" justify="space-between">
      <Group wrap="nowrap">
        <Avatar size="sm" src={item.image}>
          {item.title.charAt(0)}
        </Avatar>
        <Text lineClamp={1}>{item.title}</Text>
      </Group>
      <Flex justify="flex-end">
        <Badge variant="light" color="pink" size="xs">
          {badgeLabel || item.type?.title}
        </Badge>
      </Flex>
    </Group>
  </Box>
);
