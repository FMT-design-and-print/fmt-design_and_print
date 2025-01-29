"use client";
import { AuthCard } from "@/components/AuthCard";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PrimaryButton } from "@/components/PrimaryButton";
import { passwordResetFailedMessage, samePasswordMessage } from "@/constants";
import { resetPassword } from "@/lib/actions/auth.actions";
import { MessageStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Button, Center } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Schema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type Data = z.infer<typeof Schema>;

const getPath = (message: string, status?: string) =>
  `/reset-password?message=${message}&messageStatus=${status || "error"}`;

interface Props {
  searchParams: {
    message: string;
    messageStatus?: MessageStatus;
  };
}

export const PasswordResetForm = ({ searchParams }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>({
    resolver: zodResolver(Schema),
  });

  const onSubmit = async (data: Data) => {
    setIsLoading(true);
    const { error } = await resetPassword(data);

    if (error) {
      setIsLoading(false);
      return error.message === samePasswordMessage
        ? router.push(getPath(samePasswordMessage))
        : router.push(getPath(passwordResetFailedMessage));
    }

    setResetSuccess(true);
    setIsLoading(false);
  };

  if (resetSuccess) {
    return (
      <Center py="10rem">
        <Alert color="green" my="xl">
          Your password has been reset successfully.
          <Button
            variant="light"
            color="pink"
            onClick={() => router.push("/")}
            mx="lg"
          >
            Log me in
          </Button>
        </Alert>
      </Center>
    );
  }

  return (
    <AuthCard title="Reset Password" searchParams={searchParams}>
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            id="password"
            className="simple-input"
            type="password"
            placeholder="••••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-400">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            id="confirmPassword"
            className="simple-input"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <PrimaryButton type="submit">Reset</PrimaryButton>
      </form>
    </AuthCard>
  );
};
