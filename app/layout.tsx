import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { Battambang } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import dynamic from "next/dynamic";

// Dynamically import PixelTracker with SSR disabled
const PixelTracker = dynamic(() => import('@/src/components/PixelTracker'), { ssr: true });
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
    <head>
        {/* Meta Pixel Script */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '957725095608605');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=957725095608605&ev=PageView&noscript=1`}
            alt="facebook pixel no script image"
          />
        </noscript>
      </head> 
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
<Header />       
<Suspense fallback={null}>
          <PixelTracker />
        </Suspense>
 <main>{children}</main>
<Footer/>
      </body>
    </html>
  );
}
