"use client";
import useOrigin from "@/hooks/useOrigin";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@mantine/core";
import { redirect, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { SearchParamsProvider } from "@/components/SearchParamsProvider";

// Inner component with search params logic
const GoogleAuthButtonContent = () => {
  const params = useSearchParams();
  const origin = useOrigin();
  const next = params.get("redirect");
  const signInWithGoogle = async () => {
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

// Wrapper component with Suspense boundary
export const GoogleAuthButton = () => {
  return (
    <SearchParamsProvider>
      <GoogleAuthButtonContent />
    </SearchParamsProvider>
  );
};
