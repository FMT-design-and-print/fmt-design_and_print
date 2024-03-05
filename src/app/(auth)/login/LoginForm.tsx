"use client";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { authFailedMessage } from "@/constants";
import { signIn } from "@/lib/actions/auth.actions";
import { LoginDataSchema } from "@/lib/validations";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PrimaryButton } from "../../../components/PrimaryButton";

type LoginData = z.infer<typeof LoginDataSchema>;

const errorStatus = "messageStatus=error";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const { setSession, setUser } = useSession((state) => state);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmLink, setShowConfirmLink] = useState(false);

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
    const { session, error } = await signIn(data);

    if (error) {
      const msg = "Email not confirmed";
      setIsLoading(false);
      if (error.message.toLowerCase() === msg.toLowerCase()) {
        setShowConfirmLink(true);
        return router.push(`/login?message=${msg}&${errorStatus}`);
      }
      setShowConfirmLink(false);
      // TODO: Error logging
      return router.push(`/login?message=${authFailedMessage}&${errorStatus}`);
    }

    if (session) {
      setSession(session);
      setUser(session?.user);

      if (redirectPath) {
        router.push(redirectPath);
        router.refresh();
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setIsLoading(false);
    reset({ email: data.email, password: "" });
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
        {showConfirmLink && (
          <Button
            component={Link}
            href="/resend-confirm-link"
            variant="outline"
            color="gray"
          >
            Resend confirm link
          </Button>
        )}
      </form>
    </>
  );
};
