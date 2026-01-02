/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";
import { createClient as createNewClient } from "@supabase/supabase-js";

export const createClient = () =>
  createBrowserClient<Database, any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const createAdminClient = () =>
  createNewClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SRK!
  );
