"use client";
import {
  Anchor,
  Button,
  Divider,
  Group,
  HoverCard,
  SimpleGrid,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { CategoryCard } from "./CategoryCard";

interface Props {
  title: string;
  link: string;
  items: {
    title: string;
    tagline: string;
    link: string;
    icon: string;
  }[];
}

export const ServicesDropDown = ({ title, link, items }: Props) => {
  const theme = useMantineTheme();

  const links = items.map((item) => (
    <CategoryCard
      key={item.title}
      title={item.title}
      icon={item.icon}
      tagline={item.tagline}
      link={item.link}
    />
  ));

  return (
    <HoverCard
      width={600}
      position="bottom"
      radius="md"
      shadow="md"
      withinPortal
    >
      <HoverCard.Target>
        <Button variant="transparent" px={4}>
          <Text c="white" component="span">
            {title}
          </Text>
          <IconChevronDown
            style={{ width: rem(16), height: rem(16), marginLeft: "5px" }}
            color={theme.colors.gray[1]}
          />
        </Button>
      </HoverCard.Target>

      <HoverCard.Dropdown style={{ overflow: "hidden" }}>
        <Group justify="space-between" px="md">
          <Text fw={500}>{title}</Text>
          <Anchor component={Link} href={link} c="pink" fz="xs">
            View all {title}
          </Anchor>
        </Group>

        <Divider my="sm" />

        <SimpleGrid cols={2} spacing={0}>
          {links}
        </SimpleGrid>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
