import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Havenstone Realty — Luxury Properties in Lagos, Nigeria",
  description:
    "Discover exceptional homes for sale and to rent across Lagos — Ikoyi, Victoria Island, Lekki, Ikeja and Ajah. Havenstone Realty is a demonstration real estate agency website.",
  keywords: [
    "Havenstone Realty",
    "luxury real estate Lagos",
    "property for sale Lagos",
    "houses for rent Nigeria",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster position="bottom-left" richColors closeButton />
      </body>
    </html>
  );
}
