"use server";
import {
  authFailedMessage,
  signUpFailedMessage,
  userExistMessage,
  userKeyNotPresentMessage,
} from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LoginDataSchema, SignUpDataSchema } from "../validations";

type SignUpData = z.infer<typeof SignUpDataSchema>;
type LoginData = z.infer<typeof LoginDataSchema>;

export const signIn = async (data: LoginData) => {
  const result = LoginDataSchema.safeParse(data);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  const email = data.email;
  const password = data.password;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(`/login?message=${authFailedMessage}`);
  }

  return redirect("/");
};

export const signUp = async (data: SignUpData) => {
  const origin = headers().get("origin");
  const result = SignUpDataSchema.safeParse(data);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  const email = data.email;
  const password = data.password;

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: users, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email);

  if (error) {
    return redirect(`/signup?message=${signUpFailedMessage}`);
  }

  if (users?.length === 0) {
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (signUpError) {
      return redirect(`/signup?message=${signUpFailedMessage}`);
    }

    // add user details to database
    const userId = newUser.user?.id;

    const { error: err } = await supabase
      .from("users")
      .insert([{ id: userId, email }]);

    if (err && err?.code === "23503") {
      return redirect(`/signup?message=${userKeyNotPresentMessage}`);
    }

    return redirect(`/signup?action=verify`);
  } else {
    return redirect(`/signup?message=${userExistMessage}`);
  }
};

export const signOut = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();
  return redirect("/");
};
