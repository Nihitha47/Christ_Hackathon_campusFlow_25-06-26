import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { QueryProvider } from "../components/providers/query-provider";

export const metadata: Metadata = {
  title: "CampusFlow",
  description: "Live student productivity app for hackathon demos"
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}