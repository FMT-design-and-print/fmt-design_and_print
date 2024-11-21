"use client"; // Error components must be Client Components

import { ErrorComponent } from "@/components/Error";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // log this error
    console.error(error);
  }, [error]);

  return <ErrorComponent reset={reset} />;
}
