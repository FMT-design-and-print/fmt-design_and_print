import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import React, { ReactNode } from "react";
import classes from "./Style.module.css";
import Link from "next/link";

interface Props {
  icon: string | ReactNode;
  title: string;
  tagline: string;
  link: string;
}
export const CategoryCard = ({ icon, title, link, tagline }: Props) => {
  return (
    <UnstyledButton component={Link} href={link}>
      <Group wrap="nowrap" align="flex-start">
        {typeof icon === "string" ? (
          <Avatar radius="xs" src={icon} size="md" className={classes.icon} />
        ) : (
          <Avatar radius="xs" size="md" className={classes.icon}>
            {icon}
          </Avatar>
        )}
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
