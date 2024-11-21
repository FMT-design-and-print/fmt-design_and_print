import { Card, Stack, Text } from "@mantine/core";
import { ReactNode } from "react";
import { FiInbox } from "react-icons/fi";

interface Props {
  label?: string;
  icon?: ReactNode;
  children?: ReactNode;
  mih?: number;
}
export const NoItemsFound = ({ label, icon, children, mih }: Props) => {
  return (
    <Card bg="gray.1" w="100%" withBorder my="sm">
      <Stack justify="center" align="center" mih={mih || 250} py="2rem">
        {icon || <FiInbox size="10rem" style={{ color: "gray" }} />}
        <Text ta="center" fs="italic" c="dimmed">
          {label || "No items found"}
        </Text>
        {children}
      </Stack>
    </Card>
  );
};
