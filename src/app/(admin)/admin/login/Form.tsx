"use client";
import { isAdminUser } from "@/functions/user";
import { signIn } from "@/lib/actions/auth.actions";
import { LoginDataSchema } from "@/lib/validations";
import { useSession } from "@/store";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Anchor,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type LoginData = z.infer<typeof LoginDataSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const { setSession, setUser } = useSession((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginDataSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    const { session, error } = await signIn(data);
    setIsLoading(false);
    reset({ email: data.email, password: "" });

    if (error) {
      setErrorMsg("Could not log you in");
    }

    if (session) {
      if (!isAdminUser(session.user)) {
        setErrorMsg("You are not an admin user");
        await logout();
        return;
      }

      setErrorMsg(undefined);
      setSession(session);
      setUser(session?.user);
      router.push("/admin");
    }
  };

  const logout = async () => {
    const supabase = createClient();
    supabase.auth.signOut();

    setSession(null);
    setUser(undefined);
  };

  return (
    <Container size={420} my={40} pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Title ta="center">Admin login</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter details to login to admin panel
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            id="email"
            label="Email"
            placeholder="you@mantine.dev"
            type="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}

          <PasswordInput
            id="password"
            label="Password"
            placeholder="Your password"
            mt="md"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
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
          <Button type="submit" fullWidth mt="xl" className="btn">
            Sign in
          </Button>
        </form>

        {errorMsg && (
          <Alert color="red" variant="light" mt="md">
            <Text ta="center" c="red.6" fs="italic" size="sm">
              {errorMsg}
            </Text>
          </Alert>
        )}
      </Paper>
    </Container>
  );
}
