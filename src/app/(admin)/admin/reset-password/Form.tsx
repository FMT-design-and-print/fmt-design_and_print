import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";

export function AdminLoginForm() {
  return (
    <Container size={420} my={40}>
      <Title ta="center">Admin login</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter details to login to admin panel
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput label="Email" placeholder="you@mantine.dev" required />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <Group justify="flex-end" mt="lg">
          <Anchor
            component={Link}
            href="/admin/reset-password"
            size="sm"
            c="pink"
          >
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" className="btn">
          Sign in
        </Button>
      </Paper>
    </Container>
  );
}
