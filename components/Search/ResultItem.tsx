import { SearchItem } from "@/types";
import { Avatar, Badge, Box, Flex, Group, Text } from "@mantine/core";
import Link from "next/link";

interface Props {
  item: SearchItem;
  link: string;
  badgeLabel?: string;
  close: () => void;
}

export const ResultItem = ({ item, link, badgeLabel, close }: Props) => (
  <Box
    component={Link}
    href={link}
    w={{ base: "95%", lg: "45%" }}
    m="2px"
    p="xs"
    onClick={close}
  >
    <Group wrap="nowrap" justify="space-between">
      <Group wrap="nowrap">
        <Avatar size="sm" src={item.image}>
          {item.title.charAt(0)}
        </Avatar>
        <Text lineClamp={1} size="sm">
          {item.title}
        </Text>
      </Group>
      <Flex justify="flex-end">
        <Badge variant="light" color="pink" size="xs">
          {badgeLabel || item.type?.title}
        </Badge>
      </Flex>
    </Group>
  </Box>
);
