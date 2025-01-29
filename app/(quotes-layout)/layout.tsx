import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";
import { Inter } from "next/font/google";
import React from "react";
import { ToastContainer } from "react-toastify";
import { Providers } from "../providers";
import { Header } from "./quotes/Header";
import AppBootstrap from "../bootstrap";
import { QuoteDetailsProvider } from "./QuoteTypeProvider";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

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
            <QuoteDetailsProvider>
              <Header />
              {children}
              <Footer />
              <CookieConsent />
            </QuoteDetailsProvider>
          </AppBootstrap>
        </Providers>
        <SessionProvider />
        <ToastContainer />
      </body>
    </html>
  );
}
