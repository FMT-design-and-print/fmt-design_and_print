"use client";
import { signOut } from "@/lib/actions/auth.actions";
import { useSession } from "@/store";
import { UserType } from "@/types/user";
import { ActionIcon, Button, rem } from "@mantine/core";
import { useTransition } from "react";
import { HiOutlineLogout } from "react-icons/hi";

interface Props {
  iconOnly?: boolean;
  userType?: UserType;
}

const buttonProps = {
  w: "100%",
  variant: "light",
  color: "red",
  className: "bg-red-100",
};

export const LogoutButton = ({ iconOnly, userType }: Props) => {
  const { setSession, setUser } = useSession((state) => state);
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    await startTransition(() => {
      signOut(userType);
    });

    setSession(null);
    setUser(undefined);
    localStorage.removeItem("fmt_initialUserDetailsSaved");
  };

  return iconOnly ? (
    <ActionIcon
      title="Logout"
      component="button"
      type="submit"
      onClick={handleLogout}
      disabled={isPending}
      {...buttonProps}
    >
      <HiOutlineLogout style={{ width: rem(16), height: rem(16) }} />
    </ActionIcon>
  ) : (
    <Button
      title="Logout"
      leftSection={
        <HiOutlineLogout style={{ width: rem(16), height: rem(16) }} />
      }
      type="submit"
      onClick={handleLogout}
      disabled={isPending}
      {...buttonProps}
    >
      Logout
    </Button>
  );
};
