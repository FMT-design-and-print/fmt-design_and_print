"use client";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { authFailedMessage } from "@/constants";
import { sendConfirmEmail, signIn } from "@/lib/actions/auth.actions";
import { LoginDataSchema } from "@/lib/validations";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PrimaryButton } from "@/components/PrimaryButton";

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
    getValues,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(LoginDataSchema),
  });

  const redirectPath = searchParams.get("redirect");

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    const { session, error } = await signIn(data);

    if (error) {
      setIsLoading(false);
      const msg = "Email not confirmed";
      if (error.message.toLowerCase() === msg.toLowerCase()) {
        setShowConfirmLink(true);
        return router.push(`/login?message=${msg}&${errorStatus}`);
      }

      setShowConfirmLink(false);
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

  const confirmEmail = async () => {
    const { email, password } = getValues();
    setIsLoading(true);
    const json = await sendConfirmEmail(email, password);

    if (json.error) {
      setIsLoading(false);
      return router.push(
        `/login?message=Error sending confirmation code&${errorStatus}`
      );
    }

    sessionStorage.setItem("emailForOTP", email);
    reset();
    return router.push("/verify-otp");
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
      {showConfirmLink && (
        <form action={confirmEmail}>
          <Button type="submit" variant="outline" color="gray" w="100%" mt="md">
            Confirm email
          </Button>
        </form>
      )}
    </>
  );
};
