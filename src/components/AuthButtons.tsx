import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { signOut } from "@/lib/actions/auth.actions";
import { Button, Group } from "@mantine/core";

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
            <Button type="submit" color="red">
              Logout
            </Button>
          </form>
        </div>
      ) : (
        <Group>
          <Button
            component={Link}
            href="/login"
            color="pink"
            variant="transparent"
          >
            Log in
          </Button>
          <Button
            component={Link}
            href="/signup"
            color="pink"
            variant="transparent"
          >
            Sign up
          </Button>
        </Group>
      )}
    </>
  );
}
