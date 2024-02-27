"use client";
import { LoginDataSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PrimaryButton } from "../../components/PrimaryButton";
import { signIn } from "@/lib/actions/auth.actions";
import { useState } from "react";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/store";

type LoginData = z.infer<typeof LoginDataSchema>;

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const { setSession, setUser } = useSession((state) => state);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginDataSchema),
  });

  const redirectPath = searchParams.get("redirect");

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    const { session } = await signIn(data);
    setSession(session);
    setUser(session?.user);

    if (redirectPath) {
      router.push(redirectPath);
    } else {
      router.push("/");
    }
    setIsLoading(false);

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
