"use client";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { generatePassword } from "@/functions";
import { validateForm } from "@/functions/validate-form";
import { createAdminClient, createClient } from "@/utils/supabase/client";
import {
  Avatar,
  Box,
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
import { useQueryClient } from "@tanstack/react-query";
import { AvatarGenerator } from "random-avatar-generator";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ZodSchema, z } from "zod";
import { adminRoles } from "../../adminRoles";

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
  const queryClient = useQueryClient();
  const [role, setRole] = useState("editor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [sendMail, setSendMail] = useState(true);
  const [errors, setErrors] = useState<FormData | null>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateTemporalPassword = () => {
    const generatedPassword = generatePassword();
    setPassword(generatedPassword);
  };

  const generateAvatar = () => {
    const generator = new AvatarGenerator();
    setAvatar(generator.generateRandomAvatar());
  };

  const handleCreateNewAdminUser = async () => {
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
      setIsLoading(true);
      // 1. create new user
      const supabaseAdmin = createAdminClient();
      const { data: createdUser, error: createUserError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            userType: "admin",
            role,
            firstName,
            lastName,
            avatar,
          },
        });

      if (createUserError) {
        console.error(createUserError);
        toast.error("Error creating user");
        setIsLoading(false);
        return;
      }
      const supabase = createClient();
      // 2. Add user details to admins table with role
      const { error: addDataError } = await supabase.from("admins").insert([
        {
          id: createdUser.user?.id,
          role,
          email,
          firstName,
          lastName,
          avatar,
        },
      ]);

      if (addDataError) {
        console.error(addDataError);
        toast.error("Error saving user details to DB");
        setIsLoading(false);
        return;
      }

      // 3. Send user email to reset their password
      if (sendMail) {
        await fetch("/api/send", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ firstName, email, tempPassword: password }),
        });
      }

      setIsLoading(false);
      resetForm();
      toast.success("Admin user created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    } else {
      setErrors(result.errors);
    }
  };

  const resetForm = () => {
    setRole("editor");
    setEmail("");
    setFirstName("");
    setLastName("");
    generateAvatar();
    generateTemporalPassword();
    setErrors({});
  };

  useEffect(() => {
    generateAvatar();
    generateTemporalPassword();
  }, []);

  return (
    <Box pos="relative">
      <LoadingOverlay visible={isLoading} />

      <Title order={3}>Create New Admin User</Title>
      <Divider my="sm" />
      <Card withBorder w={{ base: "100%", md: "500px" }}>
        <Select
          defaultValue="editor"
          label="Role"
          data={adminRoles}
          value={role}
          onChange={(value) => setRole(value || "editor")}
          error={errors?.role}
        />
        <Space my="xs" />

        <TextInput
          size="sm"
          label="Email Address"
          description="Enter a valid email address"
          type="email"
          placeholder="email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors?.email}
        />
        <Space my="xs" />

        <Flex align="flex-end" gap={4}>
          <PasswordInput
            size="sm"
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
        <Space my="xs" />

        <TextInput
          size="sm"
          label="First Name"
          placeholder="John"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={errors?.firstName}
        />
        <Space my="xs" />

        <TextInput
          size="sm"
          label="Last Name"
          placeholder="Comrah"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={errors?.lastName}
        />
        <Space my="xs" />

        <Flex gap={16} align="flex-end">
          <Card withBorder p="xs">
            <Avatar src={avatar} size="lg" />
          </Card>
          <Flex align="flex-end" gap={4} style={{ flex: 1 }}>
            <TextInput
              size="sm"
              label="Avatar"
              placeholder="avatar url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              style={{ flex: 1 }}
              error={errors?.avatar}
            />
            <Button size="sm" onClick={generateAvatar} color="gray">
              Generate
            </Button>
          </Flex>
        </Flex>
        <Space my="xs" />

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
      </Card>
    </Box>
  );
};
