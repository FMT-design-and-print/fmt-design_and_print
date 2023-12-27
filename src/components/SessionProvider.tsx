"use client";
import { useSession } from "@/store";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export const SessionProvider = () => {
  const { setSession, setUser } = useSession((state) => state);
  const supabase = createClient();

  useEffect(() => {
    const readSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user);
    };

    readSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase.auth]);

  return <></>;
};
