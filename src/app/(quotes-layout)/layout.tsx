import { Footer } from "@/components/Footer";
import { MetaHead } from "@/components/MetaHead";
import { SessionProvider } from "@/components/SessionProvider";
import { fmtDescription } from "@/constants";
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
import { Providers } from "../providers";
import "../globals.css";
import { Header } from "./quotes/Header";

const inter = Inter({ subsets: ["latin"] });
const title = "Review Quote | FMT Design and Print";

export const metadata: Metadata = {
  title,
  description: fmtDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <MetaHead title={title} />
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
        <SessionProvider />
        <ToastContainer />
      </body>
    </html>
  );
}
