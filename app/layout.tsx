import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CookiesBanner } from "@/components/cookies-banner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "BuilderIQ - Premium Builder Intelligence Platform",
  description:
    "Know every builder's deal before your buyers do. The most sophisticated real estate intelligence platform for professionals.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "BuilderIQ.IN - Know Every Builder Deal in Indiana",
    description:
      "AI-powered builder incentive intelligence for Indiana real estate professionals. Track D.R. Horton, Lennar, M/I Homes, and more.",
    url: "https://builderiq.in",
    siteName: "BuilderIQ",
    images: [
      {
        url: "https://builderiq.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BuilderIQ - Indiana Builder Intelligence Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BuilderIQ.IN - Know Every Builder Deal in Indiana",
    description:
      "AI-powered builder incentive intelligence for Indiana real estate professionals.",
    images: ["https://builderiq.in/og-image.jpg"],
  },

  // ✅ Facebook-only OG tags
  other: {
    "fb:app_id": "YOUR_FACEBOOK_APP_ID", // optional
    "fb:pages": "YOUR_PAGE_ID", // optional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={playfair.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <CookiesBanner />
        <Analytics />
      </body>
    </html>
  );
}
