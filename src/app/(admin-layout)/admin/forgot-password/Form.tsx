"use client";
import {
  emailRegex,
  unableToVerifyEmailMessage,
  userNotFoundMessage,
} from "@/constants";
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
import { useState } from "react";

export function AdminForgotPasswordForm() {
  const [linkSent, setLinkSent] = useState(false);
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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/admin/callback?next=/admin/reset-password`,
    });
    setIsLoading(false);

    if (error) {
      return setErrorMsg(unableToVerifyEmailMessage);
    }
    setEmail("");
    setErrorMsg(undefined);
    setLinkSent(true);
  };

  return (
    <>
      {" "}
      {linkSent ? (
        <Container size={420} my={40} mih={500}>
          <div className="mx-8 my-6 mb-1 bg-blue-200 px-4 py-2 text-center text-blue-600">
            <p>
              Password reset link has been sent to your email. Follow to reset
              your password
            </p>

            <Button
              component={Link}
              href="/admin/login"
              mx="auto"
              variant="light"
              mt="md"
            >
              Login
            </Button>
          </div>
        </Container>
      ) : (
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
      )}
    </>
  );
}
