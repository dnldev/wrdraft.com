import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          {/* Add top padding for mobile, left padding for desktop */}
          <div className="pt-16 md:pt-0 md:pl-64">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
