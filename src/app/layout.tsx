import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Geist_Mono, Prata } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "@/components/Providers";
import Header from "@/components/Header";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const prata = Prata({
  weight: "400",
  variable: "--font-prata",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bera Tip",
  description: "Bera Tip is a platform for sharing tips with the greatest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${prata.variable} ${geistMono.variable} antialiased `}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
