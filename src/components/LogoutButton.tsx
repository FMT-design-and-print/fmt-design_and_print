"use client";
import { signOut } from "@/lib/actions/auth.actions";
import { useSession } from "@/store";
import { Button, rem } from "@mantine/core";
import { useTransition } from "react";
import { HiOutlineLogout } from "react-icons/hi";

export const LogoutButton = () => {
  const { setSession, setUser } = useSession((state) => state);
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    await startTransition(() => {
      signOut();
    });

    setSession(null);
    setUser(undefined);
  };

  return (
    <Button
      leftSection={
        <HiOutlineLogout style={{ width: rem(16), height: rem(16) }} />
      }
      w="100%"
      type="submit"
      variant="light"
      color="red"
      className="bg-red-100"
      onClick={handleLogout}
      disabled={isPending}
    >
      Logout
    </Button>
  );
};
