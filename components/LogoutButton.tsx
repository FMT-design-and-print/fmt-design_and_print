"use client";
import { signOut } from "@/lib/actions/auth.actions";
import { useSession } from "@/store";
import { UserType } from "@/types/user";
import { ActionIcon, Button, rem, Tooltip } from "@mantine/core";
import { useTransition } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { useActivityLogger } from "@/hooks/admin/useActivityLogger";

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
  const { setSession, setUser, session } = useSession((state) => state);
  const [isPending, startTransition] = useTransition();
  const { logActivity } = useActivityLogger();

  const handleLogout = async () => {
    if (session?.user && session.user.user_metadata?.userType === "admin") {
      const firstName = session.user.user_metadata?.firstName || "";
      const lastName = session.user.user_metadata?.lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();
      const displayName = fullName || session.user.email || "Admin User";

      logActivity({
        action: "LOGOUT",
        entity_type: "AUTH",
        entity_id: session.user.id,
        description: `Admin logged out (${session.user.email})`,
        user_details: {
          userId: session.user.id,
          name: displayName,
          role: session.user.user_metadata?.role,
          image: session.user.user_metadata?.avatar,
        }
      });
    }

    await startTransition(() => {
      signOut(userType);
    });

    setSession(null);
    setUser(undefined);
    localStorage.removeItem("fmt_initialUserDetailsSaved");
  };

  return iconOnly ? (
    <Tooltip label="Logout" position="right">
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
    </Tooltip>
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
