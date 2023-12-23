"use client";
import { LoginDataSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PrimaryButton } from "../../components/PrimaryButton";
import { signIn } from "@/lib/actions/auth.actions";
import { useState } from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";

type LoginData = z.infer<typeof LoginDataSchema>;

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
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
    const res = await signIn(data);
    setIsLoading(false);

    if (!res?.success) {
      return false;
    }

    reset();
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            className="simple-input"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
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

        <PrimaryButton type="submit">Sign in</PrimaryButton>
      </form>
    </>
  );
};
