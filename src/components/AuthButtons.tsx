"use client";
import { useSession } from "@/store";
import { Button, Group } from "@mantine/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

const excludedPaths = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export function AuthButtons() {
  const session = useSession((state) => state.session);
  const pathname = usePathname();

  if (!session && !excludedPaths.includes(pathname)) {
    return (
      <Group wrap="nowrap">
        <Button
          component={Link}
          href={`/login?redirect=${pathname}`}
          variant="default"
        >
          Log in
        </Button>
        <Button
          component={Link}
          href={`/signup?redirect=${pathname}`}
          className="btn"
        >
          Sign up
        </Button>
      </Group>
    );
  }

  return null;
}
