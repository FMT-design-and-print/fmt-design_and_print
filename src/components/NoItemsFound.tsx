import { Card, Center, Stack, Text } from "@mantine/core";
import React from "react";
import { FiInbox } from "react-icons/fi";

interface Props {
  label?: string;
}
export const NoItemsFound = ({ label }: Props) => {
  return (
    <Card bg="gray.1" w="100%" withBorder>
      <Center>
        <Stack py="xl" justify="center" align="center">
          <FiInbox size="10rem" style={{ color: "gray" }} />
          <Text ta="center" fs="italic" c="dimmed">
            {label || "No items found"}
          </Text>
        </Stack>
      </Center>
    </Card>
  );
};
