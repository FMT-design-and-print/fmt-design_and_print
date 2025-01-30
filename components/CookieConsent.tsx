"use client";
import { useEffect, useState } from "react";
import { Paper, Text, Group, Button } from "@mantine/core";
import Link from "next/link";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <Paper
      shadow="md"
      p="md"
      withBorder
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "white",
      }}
    >
      <Group justify="space-between" align="center">
        <Text size="sm" style={{ flex: 1 }}>
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies.{" "}
          <Link
            href="/privacy-policy"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            Learn more
          </Link>
        </Text>
        <Group>
          <Button variant="filled" color="pink" onClick={handleAccept}>
            Accept
          </Button>
        </Group>
      </Group>
    </Paper>
  );
}
