// app/layout.tsx
import "./globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import { FloatingActions } from "@/components/calculator/FloatingActions";
import { Navigation } from "@/components/core/Navigation";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Wild Rift Dragon Lane Playbook",
  description: "A data-driven playbook for Wild Rift bot laners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${GeistSans.className} bg-background text-foreground`}>
        <Providers>
          <Navigation />
          <main className="p-6 md:p-8 md:pl-72">{children}</main>
          <FloatingActions />
          <footer className="text-center pt-32 pb-8 text-slate-500 text-sm md:pl-64 flex justify-center items-center gap-4">
            <p>Wild Rift Dragon Lane Playbook</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
