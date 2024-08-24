"use client";
import { AuthCard } from "@/components/AuthCard";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PrimaryButton } from "@/components/PrimaryButton";
import {
  alreadyConfirmedMsg,
  exceededRequestLimitMsg,
  resendLinkFailed,
  userNotFoundMessage,
} from "@/constants";
import { MessageStatus } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
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
export const ResendConfirmLinkForm = ({ searchParams }: Props) => {
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
    `/resend-confirm-link?message=${message}&messageStatus=error`;

  const onSubmit = async (res: Data) => {
    const email = res.email;

    const supabase = createClient();

    setIsLoading(true);
    const { data: user, error: err } = await supabase
      .from("users")
      .select(
        "id, email, provider, requestedConfirmLinkNumberOfTimes, confirmed"
      )
      .eq("email", email)
      .limit(1);

    if (err) {
      // error encountered when loading user details
      setIsLoading(false);
      return push(getPath(userNotFoundMessage));
    }

    if (!user || user.length === 0) {
      // no user was found
      setIsLoading(false);
      return push(getPath(userNotFoundMessage));
    } else {
      if (user[0].provider?.toLowerCase() !== "email" || user[0].confirmed) {
        // User signed up using OAuth
        setIsLoading(false);
        return push(getPath(alreadyConfirmedMsg));
      }

      if (user[0].requestedConfirmLinkNumberOfTimes >= 3) {
        setIsLoading(false);
        return push(getPath(exceededRequestLimitMsg));
      }
    }

    // resend confirm link after user is verified
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      return push(getPath(resendLinkFailed));
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        requestedConfirmLinkNumberOfTimes:
          user[0].requestedConfirmLinkNumberOfTimes + 1,
      })
      .eq("email", email);

    if (updateError) {
      // Todo: handle error logging
      console.error(error);
    }

    setIsLoading(false);

    reset();
    setLinkSent(true);
  };

  return (
    <>
      {linkSent ? (
        <p className="mx-8 my-6 mb-1 bg-blue-200 px-4 py-2 text-center text-blue-600">
          If your email address is in our records, confirmation link has been
          sent to your email. Follow to confirm your signup.
        </p>
      ) : (
        <AuthCard title="Resend Confirmation Link" searchParams={searchParams}>
          <LoadingOverlay visible={isLoading} />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="email" className="text-sm leading-10">
                Enter email address to receive confirmation link
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
        </AuthCard>
      )}
    </>
  );
};
