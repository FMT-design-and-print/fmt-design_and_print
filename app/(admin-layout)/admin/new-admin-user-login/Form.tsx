"use client";
import { signIn } from "@/lib/actions/auth.actions";
import { LoginDataSchema } from "@/lib/validations";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Container,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type LoginData = z.infer<typeof LoginDataSchema>;

export function NewAdminUserLoginForm() {
  const router = useRouter();

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

    const supabase = createClient();
    const { data: admins, error } = await supabase
      .from("admins")
      .select("email, confirmed")
      .eq("email", data.email)
      .returns<{ email: string; confirmed: boolean }[]>();

    if (error) {
      setErrorMsg("Could not confirm details. Try again");
      setIsLoading(false);
      reset({ email: data.email, password: "" });
      return;
    }

    if (admins.length === 0) {
      setErrorMsg("Admin user not found");
      setIsLoading(false);
      return;
    }

    if (!admins[0].confirmed) {
      setErrorMsg(undefined);
      const { session, error: signInError } = await signIn(data);

      if (signInError) {
        if (signInError.message === "Invalid login credentials") {
          setErrorMsg("Invalid user credentials");
          setIsLoading(false);
        } else {
          setErrorMsg("Could not log you in");
          setIsLoading(false);
        }
        return;
      }

      if (session) {
        setErrorMsg(undefined);
        return router.push("/admin/reset-password");
      }
    }
  };

  return (
    <Container size={420} my={40} pos="relative">
      <LoadingOverlay visible={isLoading} />
      <Title ta="center">Confirm login</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Enter account details sent to your email to reset your password
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
            label="Temporal password"
            placeholder="••••••••"
            mt="md"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}

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
