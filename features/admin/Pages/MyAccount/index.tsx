import { Container, Title, Box, Tabs } from "@mantine/core";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";

export default function MyAccount() {
  return (
    <Container size="md">
      <Box py="xl">
        <Title order={2} mb="lg">
          My Account
        </Title>
        <Tabs defaultValue="profile">
          <Tabs.List>
            <Tabs.Tab value="profile">Profile Details</Tabs.Tab>
            <Tabs.Tab value="password">Change Password</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="profile" pt="xl">
            <ProfileForm />
          </Tabs.Panel>

          <Tabs.Panel value="password" pt="xl">
            <PasswordForm />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </Container>
  );
}
