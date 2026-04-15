import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppLayout } from "../components/layout";

export const metadata: Metadata = {
  title: "Madhupur Rides Admin",
  description: "Admin operations panel for Madhupur ride booking MVP",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
