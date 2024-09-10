"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@mantine/core";
import { redirect, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export const GoogleAuthButton = () => {
  const params = useSearchParams();
  const next = params.get("redirect");
  const signInWithGoogle = async () => {
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "http://localhost:3000";

    const redirectTo = next
      ? `${origin}/auth/callback?next=${next}`
      : `${origin}/auth/callback`;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
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
      onClick={signInWithGoogle}
      leftSection={<FcGoogle />}
      variant="default"
      color="gray"
      radius="xl"
      w="100%"
    >
      Google
    </Button>
  );
};
