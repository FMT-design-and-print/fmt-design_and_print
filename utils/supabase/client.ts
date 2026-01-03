/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";

export const createClient = () =>
  createBrowserClient<Database, any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
