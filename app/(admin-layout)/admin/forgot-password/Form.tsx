"use client";
import { emailRegex, userNotFoundMessage } from "@/constants";
import { sendResetEmail } from "@/functions/send-reset-password-email";
import { createClient } from "@/utils/supabase/client";
import {
  Alert,
  Button,
  Container,
  Group,
  Input,
  LoadingOverlay,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const handleSubmit = async () => {
    if (email.trim() === "") {
      return setErrorMsg("Email cannot be empty");
    }

    if (!email.match(emailRegex)) {
      return setErrorMsg("Invalid email address");
    }

    const supabase = createClient();

    setIsLoading(true);
    const { data: users, error: err } = await supabase
      .from("admins")
      .select("email, role")
      .eq("email", email);

    if (err || users?.length === 0) {
      setIsLoading(false);
      return setErrorMsg(userNotFoundMessage);
    }

    const { error } = await sendResetEmail(email);

    if (error) {
      setIsLoading(false);
      setErrorMsg("Unable to send password reset code. Try again later");
    } else {
      sessionStorage.setItem("emailForOTP", email);
      return router.push("/admin/verify-otp");
    }
  };

  return (
    <>
      <Container size={420} my={40} pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Title ta="center" order={2}>
          Forgotten your password?
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Enter email address to reset your password
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Input.Label>Email address</Input.Label>
          <TextInput
            type="email"
            placeholder="you@fmtdesignprint.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />

          <Button fullWidth mt="xl" className="btn" onClick={handleSubmit}>
            Continue
          </Button>

          <Group justify="flex-end" mt="lg">
            <Link href="/admin/login" className="my-4 text-sm text-gray-400">
              I Remember my password. Login
            </Link>
          </Group>

          {errorMsg && (
            <Alert color="red" variant="light" mt="md">
              <Text ta="center" c="red.6" fs="italic" size="sm">
                {errorMsg}
              </Text>
            </Alert>
          )}
        </Paper>
      </Container>
    </>
  );
}
