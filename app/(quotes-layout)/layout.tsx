import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { generateMetaDetails } from "@/functions/generate-meta-details";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { ToastContainer } from "react-toastify";
import { Providers } from "../providers";
import { Header } from "./quotes/Header";
import AppBootstrap from "../bootstrap";

const inter = Inter({ subsets: ["latin"] });
const title = "Review Quote | FMT Design and Print";
export const metadata: Metadata = generateMetaDetails(title);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AppBootstrap>
            <Header />
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
