"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export const GoogleAuthButton = () => {
  const signInWithGoogle = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `http://localhost:3000/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
  };

  return (
    <Button
      className="my-4 w-full rounded-full border-1 bg-white"
      disableRipple
      onClick={signInWithGoogle}
    >
      <FcGoogle />
      Google
    </Button>
  );
};
