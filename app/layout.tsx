import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { TabBar } from "@/components/TabBar";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: "Flus – Hvorfor har ingen fortalt meg dette før?",
  description:
    "50 kr om dagen kan bli til over 4 millioner. Sjekk hva din sparing kan bli til med rentes rente.",
  applicationName: "Flus",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flus",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Flus – Hvorfor har ingen fortalt meg dette før?",
    description:
      "50 kr om dagen kan bli til over 4 millioner. Sjekk hva din sparing kan bli til.",
    url: "https://flus-lake.vercel.app",
    siteName: "Flus",
    locale: "nb_NO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flus – Hvorfor har ingen fortalt meg dette før?",
    description:
      "50 kr om dagen kan bli til over 4 millioner. Sjekk hva din sparing kan bli til.",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nb"
      className={`${sans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AnalyticsProvider />
        <Analytics />
        <div className="mx-auto w-full max-w-md flex-1 flex flex-col">
          <main className="flex-1 flex flex-col">{children}</main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
