import { Badge, Box, Group, Text } from "@mantine/core";
import React from "react";

interface Props {
  showTitle?: boolean;
  errors: string[];
}
export const ErrorsRenderer = ({ errors, showTitle = true }: Props) => {
  return (
    <Box>
      {showTitle && (
        <Text c="red" size="xs" my="md">
          You have {errors.length} {errors.length === 1 ? "error" : "errors"}
        </Text>
      )}
      <Group pt="sm">
        {errors.map((error, index) => (
          <Badge key={index} variant="light" color="red" size="xs">
            {error}
          </Badge>
        ))}
      </Group>
    </Box>
  );
};
