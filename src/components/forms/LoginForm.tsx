"use client";
import { LoginDataSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PrimaryButton } from "../PrimaryButton";
import { signIn } from "@/lib/actions/auth.actions";

type LoginData = z.infer<typeof LoginDataSchema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginDataSchema),
  });

  const onSubmit = async (data: LoginData) => {
    const res = await signIn(data);

    if (!res?.success) {
      return false;
    }

    reset();
  };

  return (
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
  );
};
