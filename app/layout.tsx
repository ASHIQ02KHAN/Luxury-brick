import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor/Cursor";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "THE MONOLITH — The World's First Luxury Brick",
  description:
    "Handcrafted from raw terra-cotta. Zero carbon footprint. Five centuries of structural integrity. THE MONOLITH is the world's most essential object, reimagined as a luxury artifact.",
  keywords: [
    "luxury brick",
    "sustainable construction",
    "zero carbon",
    "terra-cotta",
    "the monolith",
    "artisanal brick",
  ],
  openGraph: {
    title: "THE MONOLITH — The World's First Luxury Brick",
    description: "Zero Carbon. Five Centuries. One Perfect Form.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
