"use client";
import { useSession } from "@/store";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useCallback, useEffect } from "react";

let callCount = 0;

export const SessionProvider = () => {
  const { setSession, setUser } = useSession((state) => state);
  const supabase = createClient();

  const saveOAuthUserDetails = useCallback(
    async (user: User) => {
      const { error } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            email: user.email,
            provider: user.app_metadata.provider,
            firstName: user.user_metadata.full_name,
            profileImage: user.user_metadata.avatar_url,
            phone: user.phone,
            confirmed: true,
          },
        ])
        .select();

      if (error) {
        console.log(error);
        // TODO: handle error logging
      }
    },
    [supabase]
  );

  const confirmUser = useCallback(
    async (userId: string) => {
      const { error } = await supabase
        .from("users")
        .update({ confirmed: true })
        .eq("id", userId);

      if (error) {
        console.log(error);
        // TODO: handle error logging
      }
    },
    [supabase]
  );

  useEffect(() => {
    const readSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setUser(session?.user);

      if (session) {
        if (callCount >= 1) {
          return;
        }

        callCount = callCount + 1;
        console.log(callCount);

        const { error, data } = await supabase
          .from("users")
          .select("id, email, confirmed")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.log(error);
          // TODO: handle error logging
          return;
        }

        if (!data && session.user.app_metadata.provider === "google") {
          saveOAuthUserDetails(session.user);
        }

        if (data && !data.confirmed) {
          confirmUser(session.user.id);
        }
      }
    };

    readSession();
  }, [
    confirmUser,
    saveOAuthUserDetails,
    setSession,
    setUser,
    supabase,
    supabase.auth,
  ]);

  return <></>;
};
