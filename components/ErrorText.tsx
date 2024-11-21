import { Text } from "@mantine/core";

export const ErrorText = ({ text }: { text: string }) => (
  <Text size="xs" fs="italic" c="red" mb="md">
    {text}
  </Text>
);
