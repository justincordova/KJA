import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ScrollRestoration } from "@/components/motion/ScrollRestoration";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koenigsegg Jesko Absolut",
  description:
    "Koenigsegg Jesko Absolut — 1,600 HP, 0.278 Cd. The fastest car Koenigsegg will ever build.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ScrollRestoration />
        {children}
      </body>
    </html>
  );
}
