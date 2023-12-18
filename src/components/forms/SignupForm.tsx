"use client";
import { SignUpDataSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PrimaryButton } from "../PrimaryButton";
import { signUp } from "@/lib/actions/auth.actions";

type SignUpData = z.infer<typeof SignUpDataSchema>;

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(SignUpDataSchema),
  });

  const onSubmit = async (data: SignUpData) => {
    const res = await signUp(data);

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
      <div>
        <label htmlFor="confirmPassword">Confirm Password:</label>
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
      <PrimaryButton type="submit">Sign up</PrimaryButton>
    </form>
  );
};
