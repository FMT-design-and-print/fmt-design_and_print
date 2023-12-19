"use client";
import { AuthCard } from "@/components/AuthCard";
import { PrimaryButton } from "@/components/PrimaryButton";
import { resetPassword } from "@/lib/actions/auth.actions";
import { MessageStatus } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");
  const messageStatus = searchParams?.get("messageStatus") as MessageStatus;
  const errorCode = searchParams?.get("error_code");

  const linkExpired = (errorCode && errorCode === "401") || false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Data>({
    resolver: zodResolver(Schema),
  });

  const onSubmit = async (data: Data) => {
    await resetPassword(data);
  };

  return (
    <>
      {linkExpired ? (
        <div className="mx-auto my-4 max-w-[400px] text-center">
          <p className=" mb-2 bg-red-100 px-4 py-2 text-small text-red-600">
            Password reset link is invalid or has expired
          </p>
          <Link href="/forgot-password">
            <Button variant="light" color="default" radius="sm">
              Request new link
            </Button>
          </Link>
        </div>
      ) : (
        <AuthCard
          title="Reset Password"
          searchParams={{ message: message || "", messageStatus }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
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
                <p className="text-sm text-red-400">
                  {errors.password.message}
                </p>
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
      )}
    </>
  );
};

export default ResetPassword;
