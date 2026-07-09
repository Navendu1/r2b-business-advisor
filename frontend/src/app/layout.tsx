import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "R2B Business Advisor | Venture Architect",
  description: "Discover personalized business opportunities matching your skills, background, and budget using an 8-agent AI collaboration network.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-brand-bg text-slate-100">
        {children}
      </body>
    </html>
  );
}
