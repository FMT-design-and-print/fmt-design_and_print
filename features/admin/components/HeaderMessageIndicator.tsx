"use client";

import { useEffect, useState } from "react";
import { MessageIndicator } from "./MessageIndicator";

export function HeaderMessageIndicator() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <MessageIndicator />;
}
