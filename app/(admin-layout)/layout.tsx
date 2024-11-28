import { Footer } from "@/components/Footer";
import { AdminHeader } from "@/components/Header/AdminHeader";
import { SessionProvider } from "@/components/SessionProvider";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { ToastContainer } from "react-toastify";
import { Providers } from "../providers";
import AppBootstrap from "../bootstrap";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateMetaDetails();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppBootstrap section="admin">
            <AdminHeader />
            {children}
            <Footer />
          </AppBootstrap>
        </Providers>
        <SessionProvider />
        <ToastContainer />
      </body>
    </html>
  );
}
