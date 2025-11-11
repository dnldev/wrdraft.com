import "./globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

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
          {children}
          <footer className="text-center pt-32 pb-8 text-slate-500 text-sm md:pl-64 flex justify-center items-center gap-4">
            <p>Wild Rift Dragon Lane Playbook</p>
            {/* ThemeSwitcher has been moved to MatchupCalculator.tsx */}
          </footer>
        </Providers>
      </body>
    </html>
  );
}
