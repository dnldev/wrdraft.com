import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
            {children}
            <footer className="text-center py-8 text-slate-500 text-sm md:pl-64">
                <p>Wild Rift Dragon Lane Playbook</p>
            </footer>
        </Providers>
        </body>
        </html>
    );
}