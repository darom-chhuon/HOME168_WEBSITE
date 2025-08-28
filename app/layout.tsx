import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { Battambang } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const battambang = Battambang({
  weight:['400','700'],
  subsets: ['khmer'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "eCamShopping",
  description: "Online ecamShopping in Cambodia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={battambang.className}>     
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<Header />       
 <main>{children}</main>
<Footer/>
      </body>
    </html>
  );
}
