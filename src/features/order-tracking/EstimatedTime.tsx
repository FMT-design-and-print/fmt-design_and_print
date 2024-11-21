import { Group, Text } from "@mantine/core";
import React from "react";

interface Props {
  label: string;
  time: string;
}
export const EstimatedTime = ({ label, time }: Props) => {
  return (
    <Group>
      <Text fw={500} size="sm">
        {label}
      </Text>
      <Text fw={600} size="sm">
        {time}
      </Text>
    </Group>
  );
};
