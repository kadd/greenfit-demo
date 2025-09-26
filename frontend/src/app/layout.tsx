import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ContentProvider } from "@/contexts/contentContext";

import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenFit Demo",
  description: "Individuelles Personal Training in Hamburg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <ContentProvider>
          {/* Hauptinhalt */}
          <main className="min-h-[80vh] flex flex-col items-center justify-center">
            {children}
          </main>
          {/* Footer */}
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
