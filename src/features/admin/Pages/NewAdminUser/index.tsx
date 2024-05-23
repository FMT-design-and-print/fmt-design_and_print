"use client";
import { FlexLayout } from "@/components/FlexLayout";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Group,
  PasswordInput,
  Select,
  Space,
  TextInput,
  Title,
} from "@mantine/core";
import { adminRoles } from "../../adminRoles";
import { useEffect, useState } from "react";
import { generatePassword } from "@/functions";
import { AvatarGenerator } from "random-avatar-generator";

export const CreateNewAdminUser = () => {
  const [role, setRole] = useState("editor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [sendMail, setSendMail] = useState(true);

  const generateTemporalPassword = () => {
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);
  };

  const generateAvatar = () => {
    const generator = new AvatarGenerator();
    setAvatar(generator.generateRandomAvatar());
  };

  //   TODO: creating new user
  // 1. Sign User Up - add role and userType to auth table
  // 2. Add user details to admins table with role
  // 3. Send user email to reset their password

  useEffect(() => {
    generateAvatar();
    generateTemporalPassword();
  }, []);

  return (
    <>
      <Title order={3}>Create New Admin User</Title>
      <Divider my="sm" />

      <Select
        defaultValue="editor"
        label="Role"
        data={adminRoles}
        value={role}
        onChange={(value) => setRole(value || "editor")}
      />
      <Space my="lg" />
      <FlexLayout grow>
        <TextInput
          label="Email Address"
          description="Enter a valid email address"
          type="email"
          placeholder="email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Flex align="flex-end" gap={4}>
          <PasswordInput
            label="Password"
            description="Generate a temporal password"
            placeholder="Password"
            style={{ flex: 1 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            size="sm"
            w="100"
            color="gray"
            onClick={generateTemporalPassword}
          >
            Generate
          </Button>
        </Flex>
      </FlexLayout>
      <Space my="lg" />
      <FlexLayout grow>
        <TextInput
          label="First Name"
          placeholder="John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextInput
          label="Last Name"
          placeholder="Comrah"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </FlexLayout>
      <Space my="lg" />
      <Flex gap={16} align="flex-end">
        <Card withBorder p="xs">
          <Avatar src={avatar} size="lg" />
        </Card>
        <TextInput
          label="Avatar"
          placeholder="avatar url"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
          rightSection={
            <Button size="sm" onClick={generateAvatar} color="gray">
              Generate
            </Button>
          }
          rightSectionWidth={100}
          style={{ flex: 1 }}
        />
      </Flex>
      <Space my="xl" />
      <Group justify="space-between">
        <Checkbox
          label="Send Email to User"
          color="pink"
          checked={sendMail}
          onChange={(e) => setSendMail(e.target.checked)}
        />
        <Button className="btn" miw={200}>
          Create User
        </Button>
      </Group>
    </>
  );
};
