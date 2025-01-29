import { Button, Group, Paper, Text, Title } from "@mantine/core";
import Link from "next/link";

interface Props {
  setScreen?: (screen: "request" | "success") => void;
}

export const RequestSuccess = ({ setScreen }: Props) => {
  return (
    <Paper p="xl">
      <Title order={2} ta="center" c="green" mb="lg">
        Request Sent!
      </Title>
      <Text ta="center" c="dimmed">
        Thank you for your request. This is just to let you know that,
        we&apos;ve received it and will provide a feedback as soon as possible
      </Text>{" "}
      <Group justify="center" mt="xl">
        <Button
          size="sm"
          variant="default"
          color="gray"
          onClick={() => setScreen?.("request")}
        >
          Make a new request
        </Button>
        <Button component={Link} href="/services" className="btn" size="sm">
          Continue Shopping
        </Button>
      </Group>
    </Paper>
  );
};
