import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import React from "react";
import classes from "./Style.module.css";
import Link from "next/link";

interface Props {
  icon: string;
  title: string;
  tagline: string;
  link: string;
}
export const CategoryCard = ({ icon, title, link, tagline }: Props) => {
  return (
    <UnstyledButton component={Link} href={link} className={classes.link}>
      <Group wrap="nowrap" align="flex-start">
        <Avatar radius="xs" src={icon} size="md" className={classes.icon} />
        <div>
          <Text size="sm" fw={500}>
            {title}
          </Text>
          <Text size="xs" c="dimmed">
            {tagline}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  );
};
