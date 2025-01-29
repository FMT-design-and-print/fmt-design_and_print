import { generateMetaDetails } from "@/functions/generate-meta-details";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { Providers } from "../providers";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastContainer } from "react-toastify";
import AppBootstrap from "../bootstrap";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateMetaDetails();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppBootstrap>
            <Header />
            {children}
            <Footer />
            <CookieConsent />
          </AppBootstrap>
        </Providers>
        <SessionProvider />
        <ToastContainer />
      </body>
    </html>
  );
}
