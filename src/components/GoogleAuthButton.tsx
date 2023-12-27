"use client";
import { useSession } from "@/store";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@mantine/core";
import { redirect } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export const GoogleAuthButton = () => {
  const { setSession, setUser } = useSession((state) => state);
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
    } else {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user);
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
