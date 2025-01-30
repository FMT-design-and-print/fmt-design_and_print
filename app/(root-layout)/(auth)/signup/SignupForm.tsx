"use client";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PrimaryButton } from "@/components/PrimaryButton";
import { signUpFailedMessage, userExistMessage } from "@/constants";
import { signUp } from "@/lib/actions/auth.actions";
import { SignUpDataSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SignUpData = z.infer<typeof SignUpDataSchema>;

const errorStatus = "messageStatus=error";

export const SignupForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(SignUpDataSchema),
  });

  const onSubmit = async (data: SignUpData) => {
    setIsLoading(true);

    const json = await signUp(data);

    if (json.error) {
      setIsLoading(false);
      const error = json.error;

      if (error.code === "email_exists") {
        return router.push(
          `/signup?message=${userExistMessage}&${errorStatus}`
        );
      }
      return router.push(
        `/signup?message=${signUpFailedMessage}&${errorStatus}`
      );
    } else {
      sessionStorage.setItem("emailForOTP", data.email);
      reset();
      return router.push("/verify-otp");
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div>
          <label htmlFor="email" className="text-sm">
            Email:
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
        <div>
          <label htmlFor="password" className="text-sm">
            Password:
          </label>
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
          <label htmlFor="confirmPassword" className="text-sm">
            Confirm Password:
          </label>
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
    </>
  );
};
