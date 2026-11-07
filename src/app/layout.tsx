import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Comfortaa, DM_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/query-provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Cheveryday",
  description: "A calmer way to plan your time, tasks, and progress.",
  applicationName: "Cheveryday",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("font-sans", dmSans.variable, comfortaa.variable)}
    >
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
