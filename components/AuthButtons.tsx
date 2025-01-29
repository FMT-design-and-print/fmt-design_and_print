"use client";
import { useSession } from "@/store";
import { Button, Group } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

const excludedPaths = ["/login", "/signup", "/reset-password"];
const excludedRedirectPaths: string[] = [
  "/login",
  "/signup",
  "/reset-password",
  "/forgot-password",
];

export function AuthButtons({ grow = false }: { grow?: boolean }) {
  const session = useSession((state) => state.session);
  const pathname = usePathname();

  if (!session && !excludedPaths.includes(pathname)) {
    return (
      <Group wrap="nowrap" grow={grow}>
        <Button
          size="xs"
          component={Link}
          href={
            excludedRedirectPaths.includes(pathname)
              ? "/login"
              : `/login?redirect=${pathname}`
          }
          variant="default"
        >
          Log in
        </Button>
        <Button
          size="xs"
          component={Link}
          href={
            excludedRedirectPaths.includes(pathname)
              ? "/signup"
              : `/signup?redirect=${pathname}`
          }
          className="btn"
        >
          Sign up
        </Button>
      </Group>
    );
  }

  return null;
}
