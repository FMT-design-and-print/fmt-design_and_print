"use server";
import {
  passwordResetFailedMessage,
  passwordResetSuccessMessage,
  signUpFailedMessage,
  userExistMessage,
  userKeyNotPresentMessage,
  verifyAccountMessage,
} from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  LoginDataSchema,
  ResetPasswordDataSchema,
  SignUpDataSchema,
} from "../validations";
import { UserType } from "@/types/user";

type SignUpData = z.infer<typeof SignUpDataSchema>;
type LoginData = z.infer<typeof LoginDataSchema>;
type ResetData = z.infer<typeof ResetPasswordDataSchema>;

const errorStatus = "messageStatus=error";
export const signIn = async (data: LoginData) => {
  const email = data.email;
  const password = data.password;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

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

export const signUp = async (data: SignUpData, next?: string | null) => {
  const origin = headers().get("origin");
  const email = data.email;
  const password = data.password;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: users, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email);

  if (error) {
    console.error(error);
    // TODO: Error logging
    return redirect(`/signup?message=${signUpFailedMessage}&${errorStatus}`);
  }

  if (users?.length === 0) {
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          userType: "regular",
        },
        emailRedirectTo: next
          ? `${origin}/auth/callback?next=${next}`
          : `${origin}/auth/callback`,
      },
    });

    if (signUpError) {
      console.error(signUpError);
      // TODO: Error logging
      return redirect(`/signup?message=${signUpFailedMessage}&${errorStatus}`);
    }

    // add user details to database
    const userId = newUser.user?.id || "";
    const provider = newUser.user?.app_metadata.provider;

    const { error: err } = await supabase
      .from("users")
      .insert([{ id: userId, email, provider }]);

    if (err && err?.code === "23503") {
      return redirect(
        `/signup?message=${userKeyNotPresentMessage}&${errorStatus}`
      );
    }

    return redirect(
      `/login?message=${verifyAccountMessage}&messageStatus=success`
    );
  } else {
    return redirect(`/signup?message=${userExistMessage}&${errorStatus}`);
  }
};

export const resetPassword = async (data: ResetData) => {
  const password = data.password;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return redirect(
      `/reset-password?message=${passwordResetFailedMessage}&messageStatus=error`
    );
  }

  redirect(`/login?message=${passwordResetSuccessMessage}&messageStatus=info`);
};

export const signOut = async (userType?: UserType) => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  if (userType === "admin") {
    redirect("/admin/login");
  }

  return redirect("/");
};
