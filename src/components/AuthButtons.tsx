import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { signOut } from "@/lib/actions/auth.actions";

export async function AuthButtons() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      {user ? (
        <div className="flex items-center gap-4">
          Hey, {user.email}!
          <form action={signOut}>
            <button className=" rounded-md bg-red-500 px-4 py-2 no-underline hover:bg-red-600">
              Logout
            </button>
          </form>
        </div>
      ) : (
        <>
          <Link
            href="/login"
            className="mx-1 flex rounded-md bg-slate-200 px-3 py-2 no-underline hover:bg-slate-300"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="mx-1 flex rounded-md bg-slate-200 px-3 py-2 no-underline hover:bg-slate-300"
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );
}
