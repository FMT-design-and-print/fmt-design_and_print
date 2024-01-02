"use client";
import { AuthCard } from "@/components/AuthCard";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  OAuthResetFailedMessage,
  unableToVerifyEmailMessage,
  userNotFoundMessage,
} from "@/constants";
import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
});

type Data = z.infer<typeof Schema>;

interface Props {
  searchParams: {
    message: string;
    messageStatus: MessageStatus;
  };
}
export const ForgotPassword = ({ searchParams }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();
  const [linkSent, setLinkSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Data>({
    resolver: zodResolver(Schema),
  });

  const getPath = (message: string) =>
    `/forgot-password?message=${message}&messageStatus=error`;

  const onSubmit = async (res: Data) => {
    const email = res.email;

    const supabase = createClient();

    setIsLoading(true);
    const { data: users, error: err } = await supabase
      .from("users")
      .select("email, provider")
      .eq("email", email);

    if (err) {
      // error encountered when loading user details
      setIsLoading(false);
      return push(getPath(userNotFoundMessage));
    }

    if (users?.length === 0) {
      // no user was found
      setIsLoading(false);
      return push(getPath(userNotFoundMessage));
    }

    if (users && users[0].provider?.toLowerCase() !== "email") {
      // User signed up using OAuth
      setIsLoading(false);
      return push(getPath(OAuthResetFailedMessage));
    }

    // reset the password, after user is verified to exist
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    setIsLoading(false);

    if (error) {
      return push(getPath(unableToVerifyEmailMessage));
    }
    reset();
    setLinkSent(true);
  };

  return (
    <>
      {linkSent ? (
        <p className="mx-8 my-6 mb-1 bg-blue-200 px-4 py-2 text-center text-blue-600">
          Password reset link has been sent to your email. Follow to reset your
          password
        </p>
      ) : (
        <AuthCard title="Forgotten Password?" searchParams={searchParams}>
          <LoadingOverlay visible={isLoading} />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="email" className="text-sm leading-10">
                Enter email address to reset your password
              </label>
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
            <PrimaryButton type="submit">Continue</PrimaryButton>
          </form>

          <Link href="/login" className="my-4 text-sm text-gray-400">
            I Remember my password. Login
          </Link>
        </AuthCard>
      )}
    </>
  );
};
