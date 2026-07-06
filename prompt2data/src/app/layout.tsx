import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prompt2Data — Clean any dataset with a prompt",
  description:
    "Upload a messy CSV, Excel, or JSON file, describe how you want it cleaned, and an AI agent (gpt-oss) returns a clean dataset. Your data is never stored.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} antialiased`}>
      <body className="min-h-screen bg-white text-ink font-sans">{children}</body>
    </html>
  );
}
