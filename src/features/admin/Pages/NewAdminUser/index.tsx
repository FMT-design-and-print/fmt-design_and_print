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
import { ZodSchema, z } from "zod";
import { validateForm } from "@/functions/validate-form";

export const schema: ZodSchema = z.object({
  role: z.string(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),
  avatar: z.string().min(1, { message: "Provide avatar" }),
  sendMail: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export const CreateNewAdminUser = () => {
  const [role, setRole] = useState("editor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [sendMail, setSendMail] = useState(true);
  const [errors, setErrors] = useState<FormData | null>({});

  const generateTemporalPassword = () => {
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);
  };

  const generateAvatar = () => {
    const generator = new AvatarGenerator();
    setAvatar(generator.generateRandomAvatar());
  };

  const handleCreateNewAdminUser = () => {
    const formData = {
      role,
      email,
      password,
      firstName,
      lastName,
      avatar,
      sendMail,
    };
    const result = validateForm(formData, schema);

    if (result.success) {
      console.log("Validation succeeded!");
      //   TODO: creating new user
      // 1. Sign User Up - add role and userType to auth table
      // 2. Add user details to admins table with role
      // 3. Send user email to reset their password
    } else {
      setErrors(result.errors);
    }
  };

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
        error={errors?.role}
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
          error={errors?.email}
        />
        <Flex align="flex-end" gap={4}>
          <PasswordInput
            label="Password"
            description="Generate a temporal password"
            placeholder="Password"
            style={{ flex: 1 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors?.password}
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
          error={errors?.firstName}
        />
        <TextInput
          label="Last Name"
          placeholder="Comrah"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors?.lastName}
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
          error={errors?.avatar}
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
        <Button className="btn" miw={200} onClick={handleCreateNewAdminUser}>
          Create User
        </Button>
      </Group>
    </>
  );
};
