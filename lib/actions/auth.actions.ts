"use server";
import { UserType } from "@/types/user";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  LoginDataSchema,
  ResetPasswordDataSchema,
  SignUpDataSchema,
} from "../validations";
import { headers } from "next/headers";

type SignUpData = z.infer<typeof SignUpDataSchema>;
type LoginData = z.infer<typeof LoginDataSchema>;
type ResetData = z.infer<typeof ResetPasswordDataSchema>;

export const signIn = async (data: LoginData) => {
  const email = data.email;
  const password = data.password;

  const supabase = await createClient();

  const {
    error,
    data: { session, user, weakPassword },
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    session,
    user,
    weakPassword,
    error: error ? { message: error.message } : null,
  };
};

export const sendConfirmEmail = async (email: string, password: string) => {
  const nextHeaders = await headers();
  const origin = nextHeaders.get("origin");

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };

  const res = await fetch(`${origin}/api/signup`, requestOptions);
  const json = await res.json();
  return json;
};

export const signUp = async (data: SignUpData) => {
  const email = data.email;
  const password = data.password;

  const json = await sendConfirmEmail(email, password);
  return json;
};

export const verifyOtp = async (otp: string, email: string) => {
  const supabase = await createClient();
  const res = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });

  return res;
};

export const resetPassword = async (data: ResetData) => {
  const password = data.password;

  const supabase = await createClient();

  const res = await supabase.auth.updateUser({
    password,
  });

  return res;
};

export const signOut = async (userType?: UserType) => {
  const supabase = await createClient();

  await supabase.auth.signOut();

  if (userType === "admin") {
    redirect("/admin/login");
  }

  return redirect("/");
};
