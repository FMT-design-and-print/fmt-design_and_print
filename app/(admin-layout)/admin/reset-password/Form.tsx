"use client";
import { passwordResetFailedMessage } from "@/constants";
import { createClient } from "@/utils/supabase/client";
import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [resetSuccess, setResetSuccess] = useState(false);

  const supabase = createClient();

  const handleSubmit = async () => {
    if (password.trim() === "") {
      return setErrorMsg("Password cannot be empty");
    }

    if (password !== confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setIsLoading(false);

      if (error.code === "same_password") {
        return setErrorMsg("New password cannot be the same as the old one");
      }

      return setErrorMsg(passwordResetFailedMessage);
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { error: updateError } = await supabase
      .from("admins")
      .update({ confirmed: true })
      .eq("email", session?.user.email as string)
      .returns<{ email: string; confirmed: boolean }[]>();

    if (updateError) {
      setIsLoading(false);
      return setErrorMsg(passwordResetFailedMessage);
    }

    setResetSuccess(true);
    setIsLoading(false);
    setErrorMsg(undefined);
  };

  if (resetSuccess) {
    return (
      <Center py="10rem">
        <Alert color="green" my="xl">
          Your password has been reset successfully.
          <Button
            variant="light"
            color="pink"
            onClick={() => router.push("/admin")}
            mx="lg"
          >
            Log me in
          </Button>
        </Alert>
      </Center>
    );
  }
  return (
    <>
      <Container size={420} my={40} mih={500} pos="relative">
        <LoadingOverlay visible={isLoading} />
        <Title ta="center">Reset Password</Title>
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <PasswordInput
            placeholder="••••••••"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            mb="md"
          />

          <PasswordInput
            placeholder="••••••••"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            required
          />

          <Button fullWidth mt="xl" className="btn" onClick={handleSubmit}>
            Reset Password
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
