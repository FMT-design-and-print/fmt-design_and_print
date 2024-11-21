import { Footer } from "@/components/Footer";
import { AdminHeader } from "@/components/Header/AdminHeader";
import { SessionProvider } from "@/components/SessionProvider";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../globals.css";
import { Providers } from "../providers";

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
          <AdminHeader />
          {children}
          <Footer />
        </Providers>
        <SessionProvider />
        <ToastContainer />
      </body>
    </html>
  );
}
