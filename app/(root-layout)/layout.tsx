import { generateMetaDetails } from "@/functions/generate-meta-details";
import "@mantine/carousel/styles.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/tiptap/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { Providers } from "../providers";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastContainer } from "react-toastify";
import AppBootstrap from "../bootstrap";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
          </AppBootstrap>
        </Providers>
        <SessionProvider />
        <ToastContainer />
      </body>
    </html>
  );
}
