import { Header } from "@/components/Header";
import { ColorSchemeScript } from "@mantine/core";
import { ToastContainer } from "react-toastify";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/dropzone/styles.css";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import { Providers } from "./providers";
import { SessionProvider } from "@/components/SessionProvider";
import { AdminHeader } from "@/components/Header/AdminHeader";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FMT Design and Print",
  description:
    "We print everything on anything, including T-Shirts & Apparel, Cups, Mugs, Bottles, Labels, Packaging, Souvenirs, Large Format, Paper works, Frames, Engraving, Phone Cases, Pillows, branding, and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fmtdesignprint.com" />
        <meta
          property="og:title"
          content="FMT Design and Print — Design and Printing Services"
        />
        <meta
          property="og:description"
          content="We print everything on anything, including T-Shirts & Apparel, Cups, Mugs, Bottles, Labels, Packaging, Souvenirs, Large Format, Paper works, Frames, Engraving, Phone Cases, Pillows, branding, and more"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dnbmynikp/image/upload/v1715768873/FMT/FMT-meta-bg_wu3gjc.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://fmtdesignprint.com" />
        <meta
          property="twitter:title"
          content="FMT Design and Print — Design and Printing Services"
        />
        <meta
          property="twitter:description"
          content="We print everything on anything, including T-Shirts & Apparel, Cups, Mugs, Bottles, Labels, Packaging, Souvenirs, Large Format, Paper works, Frames, Engraving, Phone Cases, Pillows, branding, and more"
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/dnbmynikp/image/upload/v1715768873/FMT/FMT-meta-bg_wu3gjc.png"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
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
