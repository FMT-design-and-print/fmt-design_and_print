import { SearchItem } from "@/types";
import { Divider, Flex, Box, Group, Avatar, Badge, Text } from "@mantine/core";
import Link from "next/link";
import React from "react";

export interface Props {
  label: string;
  badgeLabel?: string;
  searchResults: SearchItem[];
}
export const Results = ({ searchResults, label, badgeLabel }: Props) => {
  if (!searchResults || searchResults.length === 0) return null;

  return (
    <>
      <Divider label={`${label} (${searchResults.length})`} />
      <Flex wrap="wrap" mah={200} style={{ overflowY: "auto" }}>
        {searchResults.map((item) => (
          <Box
            component={Link}
            href={`/services/print/slug`}
            key={item.id}
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
        ))}
      </Flex>
    </>
  );
};
