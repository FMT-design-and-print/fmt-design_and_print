"use client";
import {
  Anchor,
  Button,
  Divider,
  Group,
  HoverCard,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { IconType } from "react-icons";
import classes from "./Style.module.css";

interface Props {
  title: string;
  link: string;
  items: {
    icon: IconType;
    title: string;
    description: string;
    link: string;
  }[];
}

export const ServicesDropDown = ({ title, link, items }: Props) => {
  const theme = useMantineTheme();

  const links = items.map((item) => (
    <UnstyledButton
      component={Link}
      href={item.link}
      className={classes.link}
      key={item.title}
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon
            style={{ width: rem(22), height: rem(22) }}
            color={theme.colors.pink[4]}
          />
        </ThemeIcon>

        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
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
