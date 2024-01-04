import { Header } from "@/components/Header";
import { ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { Providers } from "./providers";
import { SessionProvider } from "@/components/SessionProvider";
import { AdminHeader } from "@/components/Header/AdminHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FMT Design and Print",
  description: "Graphic Design and Printing Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          <AdminHeader />
          {children}
        </Providers>
        <SessionProvider />
      </body>
    </html>
  );
}
