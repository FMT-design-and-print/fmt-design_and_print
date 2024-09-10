"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PrimaryButton } from "@/components/PrimaryButton";
import { resetPassword } from "@/lib/actions/auth.actions";
import { LoadingOverlay } from "@/components/LoadingOverlay";

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

export const PasswordResetForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>({
    resolver: zodResolver(Schema),
  });

  const onSubmit = async (data: Data) => {
    setIsLoading(true);
    await resetPassword(data);
    setIsLoading(false);
  };

  return (
    <>
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
    </>
  );
};
