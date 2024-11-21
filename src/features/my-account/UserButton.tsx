import { Avatar, Group, Text } from "@mantine/core";

interface Props {
  name: string;
  image: string;
  email: string;
}
export function UserButton({ name, image, email }: Props) {
  return (
    <Group py="md" px="sm">
      <Avatar src={image} radius="xl">
        {email.charAt(0).toUpperCase()}
      </Avatar>

      <div style={{ flex: 1 }}>
        <Text size="sm" fw={500}>
          {name}
        </Text>

        <Text c="dimmed" size="xs">
          {email}
        </Text>
      </div>
    </Group>
  );
}
